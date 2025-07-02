import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from '../../Service/AuthService/auth';

export interface MenuItem {
  id: number;
  label: string;
  priority: string;
  route: string | null;
  icon?: string;  // <-- New icon field
  children?: MenuItem[];
}

export const MENU_DATA: MenuItem[] = [
  {
    "id": 1,
    "label": "Dashboard",
    "icon": "fa-dashboard",
    "priority": "A",
    "route": "/dashboard"
  },
  {
    "id": 2,
    "label": "Settings",
    "icon": "fa-cogs",
    "priority": "B",
    "route": null
  },
  {
    "id": 3,
    "label": "User Management",
    "icon": "fa-users",
    "priority": "BA",
    "route": "/settings/users"
  },
  {
    "id": 4,
    "label": "Roles",
    "icon": "fa-lock",
    "priority": "BB",
    "route": null
  },
  {
    "id": 5,
    "label": "Audit Logs",
    "icon": "fa-file-alt",
    "priority": "BBA",
    "route": "/settings/roles/audit"
  },
  {
    "id": 6,
    "label": "Reports",
    "icon": "fa-chart-bar",
    "priority": "C",
    "route": null
  },
  {
    "id": 7,
    "label": "Sales Report",
    "icon": "fa-chart-line",
    "priority": "CA",
    "route": "/reports/sales"
  },
  {
    "id": 8,
    "label": "User Report",
    "icon": "fa-user",
    "priority": "CB",
    "route": "/reports/users"
  },
  {
    "id": 9,
    "label": "Projects",
    "icon": "fa-folder",
    "priority": "D",
    "route": null
  },
  {
    "id": 10,
    "label": "Ongoing",
    "icon": "fa-hourglass-half",
    "priority": "DA",
    "route": "/projects/ongoing"
  },
  {
    "id": 11,
    "label": "Completed",
    "icon": "fa-check-circle",
    "priority": "DB",
    "route": "/projects/completed"
  },
  {
    "id": 12,
    "label": "Archived",
    "icon": "fa-archive",
    "priority": "DC",
    "route": null
  },
  {
    "id": 13,
    "label": "By Year",
    "icon": "fa-calendar-alt",
    "priority": "DCA",
    "route": "/projects/archived/year"
  },
  {
    "id": 14,
    "label": "Support",
    "icon": "fa-life-ring",
    "priority": "E",
    "route": null
  },
  {
    "id": 15,
    "label": "Tickets",
    "icon": "fa-ticket-alt",
    "priority": "EA",
    "route": "/support/tickets"
  },
  {
    "id": 16,
    "label": "Live Chat",
    "icon": "fa-comments",
    "priority": "EB",
    "route": "/support/chat"
  },
  {
    "id": 17,
    "label": "Knowledge Base",
    "icon": "fa-book",
    "priority": "EC",
    "route": null
  },
  {
    "id": 18,
    "label": "FAQ",
    "icon": "fa-question-circle",
    "priority": "ECA",
    "route": "/support/kb/faq"
  },
  {
    "id": 19,
    "label": "Guides",
    "icon": "fa-compass",
    "priority": "ECB",
    "route": "/support/kb/guides"
  }
];


export function buildMenuTree(menuItems: MenuItem[]): MenuItem[] {
  const sortedItems = [...menuItems].sort((a, b) => a.priority.localeCompare(b.priority));
  const itemMap: { [priority: string]: MenuItem } = {};
  const root: MenuItem[] = [];

  for (const item of sortedItems) {
    item.children = [];
    itemMap[item.priority] = item;

    const parentPriority = item.priority.slice(0, -1);
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

  constructor(
    private authService:Auth
  ){}

//   ngOnInit() {
//   const nestedMenu = this.buildNestedMenu(MENU_DATA);
//   this.menuItems = this.sortMenuItems(nestedMenu);
//   this.initializeToggleStates(this.menuItems);
// }

ngOnInit(): void {
    this.menuItems = buildMenuTree(MENU_DATA);
  }


  initializeToggleStates(items: MenuItem[]) {
    for (const item of items) {
      this.toggleStates.set(item.id, false);
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
}
