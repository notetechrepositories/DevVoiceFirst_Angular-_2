import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../Service/RoleService/role';
import { ProgramService } from '../../Service/ProgramService/program';
import Swal from 'sweetalert2';
import { UtilityService } from '../../Service/UtilityService/utility-service';

export interface RoleProgram {
  id: string;
  programId: string;
  create: boolean;
  update: boolean;
  view: boolean;
  delete: boolean;
  download: boolean;
  email: boolean;
}

export interface Roles {
  id: string;
  roleName: string;
  allLocationAccess: boolean;
  allIssuesAccess: boolean;
  isActive: boolean;
  rolePrograms: RoleProgram[];
}

@Component({
  selector: 'app-sys-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sys-roles.html',
  styleUrl: './sys-roles.css'
})
export class SysRoles {
  data: Roles[] = [];
  filteredData: Roles[] = [];
  modules: any[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm = '';

  roleForm!: FormGroup;
  permissionKeys: string[] = [];

  isModalVisible = false;
  isEditMode = false;
  selectedRoleId: string | null = null;

  selectedRoleIds: string[] = [];
  isAllSelected = false;

  checkIcon = '<i class="pi pi-check-square text-success"></i>';
  crossIcon = '<i class="pi pi-times-circle text-danger"></i>';

  constructor(
    private fb: FormBuilder,
    private programService: ProgramService,
    private roleService: RoleService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.getRoles();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(start, start + this.itemsPerPage);
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.roleName.toLowerCase().includes(term)
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

  getRoles() {
    this.roleService.getRoles().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => console.error('Error fetching roles:', err)
    });
  }

  openModal(editItem?: Roles) {
    this.isModalVisible = true;
    this.isEditMode = !!editItem;
    this.selectedRoleId = editItem?.id || null;

    this.programService.getPrograms().subscribe({
      next: res => {
        this.modules = res.body.data;
        this.buildForm(this.modules, editItem);
      },
      error: err => console.error('Program fetch error:', err)
    });
  }

  closeModal() {
    this.isModalVisible = false;
    if (this.roleForm) this.roleForm.reset();
  }

  buildForm(modules: any[], item?: Roles) {
    if (!modules || modules.length === 0) return;
  
    this.permissionKeys = Object.keys(modules[0]).filter(
      key => !['programName', 'label', 'route', 'id'].includes(key)
    );
  
    const permissionsGroup: any = {};
    modules.forEach(mod => {
      const group: any = {};
      this.permissionKeys.forEach(key => {
        group[key] = [{ value: false, disabled: !mod[key] }];
      });
  
      group['Id'] = [null]; 
      permissionsGroup[mod.id] = this.fb.group(group);
    });
  
    this.roleForm = this.fb.group({
      roleName: [item?.roleName || '' , Validators.required],
      allLocationAccess: [item?.allLocationAccess || false],
      allIssuesAccess: [item?.allIssuesAccess || false],
      permissions: this.fb.group(permissionsGroup)
    });
  
    if (item) {
      const permissionsForm = this.roleForm.get('permissions') as FormGroup;
      item.rolePrograms.forEach(rp => {
        const group = permissionsForm.get(rp.programId) as FormGroup;
        const mod = modules.find(m => m.id === rp.programId);
        if (group && mod) {
          this.permissionKeys.forEach(key => {
            if (mod[key]) {
              group.get(key)?.enable();
              group.get(key)?.setValue(rp[key as keyof RoleProgram]);
            }
          });
  
          // Set existing RoleProgram Id
          group.get('Id')?.setValue(rp.id);
        }
      });
    }
  
    this.modules = modules; // For extractPermissions
  }
  

  extractPermissions(): RoleProgram[] {
    const permissionsForm = this.roleForm.get('permissions') as FormGroup;
  
    return this.modules.map(mod => {
      const modGroup = permissionsForm.get(mod.id) as FormGroup;
      const permissionData: any = {
        programId: mod.id,
        id: modGroup.get('Id')?.value // Include Id from form for updates
      };
  
      this.permissionKeys.forEach(key => {
        permissionData[key] = modGroup.get(key)?.disabled ? false : modGroup.get(key)?.value;
      });
  
      return permissionData;
    });
  }
  

  submitForm() {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const rolePrograms = this.extractPermissions();
    const payload = {
      id: this.selectedRoleId || undefined,
      roleName: this.roleForm.value.roleName,
      allLocationAccess: this.roleForm.value.allLocationAccess,
      allIssuesAccess: this.roleForm.value.allIssuesAccess,
      rolePrograms
    };

    if (this.isEditMode) {
      console.log('Update role:', payload);
      this.roleService.updateRole(payload).subscribe({
        next: () => this.getRoles(),
        error: err => console.error('Update role error:', err)
      });
    } else {
      this.roleService.createRole(payload).subscribe({
        next: () => this.getRoles(),
        error: err => console.error('Create role error:', err)
      });
    }

    this.closeModal();
  }

  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      if (!this.selectedRoleIds.includes(id)) {
        this.selectedRoleIds.push(id);
      }
    } else {
      this.selectedRoleIds = this.selectedRoleIds.filter(x => x !== id);
    }
  
    this.updateSelectAllStatus();
  }
  
  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      this.selectedRoleIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedRoleIds = [];
    }
  
    this.isAllSelected = checked;
  }
  
  updateSelectAllStatus() {
    this.isAllSelected = this.pagedData.length > 0 && this.pagedData.every(x => this.selectedRoleIds.includes(x.id));
  }

  deleteRoles() {

    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${this.selectedRoleIds.length} roles`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#eb1313',
      cancelButtonColor: '#565656',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.deleteRole(this.selectedRoleIds).subscribe({
          next: () => this.getRoles(),
          error: err => console.error('Delete role error:', err)
        });
        this.selectedRoleIds = [];
        this.isAllSelected = false;
      } 
    });
  }

  toggleStatus(item: any) {
    const updatedStatus = !item.isActive;
    const payload = {
      id: item.id,
      isActive: updatedStatus
    };
  
    this.roleService.updateRoleStatus(payload).subscribe({
      next: () => {
        item.isActive = updatedStatus; // Optimistic update
        this.utilityService.success('Status updated successfully');
      },
      error: err => {
        console.error('Status update failed', err);
        // Optional: show a toast or revert UI if needed
      }
    });
  }
}
