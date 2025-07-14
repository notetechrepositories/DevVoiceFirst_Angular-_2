import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-module',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './test-module.html',
  styleUrl: './test-module.css'
})
export class TestModule {
  data = [
    { first: 'Mark', last: 'Otto', handle: 'mdo' },
    { first: 'Jacob', last: 'Thornton', handle: 'fat' },
    { first: 'Larry', last: 'the Bird', handle: 'twitter' },
    { first: 'John', last: 'Doe', handle: 'jdoe' },
    { first: 'Jane', last: 'Smith', handle: 'jsmith' },
    { first: 'Alice', last: 'Johnson', handle: 'alice' },
    { first: 'Bob', last: 'Brown', handle: 'bobby' },
    // Add more rows if needed
  ];

  itemsPerPage = 3;
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
      item.first.toLowerCase().includes(term) ||
      item.last.toLowerCase().includes(term) ||
      item.handle.toLowerCase().includes(term)
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

  openModal(){
    this.isModalVisible=true;
    console.log(this.isModalVisible);
  }

  closeModal(){
    this.isModalVisible=false;
  }

  deleteRole(item:any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#efba2c',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(item);
      } 
    });
  }
  

  editRole(item:any){
    console.log(item);
  }
}
