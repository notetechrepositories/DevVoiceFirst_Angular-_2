import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { AnswerTypeService } from '../../Service/AnswerTypeService/answer-type-service';
import { AnswerTypeModel, CompanyAnswerTypeModel } from '../../Models/AnswerTypeModel';

@Component({
  selector: 'app-answer-type',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './answer-type.html',
  styleUrl: './answer-type.css'
})

export class AnswerType {

  companyAnswerTypeData: CompanyAnswerTypeModel[] = [];
  filteredData: CompanyAnswerTypeModel[] = [];
  sysAnswerTypes: AnswerTypeModel[] = [];
  filteredSysData: AnswerTypeModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter = '';
  searchSysTerm: string = '';

  isModalVisible: boolean = false;
  isAllSelected = false;
  isEditMode: boolean = false;

  answerTypeForm!: FormGroup;

  selectedAnswerTypeIds: string[] = [];
  selectedAnswerTypeId: string[] = [];
  selectedAnswerIds: string | null = null;
  originalItem: any;

  constructor(private fb: FormBuilder,
    private utilityService: UtilityService,
    private answerTypeService: AnswerTypeService
  ) { }

  ngOnInit() {
    this.getCompanyAnswerType();
    this.getAnswerType();
    this.answerTypeForm = this.fb.group({
      id: [''],
      companyAnswerTypeName: ['', Validators.required],
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
    this.filteredData = this.companyAnswerTypeData.filter(item =>
      item.companyAnswerTypeName.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onSysSearch() {
    const term = this.searchSysTerm.toLowerCase();
    this.filteredSysData = this.sysAnswerTypes.filter(item =>
      item.answerTypeName.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.filteredData = this.companyAnswerTypeData.filter(item => {
      if (this.statusFilter === '') return true;
      return Boolean(item.status) === (this.statusFilter === 'true');

    });
    this.updateSelectAllStatus();
  }

  updateSelectAllStatus() {
    this.isAllSelected = this.pagedData.length > 0 && this.pagedData.every(x => this.selectedAnswerTypeIds.includes(x.id));
  }

  // ==================================================================

  getCompanyAnswerType() {
    this.answerTypeService.getAllCompanyAnswerType().subscribe({
      next: res => {
        this.companyAnswerTypeData = res.body.data
        this.filteredData = [...this.companyAnswerTypeData];
        this.markSelectedTypes();
      },
      error: err => {
        this.utilityService.showError(err.status, err.error?.message || 'Get failed.');
      }
    });
  }

  getAnswerType() {
    this.answerTypeService.getAnswerType().subscribe({
      next: res => {
        this.sysAnswerTypes = res.body.data;
        this.filteredSysData = [...this.sysAnswerTypes]
        this.markSelectedTypes();
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

  private markSelectedTypes() {
    if (!this.sysAnswerTypes.length || !this.companyAnswerTypeData.length) return;
    const companyAnswerTypeIds = new Set(this.companyAnswerTypeData.map((item) => item.answerTypeId));
    this.sysAnswerTypes.forEach(type => {
      type.selected = companyAnswerTypeIds.has(type.id);
    });
  }


  openModal(editItem?: CompanyAnswerTypeModel) {
    this.isModalVisible = true;
    this.isEditMode = !!editItem;
    this.selectedAnswerIds = editItem?.id || null;
    if (editItem) {
      this.originalItem = { ...editItem };
      this.answerTypeForm.patchValue({
        id: editItem.id,
        companyAnswerTypeName: editItem.companyAnswerTypeName,

      });
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.answerTypeForm.reset();
  }

  submitAnswerType() {
    const form = this.answerTypeForm;
    const formValue = form.value;
    const payload = {
      companyAnswerTypeName: formValue.companyAnswerTypeName,

    };
    if (this.answerTypeForm.invalid) {
      this.answerTypeForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedAnswerIds };
      this.utilityService.setIfDirty(form, 'companyAnswerTypeName', updatedFields);
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.answerTypeService.updateCompanyAnswerType(updatedFields).subscribe({
        next: (res) => {
          const updatedItem = res.body?.data;
          if (updatedItem) {
            const filteredIndex = this.filteredData.findIndex(item => item.id === updatedItem.id);
            if (filteredIndex !== -1) {
              this.filteredData[filteredIndex] = updatedItem;
            }
          }
          this.closeModal();
          this.utilityService.success(res.body?.message || 'Media Type updated.');
        },
        error: err => {
          this.utilityService.showError(err.status, err.error?.message || 'Update failed.');
        }
      });
    }
    else {
      this.answerTypeService.createCompanyAnswertype(payload).subscribe({
        next: (res) => {

          if (res.status == 201) {
            const newItem = res.body?.data;
            if (newItem) {
              this.filteredData.push(newItem);
            }
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
      this.answerTypeService.deleteCompanyAnswerType(this.selectedAnswerTypeIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.companyAnswerTypeData = this.companyAnswerTypeData.filter(item => !deletedIds.includes(item.id));

          const selectedIds = new Set(this.companyAnswerTypeData.map(item => item.answerTypeId));
          this.sysAnswerTypes.forEach(type => {
            type.selected = selectedIds.has(type.id);
          });
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


  // ------------------------ System AnswerTypes -----------------------------

  toggleAnswerType(answerType: any) {
    if (!answerType.selected) {
      const payload = {
        answerTypeId: answerType.id,
      };
      this.answerTypeService.createCompanyAnswertype(payload).subscribe({
        next: (res) => {
          if (res.status == 201) {
            const newItem = res.body?.data;
            if (newItem) {
              this.filteredData.push(newItem);
            }
          }
          this.utilityService.success(res.body.message);
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Creation failed');
        }
      });
    }
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
      this.answerTypeService.updateCompanyAnswerTypeStatus(payload).subscribe({
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
