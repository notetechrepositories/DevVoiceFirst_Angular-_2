import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  selector: 'app-business-activity',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './business-activity.html',
  styleUrl: './business-activity.css'
})
export class BusinessActivity {
  data: BusinessActivityItem[]  = [
    {
      "id": "11011011",
      "business_activity_name": "Pharmaceuticals",
      "company": "n",
      "branch": "n",
      "section": "n",
      "sub_section": "n"
    },
    {
      "id": "010110011",
      "business_activity_name": "Electronics Retail",
      "company": "n",
      "branch": "n",
      "section": "n",
      "sub_section": "n"
    }
  ];

  businessactivity: BusinessActivityItem[] = [
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
      "id": "010111111",
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

  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  businessActivityForm!: FormGroup;

  checkIcon = '<i class="fa-solid fa-check text-success"></i>';
  crossIcon = '<i class="fa-solid fa-xmark text-danger"></i>';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.businessActivityForm = this.fb.group({
      id: [''], // Required for edit mode
      business_activity_name: [''],
      company: [false],
      branch: [false],
      section: [false],
      sub_section: [false]
    });



    // mark existing business activities as selected
    this.businessactivity = this.businessactivity.map(activity => {
      const exists = this.data.some(d => d.id === activity.id);
      return { ...activity, selected: exists };
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
      item.business_activity_name.toLowerCase().includes(term)
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
    this.businessActivityForm.reset();
  }

  addBusinessActivity() {
    const formValue = this.businessActivityForm.value;
  
    // Generate a random ID for new entries (optional)
    const newId = Math.floor(Math.random() * 100000000).toString();
  
    const newItem: BusinessActivityItem = {
      id: newId,
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

  openEditModal(item: BusinessActivityItem) {
    this.isEditModalVisible = true;
  
    // Convert 'y'/'n' to true/false
    this.businessActivityForm.patchValue({
      ...item,
      company: item.company === 'y',
      branch: item.branch === 'y',
      section: item.section === 'y',
      sub_section: item.sub_section === 'y'
    });
  }

  saveChanges() {
    const formValue = this.businessActivityForm.value;
  
    const updatedItem: BusinessActivityItem = {
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

  deleteBusinessActivity(id: any) {
    this.filteredData = this.filteredData.filter(item => item.id !== id);
    this.data = this.data.filter(item => item.id !== id);
  
    // Unselect in system businessactivity list
    const sysItem = this.businessactivity.find(item => item.id === id);
    if (sysItem) {
      sysItem.selected = false;
    }
  }

  toggleBusinessActivity(activity: any) {
    if (!activity.selected) {
      if (!this.data.some(item => item.id === activity.id)) {
        this.data.push({ ...activity });
        this.filteredData = [...this.data];
      }
      activity.selected = true;
    }
  }
}
