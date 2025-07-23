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
  status: boolean;
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
  statusFilter = '';
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

  onStatusFilterChange() {
    this.currentPage = 1;
    this.filteredData = this.data.filter(item => {
      if (this.statusFilter === '') return true;
      return item.status === (this.statusFilter === 'true');
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


  originalRolePrograms: RoleProgram[] = [];
  
  buildForm(modules: any[], item?: Roles) {
    if (!modules || modules.length === 0) return;
  
    this.permissionKeys = Object.keys(modules[0]).filter(
      key => !['id', 'programName', 'label', 'route'].includes(key)
    );
  
    const permissionsGroup: any = {};
    const roleProgramsMap = new Map(item?.rolePrograms?.map(rp => [rp.programId, rp]));
  
    modules.forEach(mod => {
      const group: any = {};
      const existingRoleProgram = roleProgramsMap.get(mod.id);
  
      this.permissionKeys.forEach(key => {
        group[key] = [{ value: false, disabled: !mod[key] }];
      });
  
      if (existingRoleProgram) {
        group['Id'] = [existingRoleProgram.id];
      }
  
      permissionsGroup[mod.id] = this.fb.group(group);
    });
  
    this.roleForm = this.fb.group({
      roleName: [item?.roleName || '', Validators.required],
      allLocationAccess: [item?.allLocationAccess || false],
      allIssuesAccess: [item?.allIssuesAccess || false],
      permissions: this.fb.group(permissionsGroup)
    });
  
    this.originalRolePrograms = item?.rolePrograms || [];
  
    if (item?.rolePrograms) {
      const permissionsForm = this.roleForm.get('permissions') as FormGroup;
      item.rolePrograms.forEach(rp => {
        const group = permissionsForm.get(rp.programId) as FormGroup;
        const mod = modules.find(m => m.id === rp.programId);
        if (group && mod) {
          this.permissionKeys.forEach(key => {
            const ctrl = group.get(key);
            if (ctrl && mod[key]) {
              ctrl.enable();
              ctrl.setValue(rp[key as keyof RoleProgram]);
            }
          });
        }
      });
    }
    
  
    this.modules = modules;
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
  
    if (this.isEditMode) {
      this.handleUpdate();
    } else {
      this.handleCreate();
    }
  }


  private handleUpdate(): void {
    const form = this.roleForm;
    const updatedFields: any = { id: this.selectedRoleId };
    const rolePrograms: RoleProgram[] = [];
  
    // Top-level dirty fields
    this.utilityService.setIfDirty(form, 'roleName', updatedFields);
    this.utilityService.setIfDirty(form, 'allLocationAccess', updatedFields);
    this.utilityService.setIfDirty(form, 'allIssuesAccess', updatedFields);
  
    const permissionsForm = form.get('permissions') as FormGroup;
  
    this.modules.forEach(mod => {
      const modGroup = permissionsForm.get(mod.id) as FormGroup;
      if (!modGroup || !modGroup.dirty) return;
  
      const permissionData: any = { programId: mod.id };
      let hasChanges = false;
  
      this.permissionKeys.forEach(key => {
        const control = modGroup.get(key);
        if (control?.dirty) {
          permissionData[key] = control.value;
          hasChanges = true;
        }
      });
  
      const idControl = modGroup.get('Id');
      if (idControl?.value) {
        permissionData.id = idControl.value;
      }
  
      if (hasChanges) {
        rolePrograms.push(permissionData);
      }
    });
  
    // Always include rolePrograms (even if empty)
    updatedFields.rolePrograms = rolePrograms;
  
    const hasUpdates =
      Object.keys(updatedFields).length > 2 || rolePrograms.length > 0;
  
  
    if (hasUpdates) {
      this.roleService.updateRole(updatedFields).subscribe({
        next: (res) => {
          const updatedItem = res.body?.data;
          if (updatedItem) {
            const filteredIndex = this.filteredData.findIndex(item => item.id === updatedItem.id);
            if (filteredIndex !== -1) {
              this.filteredData[filteredIndex] = updatedItem;
            }
          }
            this.closeModal();
            this.utilityService.success(res.body.message);
        },
        error: err => {
            this.utilityService.showError(err.status , err.error.message);
        }
      });
    } 
    else {
      this.utilityService.warning('No changes detected');
      return;
    }
  }

  private handleCreate(): void {
    const rolePrograms = this.extractPermissions();
    const payload = {
      id: this.selectedRoleId || undefined,
      roleName: this.roleForm.value.roleName,
      allLocationAccess: this.roleForm.value.allLocationAccess,
      allIssuesAccess: this.roleForm.value.allIssuesAccess,
      rolePrograms
    };
    this.roleService.createRole(payload).subscribe({
      next: (res) => {
        const insertedItem = res.body?.data;
        if (insertedItem) {
          this.filteredData.push(insertedItem);
        }
        this.closeModal();
        this.utilityService.success(res.body.message);
      },
      error: err => {
        this.utilityService.showError(err.status , err.error.message);
      }
    });
  }
  
  // submitForm() {
  //   if (this.roleForm.invalid) {
  //     this.roleForm.markAllAsTouched();
  //     return;
  //   }

  //   const rolePrograms = this.extractPermissions();
  //   const payload = {
  //     id: this.selectedRoleId || undefined,
  //     roleName: this.roleForm.value.roleName,
  //     allLocationAccess: this.roleForm.value.allLocationAccess,
  //     allIssuesAccess: this.roleForm.value.allIssuesAccess,
  //     rolePrograms
  //   };

  //   if (this.isEditMode) {
  //     console.log('Update role:', payload);
  //     this.roleService.updateRole(payload).subscribe({
  //       next: () => this.getRoles(),
  //       error: err => console.error('Update role error:', err)
  //     });
  //   } else {
  //     this.roleService.createRole(payload).subscribe({
  //       next: () => this.getRoles(),
  //       error: err => console.error('Create role error:', err)
  //     });
  //   }

  //   this.closeModal();
  // }

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

  async deleteRoles(): Promise<void> {
    const message = `Delete ${this.selectedRoleIds.length} role(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
  
    if (result.isConfirmed) {
      this.roleService.deleteRole(this.selectedRoleIds).subscribe({
        next: (res) => {
          this.selectedRoleIds.forEach(id => {
            const filteredIndex = this.filteredData.findIndex(item => item.id === id);
            if (filteredIndex !== -1) {
              this.filteredData.splice(filteredIndex, 1);
            }
          });
          this.utilityService.success(res.body.message);
        },
        error: err => {
          this.utilityService.showError(err.status , err.error.message);
        },
        complete: () => {
          this.selectedRoleIds = [];
          this.isAllSelected = false;
        }
      });
    }
  }
  

  async toggleStatus(item: any): Promise<void>  {
    const updatedStatus = !item.status;
    const payload = {
      id: item.id,
      status: updatedStatus
    };

    console.log(payload);
    const message = `Are you sure you want to set this role as ${updatedStatus ? 'Active' : 'Inactive'}?`;
    const result = await this.utilityService.confirmDialog(message, 'update');

    if (result.isConfirmed) {
    this.roleService.updateRoleStatus(payload).subscribe({
      next: () => {
        item.status = updatedStatus; // Optimistic update
        this.utilityService.success('Status updated successfully');
      },
      error: err => {
        console.error('Status update failed', err);
        this.utilityService.showError(err.status , err.error.message);
        }
      });
    }
  }
}
