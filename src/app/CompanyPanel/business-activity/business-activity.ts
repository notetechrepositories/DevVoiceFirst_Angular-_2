import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BusinessActivityService } from '../../Service/BusinessActivityService/business-activity';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { BusinessActivityModel, CompanyBusinessActivityModel } from '../../Models/BusinessActivityModel';


@Component({
  selector: 'app-business-activity',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './business-activity.html',
  styleUrl: './business-activity.css'
})
export class BusinessActivity {
 companyAnswerTypeData: CompanyBusinessActivityModel[] = [];
  filteredData: CompanyBusinessActivityModel[] = [];
  sysBusinessActivity: BusinessActivityModel[] = [];
  filteredSysData: BusinessActivityModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter = '';
  searchSysTerm: string = '';

  isModalVisible: boolean = false;
  isAllSelected = false;
  isEditMode: boolean = false;

  businessActivityForm!: FormGroup;

  selectedBusinessActivityIds: string[] = [];
  selectedBusinessActivityId: string[] = [];
  selectedActivtyIds: string | null = null;
  originalItem: any;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private businessActivityService: BusinessActivityService
  ) { }

  ngOnInit() {
    this.getCompanyAnswerType();
    this.getAnswerType();
    this.businessActivityForm = this.fb.group({
      id: [''],
      activityName: ['', Validators.required],
  
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
      item.activityName.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onSysSearch() {
    const term = this.searchSysTerm.toLowerCase();
    this.filteredSysData = this.sysBusinessActivity.filter(item =>
      item.activityName.toLowerCase().includes(term)
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
    this.isAllSelected = this.pagedData.length > 0 && this.pagedData.every(x => this.selectedBusinessActivityIds.includes(x.id));
  }

  // ==================================================================

  getCompanyAnswerType() {
    this.businessActivityService.getCompanyBusinessActivity().subscribe({
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
    this.businessActivityService.getBusinessActivity().subscribe({
      next: res => {
        this.sysBusinessActivity = res.body.data;
        this.filteredSysData = [...this.sysBusinessActivity]
        this.markSelectedTypes();
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

  private markSelectedTypes() {
    if (!this.sysBusinessActivity.length || !this.companyAnswerTypeData.length) return;
    const companyAnswerTypeIds = new Set(this.companyAnswerTypeData.map((item) => item.id));
    this.sysBusinessActivity.forEach(type => {
      type.selected = companyAnswerTypeIds.has(type.id);
    });
  }


  openModal(editItem?: CompanyBusinessActivityModel) {
    this.isModalVisible = true;
    this.isEditMode = !!editItem;
    this.selectedActivtyIds = editItem?.id || null;
    if (editItem) {
      this.originalItem = { ...editItem };
      this.businessActivityForm.patchValue({
        id: editItem.id,
        companyAnswerTypeName: editItem.activityName,

      });
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.businessActivityForm.reset();
  }

  submitAnswerType() {
    const form = this.businessActivityForm;
    const formValue = form.value;
    const payload = {
      companyAnswerTypeName: formValue.companyAnswerTypeName,

    };
    if (this.businessActivityForm.invalid) {
      this.businessActivityForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedActivtyIds };
      this.utilityService.setIfDirty(form, 'companyAnswerTypeName', updatedFields);
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.businessActivityService.updateCompanyBusinessActivity(updatedFields).subscribe({
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
      this.businessActivityService.createCompanyBusinessActivity(payload).subscribe({
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
    const message = `Delete ${this.selectedBusinessActivityIds.length} Answer type(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.businessActivityService.deleteCompanyBusinessActivity(this.selectedBusinessActivityIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.companyAnswerTypeData = this.companyAnswerTypeData.filter(item => !deletedIds.includes(item.id));

          const selectedIds = new Set(this.companyAnswerTypeData.map(item => item.id));
          this.sysBusinessActivity.forEach(type => {
            type.selected = selectedIds.has(type.id);
          });
          this.selectedBusinessActivityIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }
      });
      this.selectedBusinessActivityIds = [];
      this.isAllSelected = false;

    }
  }


  // ------------------------ System AnswerTypes -----------------------------

  toggleAnswerType(answerType: any) {
    if (!answerType.selected) {
      const payload = {
        answerTypeId: answerType.id,
      };
      this.businessActivityService.createCompanyBusinessActivity(payload).subscribe({
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
      if (!this.selectedBusinessActivityIds.includes(id)) {
        this.selectedBusinessActivityIds.push(id);
      }
    } else {
      this.selectedBusinessActivityIds = this.selectedBusinessActivityIds.filter(x => x !== id);
    }
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedBusinessActivityIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedBusinessActivityIds = [];
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
      this.businessActivityService.updateCompanyBusinessActivityStatus(payload).subscribe({
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
