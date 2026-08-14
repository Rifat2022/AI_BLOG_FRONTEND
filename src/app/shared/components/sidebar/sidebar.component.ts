import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
    label: string;
    route: string;
    icon: string;
    children?: MenuItem[];
    expanded?: boolean;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <aside class="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div class="p-4 border-b border-slate-700">
        <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Blog AI
        </h1>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        @for (item of menuItems(); track item.route) {
          <div>
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-slate-800 text-white"
              class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <i [class]="item.icon"></i>
              <span>{{ item.label }}</span>
            </a>

            @if (item.children && item.expanded) {
              <div class="ml-6 mt-1 space-y-1">
                @for (child of item.children; track child.route) {
                  <a
                    [routerLink]="child.route"
                    routerLinkActive="bg-slate-800 text-white"
                    class="block px-3 py-1.5 text-sm hover:bg-slate-800 rounded transition-colors"
                  >
                    {{ child.label }}
                  </a>
                }
              </div>
            }
          </div>
        }
      </nav>
    </aside>
  `
})
export class SidebarComponent {
    menuItems = signal<MenuItem[]>([
        { label: 'Dashboard', route: '/dashboard', icon: 'pi pi-th-large' },
        {
            label: 'User Management',
            route: '/users',
            icon: 'pi pi-users',
            expanded: true,
            children: [
                { label: 'Users', route: '/users/list', icon: '' },
                { label: 'Roles', route: '/users/roles', icon: '' },
                { label: 'Assign Roles', route: '/users/assign', icon: '' },
            ]
        },
        {
            label: 'Blog',
            route: '/blog',
            icon: 'pi pi-file-edit',
            expanded: true,
            children: [
                { label: 'Categories', route: '/blog/categories', icon: '' },
                { label: 'Blog List', route: '/blog/list', icon: '' },
                { label: 'Create Blog', route: '/blog/create', icon: '' },
            ]
        }
    ]);
}