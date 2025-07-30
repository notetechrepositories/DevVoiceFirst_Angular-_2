import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { CompanyService } from '../../Service/CompanyService/company-service';
import { CompanyModel } from '../../Models/Company';

@Component({
  selector: 'app-company',
imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './company.html',
  styleUrl: './company.css'
})  
export class Company {
  data: CompanyModel[] = [];
  filteredData: CompanyModel[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter: string = '';
  selectedCompanyIds: string[] = [];
  isAllSelected = false;
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  isEditMode: boolean = false;
  originalItem: any;
  companyForm !:FormGroup;
  company: any[] = [];
  selectedCompanyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private companyService: CompanyService
  ) { }

    ngOnInit() {
    this.getCompany();
       this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      addressOne: [''],
      addressTwo: [''],
      zipCode: [''],
      mobileNo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryId: [''],
      divisionOneId: [''],
      divisionTwoId: [''],
      divisionThreeId: [''],
      placeName: ['']
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
      item.companyName.toLowerCase().includes(term)
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
  updateSelectAllStatus() {
    this.isAllSelected = this.selectedCompanyIds.length === this.pagedData.length;
  }
  // ------------------------------
  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCompanyIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedCompanyIds = [];
    }
    this.isAllSelected = checked;
  }
  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedCompanyIds.includes(id)) {
        this.selectedCompanyIds.push(id);
      }
    } else {
      this.selectedCompanyIds = this.selectedCompanyIds.filter(x => x !== id);
    }
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

      this.companyService.updateCompanyStatus(payload).subscribe({
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
  // ----------------------------------

  getCompany(){
       this.companyService.getAllCompany().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

 openModal(editItem?: CompanyModel) {
  this.isModalVisible = true;
      this.isEditMode = !!editItem;
      this.selectedCompanyId = editItem?.id || null;
      if (editItem) {
        this.originalItem = { ...editItem };
        // this.answerTypeForm.patchValue({
        //   id: editItem.id,
        //   answerTypeName: editItem.answerTypeName,
  
        // });
      }    
 }
 async deleteCompany(): Promise<void> {
    const message = `Delete ${this.selectedCompanyIds.length} Answer type(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.companyService.deleteCompany(this.selectedCompanyIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.selectedCompanyIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }

      });
      this.selectedCompanyIds = [];
      this.isAllSelected = false;

    }
  }
 closeModal() {
    this.isModalVisible = false;
    this.company = [];
    this.companyForm.reset();
  }
  onSubmit(){

  }
}
