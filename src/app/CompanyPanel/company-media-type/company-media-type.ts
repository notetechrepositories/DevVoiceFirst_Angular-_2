import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MediaTypeService } from '../../Service/MediaTypeService/media-type-service';
import { CompanyMediaTypeModel, MediaTypeModel } from '../../Models/MediaTypeModel';

@Component({
  selector: 'app-company-media-type',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './company-media-type.html',
  styleUrl: './company-media-type.css'
})
export class CompanyMediaType {
data: CompanyMediaTypeModel[] = [];
  filteredData: CompanyMediaTypeModel[] = [];
  sysMediaTypes: MediaTypeModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
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
    private mediaTypeService:MediaTypeService
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

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.companyDescription.toLowerCase().includes(term)
    );
    this.currentPage = 1;
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


  openModal(editItem?:CompanyMediaTypeModel) {
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
    this.isEditModalVisible = false;
    this.mediaTypeForm.reset();
  }

  openEditModal(item: CompanyMediaTypeModel) {
    this.isModalVisible = true;
    this.mediaTypeForm.patchValue({
    });
  }

  toggleAnswerType(mediaType: any) 
  {
    if (!mediaType.selected) {
      const payload = {
        mediaTypeId: mediaType.id,
      };
      this.mediaTypeService.createCompanyMediaType(payload).subscribe({
        next: (res) => {
        if(res.status==201){
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

  toggleSelection(id: string, event: Event) 
  {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedMediaTypeIds.includes(id)) {
        this.selectedMediaTypeIds.push(id);
      }
    } else {
      this.selectedMediaTypeIds = this.selectedMediaTypeIds.filter(x => x !== id);
    }
  }

  toggleSelectAll(event: Event) 
  {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedMediaTypeIds = this.pagedData.map((x:any) => x.id);
    } else {
      this.selectedMediaTypeIds = [];
    }
    this.isAllSelected = checked;
  }

  async toggleStatus(item: any): Promise<void>
 {
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

  getCompanyMediaType()
 {
    this.mediaTypeService.getAllCompanyMediatype().subscribe({
      next: res => {
        this.data = res.body.data
        console.log(this.data);
        this.filteredData = [...this.data];
          this.markSelectedTypes();
      },
      error: err => {
        this.utilityService.showError(err.status, err.error?.message || 'Get failed.');
      }
    });
  }

  getAnswerType() 
  {
    this.mediaTypeService.getMediatype().subscribe({
      next: res => {
        this.sysMediaTypes = res.body.data;
        console.log(this.sysMediaTypes);
        
         this.markSelectedTypes();
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

  private markSelectedTypes()
  {
    if (!this.sysMediaTypes.length || !this.data.length) return;
    const companyAnswerTypeIds = new Set(this.data.map((item) => item.mediaTypeId));
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
            this.data = this.data.filter(item => !deletedIds.includes(item.id)); 

              const selectedIds = new Set(this.data.map(item => item.mediaTypeId));
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

  submitAnswerType()
  {
    const form = this.mediaTypeForm;
    const formValue = form.value;
    const payload = {
      companyDescription: formValue.companyDescription

    };
    console.log(payload);
    
    if (this.mediaTypeForm.invalid) {
      this.mediaTypeForm.markAllAsTouched();
      return;
    }
 if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedMediaId };

      this.utilityService.setIfDirty(form, 'companyDescription', updatedFields);
      // Only send update if any field has changed
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      console.log(updatedFields);
      
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
          if(res.status==201)
            {
              const newItem = res.body?.data;
              console.log(newItem);
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
