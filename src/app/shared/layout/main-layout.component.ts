import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent],
    template: `
    <div class="flex h-screen bg-slate-50">
      <app-sidebar />
      <main class="flex-1 overflow-auto p-6">
        <router-outlet />
      </main>
    </div>
  `
})
export class MainLayoutComponent { }