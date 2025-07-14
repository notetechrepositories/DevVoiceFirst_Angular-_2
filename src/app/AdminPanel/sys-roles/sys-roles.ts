import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Program } from '../../Service/ProgramService/program';
import { Role } from '../../Service/RoleService/role';

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

  checkIcon = '<i class="fa-solid fa-check text-success"></i>';
  crossIcon = '<i class="fa-solid fa-xmark text-danger"></i>';

  constructor(
    private fb: FormBuilder,
    private programService: Program,
    private roleService: Role
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
      key => !['id', 'programName', 'label', 'route'].includes(key)
    );

    const permissionsGroup: any = {};
    modules.forEach(mod => {
      const group: any = {};
      this.permissionKeys.forEach(key => {
        group[key] = [{ value: false, disabled: !mod[key] }];
      });
      permissionsGroup[mod.id] = this.fb.group(group);
    });

    this.roleForm = this.fb.group({
      roleName: [item?.roleName || ''],
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
        }
      });
    }
  }

  extractPermissions(): RoleProgram[] {
    const permissionsForm = this.roleForm.get('permissions') as FormGroup;
    return this.modules.map(mod => {
      const modGroup = permissionsForm.get(mod.id) as FormGroup;
      const permissionData: any = { programId: mod.id };
      this.permissionKeys.forEach(key => {
        permissionData[key] = modGroup.get(key)?.disabled ? false : modGroup.get(key)?.value;
      });
      return permissionData;
    });
  }

  submitForm() {
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

  deleteRole(role: Roles) {
    this.filteredData = this.filteredData.filter(r => r.id !== role.id);
  }
}
