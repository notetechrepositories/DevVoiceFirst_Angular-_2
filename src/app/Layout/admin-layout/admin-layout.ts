import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../Service/AuthService/auth';
import { Menu } from '../../Service/MenuService/menu';

export interface MenuItem {
  id: string;
  name: string;
  position: string;
  icon: string | null;
  route?: string;
  children?: MenuItem[];
}

// Clean route and initialize empty children array
export function cleanMenuData(data: any): MenuItem[] {
  if (!Array.isArray(data)) {
    console.error('Invalid menu data:', data);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
    route: item.route,
    position: item.position,
    children: [] // assuming flat data initially
  }));
}

// Build tree structure from flat list
export function buildMenuTree(menuItems: MenuItem[]): MenuItem[] {
  const itemMap: { [position: string]: MenuItem } = {};
  const root: MenuItem[] = [];

  for (const item of menuItems) {
    item.children = [];
    itemMap[item.position] = item;
  }

  for (const item of menuItems) {
    const parentKey = item.position.slice(0, -1);
    const parent = itemMap[parentKey];
    if (parent) {
      parent.children!.push(item);
    } else {
      root.push(item);
    }
  }

  const sortTree = (items: MenuItem[]) => {
    items.sort((a, b) => a.position.localeCompare(b.position));
    for (const item of items) {
      if (item.children?.length) sortTree(item.children);
    }
  };

  sortTree(root);
  return root;
}

// Recursively apply route prefix
export function applyRoutePrefix(items: MenuItem[], prefix: string): MenuItem[] {
  return items.map((item) => ({
    ...item,
    route: item.route ? `${prefix}/${item.route}`.replace(/\/+/g, '/') : undefined,
    children: item.children ? applyRoutePrefix(item.children, prefix) : [],
  }));
}


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, RouterOutlet, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout implements OnInit {

  menuItems: MenuItem[] = [];
  toggleStates = new Map<string, boolean>();
  isMenuCollapsed = false;
  isSidebarExpanded: boolean = true;
  baseRoutePrefix = '';
  loggedInUser:any;
  isLoggedIn:boolean=false;

  iconMap: { [key: string]: string } = {
    dashboard: 'pi pi-gauge',
    company: 'pi pi-building',
    users: 'pi pi-users',
    roles: 'pi pi-id-card',
    organization: 'pi pi-sitemap',
    product: 'pi pi-box',
    country: 'pi pi-globe',
    // Add more mappings as needed
  };

  constructor(
    private authService:Auth,
    private menuService:Menu
  ){}

  ngOnInit(): void {
    window.addEventListener('resize', () => this.checkScreenSize());
    this.checkScreenSize();
    this.loggedInUser = this.authService.getLoggedInUser();
    this.loginCheck();
    this.baseRoutePrefix = `/admin`;
    this.getMenus();
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  loginCheck(){
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  @HostListener('window:resize', [])
   onWindowResize() {
     this.checkScreenSize();
   }
 
   checkScreenSize() {
     if (window.innerWidth < 768) {
       this.isSidebarExpanded = false;
     } else {
       this.isSidebarExpanded = true;
     }
   }

   getMappedIcon(icon: string | null): string {
    return this.iconMap[icon ?? ''] || 'pi pi-circle';
  }

   getMenus() {
    this.menuService.getMenu().subscribe({
      next: (res: any) => {
        if(res.status==200){          
          const cleaned = cleanMenuData(res.body.data);
          const tree = buildMenuTree(cleaned);
          const prefixed = applyRoutePrefix(tree, this.baseRoutePrefix);
          this.menuItems = prefixed;
          console.log(this.menuItems);
          this.initializeToggleStates(this.menuItems);
        }
      },
      error: (error) => console.error(error)
    });
  }

  initializeToggleStates(items: MenuItem[]) {
    for (const item of items) {
      this.toggleStates.set(item.id, false);
      if (item.children?.length) {
        this.initializeToggleStates(item.children);
      }
    }
  }

  toggleMenu(itemId: string) {
    const current = this.toggleStates.get(itemId) || false;
    this.toggleStates.set(itemId, !current);
  }

  isExpanded(itemId: string): boolean {
    return this.toggleStates.get(itemId) || false;
  }

  logout(){
    this.authService.logout();
  }

  // ====================================================================

  roles: string[] = ['Notetech Admin', 'Company Admin', 'Viewer'];
  selectedRole: string = 'Notetech Admin';

  selectRole(role: string) {
    this.selectedRole = role;
    // You can also emit an event or trigger logic based on role switch
    console.log('Switched to role:', role);
  }


}
