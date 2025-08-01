import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { AnswerTypeService } from '../../Service/AnswerTypeService/answer-type-service';
import { AnswerTypeModel, CompanyAnswerTypeModel } from '../../Models/AnswerTypeModel';

interface BusinessActivityItem {
  id: string;
  business_activity_name: string;
  company: string;
  branch: string;
  section: string;
  sub_section: string;
  selected?: boolean; // optional, because it's added dynamically
}

@Component({
  selector: 'app-answer-type',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './answer-type.html',
  styleUrl: './answer-type.css'
})
export class AnswerType {
  data: CompanyAnswerTypeModel[] = [];
  filteredData: CompanyAnswerTypeModel[] = [];
  sysAnswerTypes:AnswerTypeModel[]=[];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  answerTypeForm!: FormGroup;

  selectedAnswerTypeIds: string[] = [];
  selectedAnswerTypeId: string[] = [];
  isAllSelected = false;
  isEditMode: boolean = false;
  checkIcon = '<i class="fa-solid fa-check text-success"></i>';
  crossIcon = '<i class="fa-solid fa-xmark text-danger"></i>';

  constructor(private fb: FormBuilder,
    private utilityService :UtilityService,
    private answerTypeService:AnswerTypeService
  ) {}

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
  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.companyAnswerTypeName.toLowerCase().includes(term)
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

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.isEditModalVisible = false;
    this.answerTypeForm.reset();
  }

  // addBusinessActivity() {
  //   const formValue = this.answerTypeForm.value;
  
  //   // Generate a random ID for new entries (optional)
  //   const newId = Math.floor(Math.random() * 100000000).toString();
  
  //   const newItem: CompanyAnswerTypeModel = {
  //     id: newId,
  //     companyAnswerTypeName: formValue.companyAnswerTypeName,
    
  //   };
  
  //   this.data.push(newItem);
  //   this.filteredData = [...this.data];
  //   this.closeModal();
  // }

  openEditModal(item: CompanyAnswerTypeModel) {
    this.isEditModalVisible = true;
  
    // Convert 'y'/'n' to true/false
    this.answerTypeForm.patchValue({
    
     
    });
  }

 
toggleAnswerType(answerType: any) {
  if (!answerType.selected) {
    const payload = {
      companyAnswerTypeName: answerType.answerTypeName
    };

    this.answerTypeService.createCompanyAnswertype(payload).subscribe({
      next: (res) => {
        const newItem = res.body?.data;

        if (newItem) {
          // Normalize if needed
          newItem.status = newItem.status ?? true;
          this.data.push(newItem);
          this.filteredData = [...this.data];
        }

        answerType.selected = true;
        this.utilityService.success(res.body.message);
      },
      error: (err) => {
        this.utilityService.showError(err.status, err.error?.message || 'Creation failed');
      }
    });
  }
}

  // -----------------
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
  // ------------------
    getCompanyAnswerType() {
    this.answerTypeService.getAllCompanyAnswerType().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }
   getAnswerType() {
    this.answerTypeService.getAnswerType().subscribe({
      next: res => {
        this.sysAnswerTypes = res.body.data;
     
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }
 async deleteAnswerType(): Promise<void> {
    const message = `Delete ${this.selectedAnswerTypeIds.length} Answer type(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.answerTypeService.deleteCompanyAnswerType(this.selectedAnswerTypeIds).subscribe({
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
  
  submitAnswerType() {
    const form = this.answerTypeForm;
    const formValue = form.value;
    const payload = {
      companyAnswerTypeName: formValue.companyAnswerTypeName,

    };
    console.log(payload);
    
    if (this.answerTypeForm.invalid) {
      this.answerTypeForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedAnswerTypeId };

      this.utilityService.setIfDirty(form, 'companyAnswerTypeName', updatedFields);
      // Only send update if any field has changed
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
          this.utilityService.success(res.body?.message || 'Activity updated.');
        },
        error: err => {
          this.utilityService.showError(err.status, err.error?.message || 'Update failed.');
        }
      });
    }
    else {
      this.answerTypeService.createCompanyAnswertype(payload).subscribe({
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
}
