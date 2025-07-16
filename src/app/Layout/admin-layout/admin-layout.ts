import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, RouterOutlet, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout implements OnInit {


  menuList:any[]=[
    {
      "id_t7_2_menu": 13,
      "t7_2_menu_name": "Dashboard",
      "t7_2_position": "A",
      "t7_2_icon": "dashboard",
      "t7_2_route": "/admin/admin-dashboard"
    },
    {
      "id_t7_2_menu": 1,
      "t7_2_menu_name": "Company",
      "t7_2_position": "B",
      "t7_2_icon": "company",
      "t7_2_route": ""
    },
    {
      "id_t7_2_menu": 2,
      "t7_2_menu_name": "Users",
      "t7_2_position": "BA",
      "t7_2_icon": "Users",
      "t7_2_route": "/admin/under-development"
    },
    {
      "id_t7_2_menu": 3,
      "t7_2_menu_name": "Branch",
      "t7_2_position": "BB",
      "t7_2_icon": "Branch",
      "t7_2_route": "/admin/under-development"
    },
    {
      "id_t7_2_menu": 4,
      "t7_2_menu_name": "Section",
      "t7_2_position": "BC",
      "t7_2_icon": "Section",
      "t7_2_route": "/admin/under-development"
    },
    {
      "id_t7_2_menu": 5,
      "t7_2_menu_name": "Sub Section",
      "t7_2_position": "BD",
      "t7_2_icon": "Sub Section",
      "t7_2_route": "/admin/under-development"
    },
    {
      "id_t7_2_menu": 9,
      "t7_2_menu_name": "Subscription",
      "t7_2_position": "BE",
      "t7_2_icon": "Subscription",
      "t7_2_route": ""
    },
    {
      "id_t7_2_menu": 12,
      "t7_2_menu_name": "Product",
      "t7_2_position": "BEF",
      "t7_2_icon": "Product",
      "t7_2_route": "/admin/under-development"
    },
    {
      "id_t7_2_menu": 7,
      "t7_2_menu_name": "Sys Entry",
      "t7_2_position": "C",
      "t7_2_icon": "Sys Entry",
      "t7_2_route": ""
    },
    {
      "id_t7_2_menu": 8,
      "t7_2_menu_name": "Issue Type",
      "t7_2_position": "CA",
      "t7_2_icon": "Issue Type",
      "t7_2_route": "/admin/under-development"
    },
    {
      "id_t7_2_menu": 6,
      "t7_2_menu_name": "Business Activity",
      "t7_2_position": "CB",
      "t7_2_icon": "Business activity",
      "t7_2_route": "/admin/business-activity"
    },
    {
      "id_t7_2_menu": 10,
      "t7_2_menu_name": "Roles",
      "t7_2_position": "CC",
      "t7_2_icon": "Roles",
      "t7_2_route": "/admin/system-roles"
    },
    {
      "id_t7_2_menu": 11,
      "t7_2_menu_name": "Issue Define ",
      "t7_2_position": "D",
      "t7_2_icon": "Issue Define ",
      "t7_2_route": "/admin/under-development"
    },
    {
      "id_t7_2_menu": 14,
      "t7_2_menu_name": "Business Activity",
      "t7_2_position": "E",
      "t7_2_icon": "Business Activity",
      "t7_2_route": "/company/business-activity"
    }
  ];

  menuItems: MenuItem[] = [];
  toggleStates = new Map<number, boolean>();
  isMenuCollapsed = false;
  isSidebarExpanded: boolean = true;

  loggedInUser:any;

  constructor(
    private authService:Auth,
    private menuService:Menu
  ){}

  ngOnInit(): void {
    this.menuItems=buildMenuTree(this.menuList)
    window.addEventListener('resize',()=>{
      this.checkScreenSize();
    })

    this.loggedInUser=this.authService.getLoggedInUser();
    console.log(this.loggedInUser);
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
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

  // getMenus(){
  //   this.menuService.getMenu().subscribe({
  //     next:(res:any)=>{
  //       console.log(res);
  //       if(res.status==200){
  //         this.menuItems=buildMenuTree(res.data.Items)
  //       }
  //     },
  //     error:error=>{
  //       console.log(error);
  //     }
  //   })
  // }


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
