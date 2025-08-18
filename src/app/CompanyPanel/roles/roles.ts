import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { RoleService } from '../../Service/RoleService/role';
import { CompanyRoleModel, RoleModel, RoleProgramModel } from '../../Models/RoleModel';
import { ProgramService } from '../../Service/ProgramService/program';


@Component({
  selector: 'app-roles',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles {

  companyRoleData: CompanyRoleModel[] = [];
  filteredData: CompanyRoleModel[] = [];
  sysRoles: RoleModel[] = [];
  filteredSysData: RoleModel[] = [];
  originalRolePrograms: RoleProgramModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter = '';
  searchSysTerm: string = '';

  isModalVisible: boolean = false;
  isSysModalVisible: boolean = false;
  isAllSelected = false;
  isEditMode: boolean = false;

  roleForm!: FormGroup;
  sysroleForm!: FormGroup;

  selectedCompanyRoleIds: string[] = [];
  permissionKeys: string[] = [];
  modules: any[] = [];
  selectedRoleId: string | null = null;


  constructor(private fb: FormBuilder,
    private utilityService: UtilityService,
    private roleService: RoleService,
    private programService: ProgramService
  ) { }

  ngOnInit() {
    this.getCompanyRoles();
    this.getRoles();
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
    this.filteredData = this.companyRoleData.filter(item =>
      item.companyRoleName.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onSysSearch() {
    const term = this.searchSysTerm.toLowerCase();
    this.filteredSysData = this.sysRoles.filter(item =>
      item.roleName.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.filteredData = this.companyRoleData.filter(item => {
      if (this.statusFilter === '') return true;
      return Boolean(item.status === (this.statusFilter === 'true'));
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
    this.isAllSelected = this.pagedData.length > 0 && this.pagedData.every(x => this.selectedCompanyRoleIds.includes(x.id));
  }

  closeModal() {
    this.isModalVisible = false;
    this.isSysModalVisible = false;
    this.roleForm.reset();
  }


  // ===================================================

  getCompanyRoles() {
    this.roleService.getCompanyRoles().subscribe({
      next: res => {
        const roles = res?.body?.data;

        if (!Array.isArray(roles)) {
          this.utilityService.showError(500, 'Invalid response format');
          return;
        }

        this.companyRoleData = roles;
        this.filteredData = [...this.companyRoleData];
        console.log(this.filteredData);

        this.markSelectedTypes();
      },
      error: err => {
        this.utilityService.showError(err.status, err.error?.message || 'Get failed.');
      }
    });
  }

  getRoles() {
    this.roleService.getRoles().subscribe({
      next: res => {
        this.sysRoles = res.body?.data;
        this.filteredSysData = [...this.sysRoles];
        console.log(this.sysRoles);
        this.markSelectedTypes();
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

  private markSelectedTypes() {
    if (!this.sysRoles.length || !this.companyRoleData.length) return;
    const companyRoleIds = new Set(this.companyRoleData.map((item) => item.roleId)); // or item.sysRoleId
    this.sysRoles.forEach(role => {
      role.selected = companyRoleIds.has(role.id);

    });
  }

  async deleteRoles(): Promise<void> {
    const message = `Delete ${this.selectedCompanyRoleIds.length} Answer type(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.roleService.deleteCompanyRole(this.selectedCompanyRoleIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.companyRoleData = this.companyRoleData.filter(item => !deletedIds.includes(item.id));

          const remainingRoleIds = new Set(this.filteredData.map(item => item.roleId));
          this.sysRoles.forEach(type => {
            type.selected = remainingRoleIds.has(type.id);
          });

          this.selectedCompanyRoleIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }
      });
      this.selectedCompanyRoleIds = [];
      this.isAllSelected = false;

    }
  }


  // ----------------------- System Roles -----------------------

  toggleRoles(role: any) {
    if (!role.selected) {
      const payload = {
        roleId: role.id,
      };
      this.roleService.createCompanyRoleBySysRoleId(payload).subscribe({
        next: (res) => {
          if (res.status == 201) {
            const newItem = res.body.data;
            if (newItem) {
              this.filteredData.push(newItem);
              role.selected = true;
            }
          }
          this.utilityService.success(res.body.message);
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Creation failed');
        }
      });
    }
  }

  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedCompanyRoleIds.includes(id)) {
        this.selectedCompanyRoleIds.push(id);
      }
    } else {
      this.selectedCompanyRoleIds = this.selectedCompanyRoleIds.filter(x => x !== id);
    }
    this.updateSelectAllStatus();
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedCompanyRoleIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedCompanyRoleIds = [];
    }
    this.isAllSelected = checked;
  }

  async toggleStatus(item: any): Promise<void> {
    const updatedStatus = !item.status;
    const payload = {
      id: item.id,
      status: updatedStatus
    };
    console.log(payload);

    const message = `Are you sure you want to set this role as ${updatedStatus ? 'Active' : 'Inactive'}?`;
    const result = await this.utilityService.confirmDialog(message, 'update');
    if (result.isConfirmed) {
      this.roleService.updateCompanyRoleStatus(payload).subscribe({
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


  // -------------------------------

  openModal(editItem?: CompanyRoleModel) {
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

  buildForm(modules: any[], item?: CompanyRoleModel) {
    if (!modules || modules.length === 0) return;

    this.permissionKeys = Object.keys(modules[0]).filter(
      key => !['id', 'programName', 'label', 'route'].includes(key)
    );

    const permissionsGroup: any = {};
    const roleProgramsMap = new Map(item?.companyRolePrograms?.map((rp: any) => [rp.programId, rp]));

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
      companyRoleName: [item?.companyRoleName || '', Validators.required],
      allLocationAccess: [item?.allLocationAccess || false],
      allIssuesAccess: [item?.allIssuesAccess || false],
      permissions: this.fb.group(permissionsGroup)
    });

    this.originalRolePrograms = item?.companyRolePrograms || [];

    if (item?.companyRolePrograms) {
      const permissionsForm = this.roleForm.get('permissions') as FormGroup;
      item.companyRolePrograms.forEach(rp => {
        const group = permissionsForm.get(rp.programId) as FormGroup;
        const mod = modules.find(m => m.id === rp.programId);
        if (group && mod) {
          this.permissionKeys.forEach(key => {
            const ctrl = group.get(key);
            if (ctrl && mod[key]) {
              ctrl.enable();
              ctrl.setValue(rp[key as keyof RoleProgramModel]);
            }
          });
        }
      });
    }
    this.modules = modules;
  }

  extractPermissions(): RoleProgramModel[] {
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

  private handleCreate(): void {
    const payload = this.getUpdatedFields();
    this.roleService.createCompanyRole(payload).subscribe({
      next: (res) => {
        const insertedItem = res.body?.data;
        if (insertedItem) {
          this.filteredData.push(insertedItem);
        }
        this.closeModal();
        this.utilityService.success(res.body.message);
      },
      error: err => {
        this.utilityService.showError(err.status, err.error?.message || 'Creation failed');
      }
    });
  }

  private handleUpdate(): void {
    const updatedFields = this.getUpdatedFields();
    updatedFields.id = this.selectedRoleId;

    const hasUpdates =
      Object.keys(updatedFields).length > 1 || updatedFields.companyRolePrograms.length > 0;

    if (!hasUpdates) {
      this.utilityService.warning('No changes detected');
      return;
    }
    console.log(updatedFields);

    this.roleService.updateRole(updatedFields).subscribe({
      next: (res) => {
        const updatedItem = res.body?.data;
        if (updatedItem) {
          const index = this.filteredData.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) this.filteredData[index] = updatedItem;
        }
        this.closeModal();
        this.utilityService.success(res.body.message);
      },
      error: err => {
        this.utilityService.showError(err.status, err.error?.message || 'Update failed');
      }
    });
  }

  private getUpdatedFields(): any {
    const form = this.roleForm;
    const updatedFields: any = {};

    this.utilityService.setIfDirty(form, 'companyRoleName', updatedFields);
    this.utilityService.setIfDirty(form, 'allLocationAccess', updatedFields);
    this.utilityService.setIfDirty(form, 'allIssuesAccess', updatedFields);

    const permissionsForm = form.get('permissions') as FormGroup;
    const companyRolePrograms: RoleProgramModel[] = [];

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
        companyRolePrograms.push(permissionData);
      }
    });

    updatedFields.companyRolePrograms = companyRolePrograms;
    return updatedFields;
  }

  submitRoles() {
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


  //  -----------------------------
  openViewModal(viewItem: RoleModel) {
    this.isSysModalVisible = true;
    this.selectedRoleId = viewItem?.id || null;

    this.programService.getPrograms().subscribe({
      next: res => {
        this.modules = res.body.data;
      },
      error: err => console.error('Program fetch error:', err)
    });
  }

}
