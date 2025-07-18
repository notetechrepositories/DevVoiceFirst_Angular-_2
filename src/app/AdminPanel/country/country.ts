import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CountryService } from '../../Service/CountryService/country-service';
import { ProgramService } from '../../Service/ProgramService/program';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { CountryModel } from '../../Models/CountryModel';

@Component({
  selector: 'app-country',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './country.html',
  styleUrl: './country.css'
})
export class Country {
  data: CountryModel[] = [];
  filteredData: CountryModel[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  statusFilter: string = '';
  searchTerm: string = '';
  countryForm!: FormGroup;
  isEditMode: boolean = false;
  selectedCountryIds: string[] = [];
  isAllSelected = false;

  constructor(
    private fb: FormBuilder,
    private programService: ProgramService,
    private countryService: CountryService,
    private utilityService: UtilityService,
    private router: Router
  ) { }

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

  ngOnInit() {
    this.getCountry();
    this.countryForm=this.fb.group({
      id:[''],
      country:[''],
      divisionOneLabel:[''],
      divisionTwoLabel:[''],
      divisionThreeName:[''],
    })
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.country.toLowerCase().includes(term)
    );
    this.currentPage = 1; // reset to first page
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

  isModalVisible: boolean = false;
  selectedCountryId:string|null=null;

  openModal(editItem?:CountryModel) {
    this.isModalVisible = true;
    this.isEditMode=!!editItem;
    this.selectedCountryId=editItem?.id ||null
    if(editItem){
      console.log("working");
      
      this.countryForm.patchValue({
        id:editItem.id,
        country:editItem.country,
        divisionOneLabel:editItem.divisionOneLabel,
        divisionTwoLabel:editItem.divisionTwoLabel,
        divisionThreeName:editItem.divisionThreeName
      })
    }
    console.log(this.isModalVisible);
  }

  closeModal() {
    this.isModalVisible = false;
    this.isEditMode=false;
    this.countryForm.reset(); 
  }



  getCountry() {
    this.countryService.getCountry().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => console.error('Error fetching roles:', err)
    });
  }

  submitForm() {
    const form = this.countryForm;
    const formValue = form.value;
    const payload = {
      country: formValue.country,
      divisionOneLabel: formValue.divisionOneLabel,
      divisionTwoLabel: formValue.divisionTwoLabel,
      divisionThreeName: formValue.divisionThreeName,

    };
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
     
      const updatedFields: any = { id: this.selectedCountryIds };
      this.utilityService.setIfDirty(form, 'country', updatedFields);
      this.utilityService.setIfDirty(form, 'divisionOneLabel', updatedFields);
      this.utilityService.setIfDirty(form, 'divisionTwoLabel', updatedFields);
      this.utilityService.setIfDirty(form, 'divisionThreeName', updatedFields);
       if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
       this.countryService.updateCountry(updatedFields).subscribe({
        next: res => {
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
      })
    }
    else {
      this.countryService.createCountry(payload).subscribe({
        next: res => {
          const newItem = res.body?.data;
          if (newItem) {
            this.filteredData.push(newItem);
          }
          this.closeModal();
          this.utilityService.success(res.body.message);
        },
        error: err => {
          this.utilityService.showError(err.status, err.error.message);
          console.log("error",err);
          
        }
      });
    }
  }


 async deleteCountry(): Promise<void> {
    const message = `Delete ${this.selectedCountryIds.length} Country(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    this.countryService.deleteCountry(this.selectedCountryIds).subscribe({
      next:(res)=>{
         const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.selectedCountryIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }
      });
      this.selectedCountryIds = [];
      this.isAllSelected = false;
  }


  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedCountryIds.includes(id)) {
        this.selectedCountryIds.push(id);
      }
    } else {
      this.selectedCountryIds = this.selectedCountryIds.filter(x => x !== id);
    }

    this.updateSelectAllStatus();
  }


  updateSelectAllStatus() {
    this.isAllSelected = this.pagedData.length > 0 && this.pagedData.every(x => this.selectedCountryIds.includes(x.id));
  }


  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedCountryIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedCountryIds = [];
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

      this.countryService.updateCountryStatus(payload).subscribe({
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

  onManageDivisions(item:any){
    this.router.navigate(['/admin/divisions', item.id], { state: { country: item } });
  }
}
