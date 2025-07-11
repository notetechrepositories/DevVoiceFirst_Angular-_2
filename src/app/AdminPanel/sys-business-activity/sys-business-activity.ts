import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sys-business-activity',
  imports: [RouterLink,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './sys-business-activity.html',
  styleUrl: './sys-business-activity.css'
})
export class SysBusinessActivity {
  data = [
    {
      "id": "010110101",
      "business_activity_name": "Restaurant",
      "company": "y",
      "branch": "y",
      "section": "y",
      "sub_section": "y"
    },
    {
      "id": "010110111",
      "business_activity_name": "Textiles",
      "company": "y",
      "branch": "y",
      "section": "y",
      "sub_section": "y"
    },
    {
      "id": "010110011",
      "business_activity_name": "Jewellery",
      "company": "y",
      "branch": "y",
      "section": "n",
      "sub_section": "n"
    }
  ];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  filteredData = [...this.data];

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
      item.business_activity_name.toLowerCase().includes(term)
    );
    this.currentPage = 1; // reset to first page
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

  isModalVisible:boolean=false;
  isEditModalVisible:boolean=false;
  businessActivityForm!:FormGroup;
  checkIcon = '<i class="fa-solid fa-check text-success"></i>';
  crossIcon = '<i class="fa-solid fa-xmark text-danger"></i>';

  constructor(private fb:FormBuilder){}

  ngOnInit(){
    this.businessActivityForm = this.fb.group({
      id: [''], // <-- include this!
      business_activity_name: [''],
      company: [false],
      branch: [false],
      section: [false],
      sub_section: [false]
    });
    
  }

  openModal(){
    this.isModalVisible=true;
    console.log(this.isModalVisible);
  }

  closeModal(){
    this.isModalVisible=false;
    this.isEditModalVisible=false;
    this.businessActivityForm.reset();
  }

  addBusinessActivity() {
    const formValue = this.businessActivityForm.value;
  
    const newItem = {
      id: Date.now().toString(), // or use UUID if needed
      business_activity_name: formValue.business_activity_name,
      company: formValue.company ? 'y' : 'n',
      branch: formValue.branch ? 'y' : 'n',
      section: formValue.section ? 'y' : 'n',
      sub_section: formValue.sub_section ? 'y' : 'n'
    };
  
    this.data.push(newItem);
    this.filteredData = [...this.data];
    this.closeModal();
  }

  openEditModal(item: any) {
    this.isEditModalVisible = true;
  
    this.businessActivityForm.patchValue({
      id: item.id,
      business_activity_name: item.business_activity_name,
      company: item.company === 'y',
      branch: item.branch === 'y',
      section: item.section === 'y',
      sub_section: item.sub_section === 'y'
    });
  }
  

  saveChanges() {
    const formValue = this.businessActivityForm.value;
  
    const updatedItem = {
      id: formValue.id,
      business_activity_name: formValue.business_activity_name,
      company: formValue.company ? 'y' : 'n',
      branch: formValue.branch ? 'y' : 'n',
      section: formValue.section ? 'y' : 'n',
      sub_section: formValue.sub_section ? 'y' : 'n'
    };
  
    const index = this.filteredData.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this.filteredData[index] = updatedItem;
    }
  
    const dataIndex = this.data.findIndex(item => item.id === updatedItem.id);
    if (dataIndex !== -1) {
      this.data[dataIndex] = updatedItem;
    }
  
    this.closeModal();
  }
  

  deleteBusinessActivity(id:any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.filteredData=this.filteredData.filter(item=>item.id!==id);
      } 
    });
  }

 
}
