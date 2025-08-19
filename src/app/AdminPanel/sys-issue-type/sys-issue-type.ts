import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IssueTypeModel } from '../../Models/IssueTypeModel';
import { IssueTypeService } from '../../Service/IssueTypeService/issue-type-service';
import { UtilityService } from '../../Service/UtilityService/utility-service';

@Component({
  selector: 'app-sys-issue-type',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sys-issue-type.html',
  styleUrl: './sys-issue-type.css'
})
export class SysIssueType {
 
  data: IssueTypeModel[] = [];
  filteredData: IssueTypeModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter: string = '';
  selectedIssueTypeIds: string[] = [];
  isAllSelected = false;
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  isEditMode: boolean = false;
  originalItem: any;
  answerTypes: any[] = [];
  selectedAnswerTypeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private router: Router,
    private issueTypeService:IssueTypeService
  ) { }

  ngOnInit() {
    this.getAllIssueType();
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
      item.issueType.toLowerCase().includes(term)
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


  openModal() {
     this.router.navigate(['admin/add-issue-type']);
  }

  getAllIssueType() {
    this.issueTypeService.getAllIssueType().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }
  async deleteIssueType(): Promise<void> {
    const message = `Delete ${this.selectedIssueTypeIds.length} Issue type(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.issueTypeService.deleteIssueType(this.selectedIssueTypeIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.selectedIssueTypeIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }

      });
      this.selectedIssueTypeIds = [];
      this.isAllSelected = false;

    }
  }
  updateSelectAllStatus() {
    this.isAllSelected = this.selectedIssueTypeIds.length === this.pagedData.length;
  }

  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedIssueTypeIds.includes(id)) {
        this.selectedIssueTypeIds.push(id);
      }
    } else {
      this.selectedIssueTypeIds = this.selectedIssueTypeIds.filter(x => x !== id);
    }
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedIssueTypeIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedIssueTypeIds = [];
    }

    this.isAllSelected = checked;
  }

  async toggleStatus(item: any): Promise<void> {
    const updatedStatus = !item.status;
    const payload = {
      id: item.id,
      status: updatedStatus
    };
    const message = `Are you sure you want to set this issue type as ${updatedStatus ? 'Active' : 'Inactive'}?`;
    const result = await this.utilityService.confirmDialog(message, 'update');

    if (result.isConfirmed) {

      this.issueTypeService.updateIssueTypeStatus(payload).subscribe({
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

  openEditModal(id:any){
    this.router.navigate(['admin/edit-issue-type',id]);
  }
}
