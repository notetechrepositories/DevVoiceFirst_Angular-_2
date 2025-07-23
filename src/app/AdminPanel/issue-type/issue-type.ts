import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerTypeModel } from '../../Models/AnswerTypeModel';
import { AnswerTypeService } from '../../Service/AnswerTypeService/answer-type-service';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-issue-type',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './issue-type.html',
  styleUrl: './issue-type.css'
})
export class IssueType {
 data: AnswerTypeModel[] = [];
  filteredData: AnswerTypeModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter: string = '';
  selectedAnswerTypeIds: string[] = [];
  isAllSelected = false;
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  answerTypeForm!: FormGroup;
  isEditMode: boolean = false;
  originalItem: any;

  answerTypes: any[] = [];
  selectedAnswerTypeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private answerTypeSevice: AnswerTypeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAnswerType();
    this.answerTypeForm = this.fb.group({
      id: [''],
      answerTypeName: ['', Validators.required],
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  get pagedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(start, start + this.itemsPerPage);
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.answerTypeName.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.filteredData = this.data.filter(item => {
      if (this.statusFilter === '') return true;
      return Boolean(item.status) === (this.statusFilter === 'true');

    });
    this.updateSelectAllStatus();
  }


  goToPage(page: number) {
    this.currentPage = page;
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // ----------------


  openModal() {
     this.router.navigate(['admin/add-issue-type']);
  }

  closeModal() {
    this.isModalVisible = false;
    this.answerTypes = [];
    this.answerTypeForm.reset();
  }

  getAnswerType() {
    this.answerTypeSevice.getAnswerType().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }
  removeActivity(index: number): void {
    this.answerTypes.splice(index, 1);
  }
  submitAnswerType() {
    const form = this.answerTypeForm;
    const formValue = form.value;
    const payload = {
      answerTypeName: formValue.answerTypeName,

    };
    if (this.answerTypeForm.invalid) {
      this.answerTypeForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedAnswerTypeId };

      this.utilityService.setIfDirty(form, 'answerTypeName', updatedFields);
      // Only send update if any field has changed
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.answerTypeSevice.updateAnswerType(updatedFields).subscribe({
        next: (res) => {
          const updatedItem = res.body?.data;

          if (updatedItem) {
            const filteredIndex = this.filteredData.findIndex(item => item.id === updatedItem.id);
            if (filteredIndex !== -1) {
              this.filteredData[filteredIndex] = updatedItem;
            }
          }
          this.closeModal();
          this.utilityService.success(res.body?.message || 'Activity updated.');
        },
        error: err => {
          this.utilityService.showError(err.status, err.error?.message || 'Update failed.');
        }
      });
    }
    else {
      this.answerTypeSevice.createAnswertype(payload).subscribe({
        next: (res) => {
          const newItem = res.body?.data;
          if (newItem) {
            this.filteredData.push(newItem);
          }
          this.closeModal();
          this.utilityService.success(res.body.message);
        },
        error: err => {
          this.utilityService.showError(err.status, err.error.message);
        }
      });
    }


  }
  async deleteAnswerType(): Promise<void> {
    const message = `Delete ${this.selectedAnswerTypeIds.length} Answer type(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.answerTypeSevice.deleteAnswerType(this.selectedAnswerTypeIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.selectedAnswerTypeIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }

      });
      this.selectedAnswerTypeIds = [];
      this.isAllSelected = false;

    }
  }
  updateSelectAllStatus() {
    this.isAllSelected = this.selectedAnswerTypeIds.length === this.pagedData.length;
  }

  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedAnswerTypeIds.includes(id)) {
        this.selectedAnswerTypeIds.push(id);
      }
    } else {
      this.selectedAnswerTypeIds = this.selectedAnswerTypeIds.filter(x => x !== id);
    }
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedAnswerTypeIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedAnswerTypeIds = [];
    }

    this.isAllSelected = checked;
  }

  async toggleStatus(item: any): Promise<void> {
    const updatedStatus = !item.status;
    const payload = {
      id: item.id,
      status: updatedStatus
    };
    const message = `Are you sure you want to set this answer type as ${updatedStatus ? 'Active' : 'Inactive'}?`;
    const result = await this.utilityService.confirmDialog(message, 'update');

    if (result.isConfirmed) {

      this.answerTypeSevice.updateAnswerTypeStatus(payload).subscribe({
        next: () => {
          item.status = updatedStatus;
          this.utilityService.success('Status updated successfully');
        },
        error: err => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to Update Status.')

        }
      });
    }
  }
}
