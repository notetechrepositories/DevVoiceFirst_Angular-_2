import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from '../../Service/AuthService/auth';
import { Menu } from '../../Service/MenuService/menu';

export interface MenuItem {
  id_t7_2_menu: number;
  t7_2_menu_name: string;
  t7_2_position: string;
  t7_2_icon: string | null;
  t7_2_route?: string;  // <-- New icon field
  children?: MenuItem[];
}


export function buildMenuTree(menuItems: MenuItem[]): MenuItem[] {
  const sortedItems = [...menuItems].sort((a, b) => a.t7_2_position.localeCompare(b.t7_2_position));
  const itemMap: { [priority: string]: MenuItem } = {};
  const root: MenuItem[] = [];

  for (const item of sortedItems) {
    item.children = [];
    itemMap[item.t7_2_position] = item;

    const parentPriority = item.t7_2_position.slice(0, -1);
    if (itemMap[parentPriority]) {
      itemMap[parentPriority].children!.push(item);
    } else {
      root.push(item);
    }
  }

  return root;
}


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout implements OnInit {
  menuItems: MenuItem[] = [];
  toggleStates = new Map<number, boolean>();
  isMenuCollapsed = false;



  constructor(
    private authService:Auth,
    private menuService:Menu
  ){}

  ngOnInit(): void {
    this.getMenus();
    window.addEventListener('resize',()=>{
      this.checkScreenSize();
    })
  }

  checkScreenSize(){
    if(window.innerWidth < 768){
      this.isMenuCollapsed = true;
    }
  }

  getMenus(){
    this.menuService.getMenu().subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res.status==200){
          this.menuItems=buildMenuTree(res.data.Items)
        }
      },
      error:error=>{
        console.log(error);
      }
    })
  }


  initializeToggleStates(items: MenuItem[]) {
    for (const item of items) {
      this.toggleStates.set(item.id_t7_2_menu, false);
      if (item.children?.length) {
        this.initializeToggleStates(item.children);
      }
    }
  }

  toggleMenu(itemId: number) {
    const current = this.toggleStates.get(itemId) || false;
    this.toggleStates.set(itemId, !current);
  }

  isExpanded(itemId: number): boolean {
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
