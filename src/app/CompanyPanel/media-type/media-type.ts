import { Component } from '@angular/core';
import { CompanyMediaTypeModel, MediaTypeModel } from '../../Models/MediaTypeModel';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MediaTypeService } from '../../Service/MediaTypeService/media-type-service';
import { UtilityService } from '../../Service/UtilityService/utility-service';

@Component({
  selector: 'app-media-type',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './media-type.html',
  styleUrl: './media-type.css'
})

export class MediaType {
  
  companyMediaTypeData: CompanyMediaTypeModel[] = [];
  filteredData: CompanyMediaTypeModel[] = [];
  sysMediaTypes: MediaTypeModel[] = [];
  filteredSysData: MediaTypeModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter = '';
  searchSysTerm: string = '';

  isModalVisible: boolean = false;
  mediaTypeForm!: FormGroup;
  selectedMediaTypeIds: string[] = [];
  selectedMediaTypeId: string[] = [];
  isAllSelected = false;
  isEditMode: boolean = false;
  selectedMediaId: string | null = null;
  originalItem: any;
  checkIcon = '<i class="fa-solid fa-check text-success"></i>';
  crossIcon = '<i class="fa-solid fa-xmark text-danger"></i>';

  constructor(private fb: FormBuilder,
    private utilityService: UtilityService,
    private mediaTypeService: MediaTypeService
  ) { }

  ngOnInit() {
    this.getCompanyMediaType();
    this.getAnswerType();
    this.mediaTypeForm = this.fb.group({
      id: [''],
      companyDescription: ['', Validators.required],
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
    this.filteredData = this.companyMediaTypeData.filter(item =>
      item.companyDescription.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onSysSearch() {
    const term = this.searchSysTerm.toLowerCase();
    this.filteredSysData = this.sysMediaTypes.filter(item =>
      item.description.toLowerCase().includes(term)
    );
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.filteredData = this.companyMediaTypeData.filter(item => {
      if (this.statusFilter === '') return true;
      return Boolean(item.status) === (this.statusFilter === 'true');

    });
    this.updateSelectAllStatus();
  }

  updateSelectAllStatus() {
    this.isAllSelected = this.pagedData.length > 0 && this.pagedData.every(x => this.selectedMediaTypeIds.includes(x.id));
  }

  // ===============================================================================================


  openModal(editItem?: CompanyMediaTypeModel) {
    this.isModalVisible = true;
    this.isEditMode = !!editItem;
    this.selectedMediaId = editItem?.id || null;
    if (editItem) {
      this.originalItem = { ...editItem };
      this.mediaTypeForm.patchValue({
        id: editItem.id,
        companyDescription: editItem.companyDescription,

      });
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.mediaTypeForm.reset();
  }

  toggleAnswerType(mediaType: any) {
    if (!mediaType.selected) {
      const payload = {
        mediaTypeId: mediaType.id,
      };
      this.mediaTypeService.createCompanyMediaType(payload).subscribe({
        next: (res) => {
          if (res.status == 201) {
            const newItem = res.body?.data;
            if (newItem) {
              this.filteredData.push(newItem);
            }
          }
          mediaType.selected = true;
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
      this.selectedMediaTypeIds = this.pagedData.map((x: any) => x.id);
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
      this.mediaTypeService.updateCompanyMediaTypeStatus(payload).subscribe({
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

  // ------------------

  getCompanyMediaType() {
    this.mediaTypeService.getAllCompanyMediatype().subscribe({
      next: res => {
        this.companyMediaTypeData = res.body.data
        this.filteredData = [...this.companyMediaTypeData];
        this.markSelectedTypes();
      },
      error: err => {
        this.utilityService.showError(err.status, err.error?.message || 'Get failed.');
      }
    });
  }

  getAnswerType() {
    this.mediaTypeService.getMediatype().subscribe({
      next: res => {
        this.sysMediaTypes = res.body.data;
        this.filteredSysData = [...this.sysMediaTypes]
        this.markSelectedTypes();
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

  private markSelectedTypes() {
    if (!this.sysMediaTypes.length || !this.companyMediaTypeData.length) return;
    const companyAnswerTypeIds = new Set(this.companyMediaTypeData.map((item) => item.mediaTypeId));
    this.sysMediaTypes.forEach(type => {
      type.selected = companyAnswerTypeIds.has(type.id);
    });
  }

  async deleteMediaType(): Promise<void> {
    const message = `Delete ${this.selectedMediaTypeIds.length} Answer type(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.mediaTypeService.deleteCompanyMediaType(this.selectedMediaTypeIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.companyMediaTypeData = this.companyMediaTypeData.filter(item => !deletedIds.includes(item.id));

          const selectedIds = new Set(this.companyMediaTypeData.map(item => item.mediaTypeId));
          this.sysMediaTypes.forEach(type => {
            type.selected = selectedIds.has(type.id);
          });

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

  submitAnswerType() {
    const form = this.mediaTypeForm;
    const formValue = form.value;
    const payload = {
      companyDescription: formValue.companyDescription

    };
    if (this.mediaTypeForm.invalid) {
      this.mediaTypeForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedMediaId };

      this.utilityService.setIfDirty(form, 'companyDescription', updatedFields);
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.mediaTypeService.updateCompanyMediaType(updatedFields).subscribe({
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
      this.mediaTypeService.createCompanyMediaType(payload).subscribe({
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
}
