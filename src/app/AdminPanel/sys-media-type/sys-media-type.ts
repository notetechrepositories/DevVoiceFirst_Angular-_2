import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MediaTypeModel } from '../../Models/MediaTypeModel';
import { MediaTypeService } from '../../Service/MediaTypeService/media-type-service';
import { UtilityService } from '../../Service/UtilityService/utility-service';

@Component({
  selector: 'app-sys-media-type',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sys-media-type.html',
  styleUrl: './sys-media-type.css'
})
export class SysMediaType {
data: MediaTypeModel[] = [];
  filteredData: MediaTypeModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter: string = '';
  selectedMediaTypeIds: string[] = [];
  isAllSelected = false;
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  mediaTypeForm!: FormGroup;
  isEditMode: boolean = false;
  originalItem: any;

  mediaTypes: any[] = [];
  selectedMediaTypeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private mediaTypeService:MediaTypeService
  ) { }

  ngOnInit() {
    this.getMediaType();
    this.mediaTypeForm = this.fb.group({
      id: [''],
      description: ['', Validators.required],
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
      item.description.toLowerCase().includes(term)
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


  openModal(editItem?: MediaTypeModel) {
    this.isModalVisible = true;
    this.isEditMode = !!editItem;
    this.selectedMediaTypeId = editItem?.id || null;
    if (editItem) {
      this.originalItem = { ...editItem };
      this.mediaTypeForm.patchValue({
        id: editItem.id,
        description: editItem.description,

      });
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.mediaTypes = [];
    this.mediaTypeForm.reset();
  }

  getMediaType() {
    this.mediaTypeService.getAllMediatype().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }
  removeActivity(index: number): void {
    this.mediaTypes.splice(index, 1);
  }
  submitMediaType() {
    const form = this.mediaTypeForm;
    const formValue = form.value;
    const payload = {
      description: formValue.description,

    };
    if (this.mediaTypeForm.invalid) {
      this.mediaTypeForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedMediaTypeId };

      this.utilityService.setIfDirty(form, 'description', updatedFields);
      // Only send update if any field has changed
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.mediaTypeService.updateMediaType(updatedFields).subscribe({
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
      this.mediaTypeService.createMediaType(payload).subscribe({
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
  async deleteMediaType(): Promise<void> {
    const message = `Delete ${this.selectedMediaTypeIds.length} Media type(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.mediaTypeService.deleteMediaType(this.selectedMediaTypeIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.selectedMediaTypeIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }

      });
      this.selectedMediaTypeIds = [];
      this.isAllSelected = false;

    }
  }
  updateSelectAllStatus() {
    this.isAllSelected = this.selectedMediaTypeIds.length === this.pagedData.length;
  }

  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedMediaTypeIds.includes(id)) {
        this.selectedMediaTypeIds.push(id);
      }
    } else {
      this.selectedMediaTypeIds = this.selectedMediaTypeIds.filter(x => x !== id);
    }
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedMediaTypeIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedMediaTypeIds = [];
    }

    this.isAllSelected = checked;
  }

  async toggleStatus(item: any): Promise<void> {
    const updatedStatus = !item.status;
    const payload = {
      id: item.id,
      status: updatedStatus
    };
    const message = `Are you sure you want to set this media type as ${updatedStatus ? 'Active' : 'Inactive'}?`;
    const result = await this.utilityService.confirmDialog(message, 'update');

    if (result.isConfirmed) {

      this.mediaTypeService.updateMediaTypeStatus(payload).subscribe({
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
