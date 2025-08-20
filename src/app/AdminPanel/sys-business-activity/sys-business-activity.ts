import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BusinessActivityService } from '../../Service/BusinessActivityService/business-activity';
import { BusinessActivityModel } from '../../Models/BusinessActivityModel';
import { BusinessActivity } from '../../CompanyPanel/business-activity/business-activity';
import { UtilityService } from '../../Service/UtilityService/utility-service';


@Component({
  selector: 'app-sys-business-activity',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sys-business-activity.html',
  styleUrl: './sys-business-activity.css'
})
export class SysBusinessActivity {
  data: BusinessActivityModel[] = [];
  filteredData: BusinessActivityModel[] = [];

  itemsPerPage = 10;  
  currentPage = 1;
  searchTerm: string = '';
  statusFilter: string = '';
  selectedactivityIds: string[] = [];
  isAllSelected = false;
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  businessActivityForm!: FormGroup;
  isEditMode: boolean = false;
  originalItem: any;

  checkIcon = '<i class="pi pi-check text-success"></i>';
  crossIcon = '<i class="pi pi-times-circle text-danger"></i>';

  businessActivities: any[] = [];
  selectedActivityId: string | null = null;

  constructor(private fb: FormBuilder, private businessActivityService: BusinessActivityService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.getBusinessActivity();
    this.businessActivityForm = this.fb.group({
      id: [''],
      activityName: ['', Validators.required],
      isForCompany: [false],
      isForBranch: [false]
    });
  }

  //---------------- pagination ----------------

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


  //---------------- Filter ----------------

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.activityName.toLowerCase().includes(term)
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
  
  // ---------------- Modal ----------------

  openModal(editItem?: BusinessActivityModel) {
    this.isModalVisible = true;
    this.isEditMode = !!editItem;
    this.selectedActivityId = editItem?.id || null;
    if (editItem) {
      
      this.businessActivityForm.patchValue({
        id: editItem.id,
        activityName: editItem.activityName,
        isForCompany: editItem.isForCompany,
        isForBranch: editItem.isForBranch
      });
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.isEditModalVisible = false;
    this.businessActivities = [];
    this.businessActivityForm.reset();
  }

  getBusinessActivity() {
    this.businessActivityService.getBusinessActivity().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

  removeActivity(index: number): void {
    this.businessActivities.splice(index, 1);
  }

  submitActivity() {
    const form = this.businessActivityForm;
    const formValue = form.value;
    const payload = {
      activityName: formValue.activityName,
      isForCompany: !!formValue.isForCompany,
      isForBranch: !!formValue.isForBranch
    };
      if(this.businessActivityForm.invalid){
         this.businessActivityForm.markAllAsTouched();
          return;
      }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedActivityId };

      this.utilityService.setIfDirty(form, 'activityName', updatedFields);
      this.utilityService.setIfDirty(form, 'isForCompany', updatedFields);
      this.utilityService.setIfDirty(form, 'isForBranch', updatedFields);
      // Only send update if any field has changed
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.businessActivityService.updateBusinessActivity(updatedFields).subscribe({
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
    
      this.businessActivityService.createBusinessActivity(payload).subscribe({
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


  async deleteBusinessActivity(): Promise<void> {
    const message = `Delete ${this.selectedactivityIds.length} business activity(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.businessActivityService.deleteBusinessActivity(this.selectedactivityIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.selectedactivityIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }
      });
      this.selectedactivityIds = [];
      this.isAllSelected = false;
    }
  }



  updateSelectAllStatus() {
    this.isAllSelected = this.selectedactivityIds.length === this.pagedData.length;
  }

  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedactivityIds.includes(id)) {
        this.selectedactivityIds.push(id);
      }
    } else {
      this.selectedactivityIds = this.selectedactivityIds.filter(x => x !== id);
    }

    // this.updateSelectAllStatus();
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedactivityIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedactivityIds = [];
    }
    this.isAllSelected = checked;
  }
  
  async toggleStatus(item: any): Promise<void> {
    const updatedStatus = !item.status;
    const payload = {
      id: item.id,
      status: updatedStatus
    };
    const message = `Are you sure you want to set this role as ${updatedStatus ? 'Active' : 'Inactive'}?`;
    const result = await this.utilityService.confirmDialog(message, 'update');

    if (result.isConfirmed) {

      this.businessActivityService.updateBusinessActivityStatus(payload).subscribe({
        next: () => {
          item.status = updatedStatus;
          this.utilityService.success('Status updated successfully');
        },
        error: err => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to Update Status.');
        }
      });
    }
  }
}
