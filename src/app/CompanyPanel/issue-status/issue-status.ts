import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyAnswerTypeModel, AnswerTypeModel } from '../../Models/AnswerTypeModel';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { CompanyIssueStatusModel, IssueStatusModel } from '../../Models/IssueStatusModel';
import { IssueStatusService } from '../../Service/IssueStatusService/issue-status-service';

@Component({
  selector: 'app-issue-status',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './issue-status.html',
  styleUrl: './issue-status.css'
})
export class IssueStatus {
  companyIssueStatusData: CompanyIssueStatusModel[] = [];
  filteredData: CompanyIssueStatusModel[] = [];
  sysIssueStatus: IssueStatusModel[] = [];
  filteredSysData: IssueStatusModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter = '';
  searchSysTerm: string = '';

  isModalVisible: boolean = false;
  isAllSelected = false;
  isEditMode: boolean = false;

  issueStatusForm!: FormGroup;

  selectedIssueStatusIds: string[] = [];
  selectedIssueStatusId: string[] = [];
  selectedStatusIds: string | null = null;
  originalItem: any;

  constructor(private fb: FormBuilder,
    private utilityService: UtilityService,
    private issueStatusService: IssueStatusService
  ) { }

  ngOnInit() {
    this.getCompanyIssueStatus();
    this.getIssueStatus();
    this.issueStatusForm = this.fb.group({
      id: [''],
      companyIssueStatus: ['', Validators.required],
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
    this.filteredData = this.companyIssueStatusData.filter(item =>
      item.companyIssueStatus.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onSysSearch() {
    const term = this.searchSysTerm.toLowerCase();
    this.filteredSysData = this.sysIssueStatus.filter(item =>
      item.issueStatus.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.filteredData = this.companyIssueStatusData.filter(item => {
      if (this.statusFilter === '') return true;
      return Boolean(item.status) === (this.statusFilter === 'true');

    });
    this.updateSelectAllStatus();
  }

  updateSelectAllStatus() {
    this.isAllSelected = this.pagedData.length > 0 && this.pagedData.every(x => this.selectedIssueStatusIds.includes(x.id));
  }

  // ==================================================================

  getCompanyIssueStatus() {
    this.issueStatusService.getAllCompanyIssueStatus().subscribe({
      next: res => {
        this.companyIssueStatusData = res.body.data
        this.filteredData = [...this.companyIssueStatusData];
        this.markSelectedTypes();
      },
      error: err => {
        this.utilityService.showError(err.status, err.error?.message || 'Get failed.');
      }
    });
  }

  getIssueStatus() {
    this.issueStatusService.getIssueStatus().subscribe({
      next: res => {
        this.sysIssueStatus = res.body.data;
        this.filteredSysData = [...this.sysIssueStatus]
        this.markSelectedTypes();
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

  private markSelectedTypes() {
    if (!this.sysIssueStatus.length || !this.companyIssueStatusData.length) return;
    const companyIssueStatusIds = new Set(this.companyIssueStatusData.map((item) => item.issueStatusId));
    this.sysIssueStatus.forEach(type => {
      type.selected = companyIssueStatusIds.has(type.id);
    });
  }


  openModal(editItem?: CompanyIssueStatusModel) {
    this.isModalVisible = true;
    this.isEditMode = !!editItem;
    this.selectedStatusIds = editItem?.id || null;
    if (editItem) {
      this.originalItem = { ...editItem };
      this.issueStatusForm.patchValue({
        id: editItem.id,
        companyIssueStatus: editItem.companyIssueStatus,

      });
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.issueStatusForm.reset();
  }

  submitIssueStatus() {
    const form = this.issueStatusForm;
    const formValue = form.value;
    const payload = {
      companyIssueStatus: formValue.companyIssueStatus,
    };
    if (this.issueStatusForm.invalid) {
      this.issueStatusForm.markAllAsTouched();
      return;
    }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedStatusIds };
      this.utilityService.setIfDirty(form, 'companyIssueStatus', updatedFields);
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.issueStatusService.updateCompanyIssueStatus(updatedFields).subscribe({
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
      console.log(payload);
      
      this.issueStatusService.createCompanyIssueStatus(payload).subscribe({
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


  async deleteIssueStatus(): Promise<void> {
    const message = `Delete ${this.selectedIssueStatusIds.length} issue status(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.issueStatusService.deleteCompanyIssueStatus(this.selectedIssueStatusIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.companyIssueStatusData = this.companyIssueStatusData.filter(item => !deletedIds.includes(item.id));

          const selectedIds = new Set(this.companyIssueStatusData.map(item => item.issueStatusId));
          this.sysIssueStatus.forEach(type => {
            type.selected = selectedIds.has(type.id);
          });
          this.selectedIssueStatusIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }
      });
      this.selectedIssueStatusIds = [];
      this.isAllSelected = false;

    }
  }


  // ------------------------ System Issue Status -----------------------------

  toggleIssueStatus(issueStatus: any, ev: Event) {
    if (!issueStatus.selected) {
      const input = ev.target as HTMLInputElement; // use the event target
      input.disabled = true;                       // prevent double clicks while saving

      const payload = {
        issueStatusId: issueStatus.id,
      };

      this.issueStatusService.createCompanyIssueStatus(payload).subscribe({
        next: (res) => {
          if (res.status == 201) {
            const newItem = res.body?.data;

            // mark as selected -> your [disabled]="issueStatus.selected" will disable it
            issueStatus.selected = true;

            // keep any server identifiers if present
            if (newItem?.issueStatusLinkId) {
              issueStatus.issueStatusLinkId = newItem.issueStatusLinkId;
            }

            if (newItem) {
              this.filteredData.push(newItem);
            }

            this.utilityService.success(res.body.message);
          } else {
            // unexpected status: revert UI
            input.checked = false;
            input.disabled = false;
            this.utilityService.success(res.body?.message || 'Request completed.');
          }
        },
        error: (err) => {
          // revert UI on failure
          input.checked = false;
          input.disabled = false;
          this.utilityService.showError(err.status, err.error?.message || 'Creation failed');
        }
      });
    }
  }

 

  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedIssueStatusIds.includes(id)) {
        this.selectedIssueStatusIds.push(id);
      }
    } else {
      this.selectedIssueStatusIds = this.selectedIssueStatusIds.filter(x => x !== id);
    }
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedIssueStatusIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedIssueStatusIds = [];
    }
    this.isAllSelected = checked;
  }

  async toggleStatus(item: any): Promise<void> {
    const updatedStatus = !item.status;
    const payload = {
      id: item.id,
      status: updatedStatus
    };
    const message = `Are you sure you want to set this issue status as ${updatedStatus ? 'Active' : 'Inactive'}?`;
    const result = await this.utilityService.confirmDialog(message, 'update');
    if (result.isConfirmed) {
      this.issueStatusService.updateCompanyIssueStatusStatus(payload).subscribe({
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
