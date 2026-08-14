import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p class="text-slate-500">Welcome back! Here's what's happening with your blogs.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <p class="text-sm text-slate-500">Total Blogs</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats().totalBlogs }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <p class="text-sm text-slate-500">Published</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats().published }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
          <p class="text-sm text-slate-500">Drafts</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats().drafts }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
          <p class="text-sm text-slate-500">Categories</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats().categories }}</p>
        </div>
      </div>

      <!-- Recent Blogs -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Recent Blogs</h2>
        @if (recentBlogs().length === 0) {
          <p class="text-sm text-slate-400">No blogs yet. <a routerLink="/blog/create" class="text-blue-500 hover:underline">Create one</a></p>
        } @else {
          <div class="divide-y divide-slate-100">
            @for (blog of recentBlogs(); track blog.id) {
              <div class="py-3 flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-slate-800">{{ blog.title }}</h3>
                  <p class="text-xs text-slate-400">{{ blog.createdAt | date }} · {{ blog.status }}</p>
                </div>
                <a [routerLink]="['/blog', blog.id]" class="text-sm text-blue-500 hover:underline">View</a>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
    private blogService = inject(BlogService);

    stats = signal({ totalBlogs: 0, published: 0, drafts: 0, categories: 0 });
    recentBlogs = signal<any[]>([]);

    ngOnInit() {
        this.loadDashboard();
    }

    loadDashboard() {
        this.blogService.getBlogs({ limit: 5 }).subscribe({
            next: (blogs) => {
                this.recentBlogs.set(blogs);
                this.stats.set({
                    totalBlogs: blogs.length,
                    published: blogs.filter(b => b.status === 'published').length,
                    drafts: blogs.filter(b => b.status === 'draft').length,
                    categories: 0 // Will be fetched separately
                });
            }
        });

        this.blogService.getCategories().subscribe({
            next: (cats) => {
                this.stats.update(s => ({ ...s, categories: cats.length }));
            }
        });
    }
}