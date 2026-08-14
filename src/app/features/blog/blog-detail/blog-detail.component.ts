import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { Nl2brPipe } from "../../../shared/pipes/nl2br.pipe";
import { Blog } from '../../../core/models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, Nl2brPipe],
  template: `
    <div class="max-w-4xl mx-auto">
      @if (loading()) {
        <div class="flex items-center justify-center h-64">
          <div class="animate-pulse text-slate-400">Loading...</div>
        </div>
      } @else if (blog()) {
        <article class="bg-white rounded-xl shadow-sm p-8">
          <!-- Back -->
          <a routerLink="/blog/list" class="text-blue-500 hover:underline text-sm inline-block mb-4">
            ← Back to blogs
          </a>

          <!-- Header -->
          <h1 class="text-3xl font-bold text-slate-800">{{ blog()?.title }}</h1>
          <div class="flex items-center gap-3 mt-2 text-sm text-slate-400">
            <span>{{ blog()?.createdAt | date }}</span>
            <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span class="capitalize px-2 py-0.5 rounded-full text-xs font-medium"
              [class.bg-green-100]="blog()?.status === 'published'"
              [class.bg-yellow-100]="blog()?.status === 'draft'"
              [class.text-green-700]="blog()?.status === 'published'"
              [class.text-yellow-700]="blog()?.status === 'draft'"
            >
              {{ blog()?.status }}
            </span>
            <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>{{ blog()?.platform | titlecase }}</span>
          </div>

          <!-- Image -->
          @if (blog()?.imageUrl) {
            <img [src]="blog()?.imageUrl" alt="Blog image" class="mt-4 rounded-lg w-full max-h-80 object-cover" />
          }

          <!-- Content -->
          <div class="mt-6 prose prose-slate max-w-none" [innerHTML]="blog()?.content ?? 'sorry' | nl2br"></div>

          <!-- Actions -->
          <div class="flex gap-3 mt-8 pt-6 border-t border-slate-100">
            <a [routerLink]="['/blog/edit', blog()?.id]" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
              Edit
            </a>
            <button (click)="deleteBlog()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm">
              Delete
            </button>
          </div>
        </article>
      } @else {
        <div class="text-center py-16 text-slate-400">
          <i class="pi pi-file text-4xl block mb-2"></i>
          <p>Blog not found</p>
        </div>
      }
    </div>
  `
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  blog = signal<Blog | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.getBlog(id).subscribe({
        next: (data) => {
          this.blog.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  deleteBlog() {
    const id = this.blog()?.id;
    if (!id || !confirm('Delete this blog?')) return;
    this.blogService.deleteBlog(id).subscribe({
      next: () => {
        alert('Blog deleted');
        window.history.back();
      }
    });
  }
}