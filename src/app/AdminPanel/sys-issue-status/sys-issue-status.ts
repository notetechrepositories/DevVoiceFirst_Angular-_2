import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerTypeModel } from '../../Models/AnswerTypeModel';
import { AnswerTypeService } from '../../Service/AnswerTypeService/answer-type-service';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssueStatusModel } from '../../Models/IssueStatusModel';
import { IssueStatusService } from '../../Service/IssueStatusService/issue-status-service';

@Component({
  selector: 'app-sys-issue-status',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sys-issue-status.html',
  styleUrl: './sys-issue-status.css'
})
export class SysIssueStatus {
  data: IssueStatusModel[] = [];
  filteredData: IssueStatusModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter: string = '';
  selectedIssueStatusIds: string[] = [];
  isAllSelected = false;
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  issueStatusForm!: FormGroup;
  isEditMode: boolean = false;
  originalItem: any;

  selectedIssueStatusId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private issueStatusService: IssueStatusService
  ) { }

  ngOnInit() {
    this.getIssueStatus();

    this.issueStatusForm = this.fb.group({
      id: [''],
      issueStatus: ['', Validators.required],
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

  goToPage(page: number) {
    this.currentPage = page;
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.issueStatus.toLowerCase().includes(term)
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

  updateSelectAllStatus() {
    this.isAllSelected = this.selectedIssueStatusIds.length === this.pagedData.length;
  }



  // ----------------


  openModal(editItem?: IssueStatusModel) {
    this.isModalVisible = true;
    this.isEditMode = !!editItem;
    this.selectedIssueStatusId = editItem?.id || null;
    if (editItem) {
      this.originalItem = { ...editItem };
      this.issueStatusForm.patchValue({
        id: editItem.id,
        issueStatus: editItem.issueStatus,
      });
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.issueStatusForm.reset();
  }

  getIssueStatus() {
    this.issueStatusService.getAllIssueStatus().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

  submitIssueStatus() {
    const form = this.issueStatusForm;
    const formValue = form.value;
    const payload = {
      issueStatus: formValue.issueStatus,

    };
    if (this.issueStatusForm.invalid) {
      this.issueStatusForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedIssueStatusId };

      this.utilityService.setIfDirty(form, 'issueStatus', updatedFields);
      // Only send update if any field has changed
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.issueStatusService.updateIssueStatus(updatedFields).subscribe({
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
      this.issueStatusService.createIssueStatus(payload).subscribe({
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


  async deleteIssueStatus(): Promise<void> {
    const message = `Delete ${this.selectedIssueStatusIds.length} Answer type(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.issueStatusService.deleteIssueStatus(this.selectedIssueStatusIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.selectedIssueStatusIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }

      });
      this.selectedIssueStatusIds = [];
      this.isAllSelected = false;

    }
  }

  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedIssueStatusIds.includes(id)) {
        this.selectedIssueStatusIds.push(id);
      }
    } else {
      this.selectedIssueStatusIds = this.selectedIssueStatusIds.filter(x => x !== id);
    }
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedIssueStatusIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedIssueStatusIds = [];
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

      this.issueStatusService.updateIssueStatusStatus(payload).subscribe({
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


