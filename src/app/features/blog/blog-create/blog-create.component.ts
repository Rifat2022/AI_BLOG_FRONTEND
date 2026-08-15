import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BlogService } from '../../../core/services/blog.service';
import { Nl2brPipe } from "../../../shared/pipes/nl2br.pipe";
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, ToastModule, Nl2brPipe],
  providers: [MessageService],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">Generate Blog Post</h1>

      <div class="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700">Topic</label>
          <input
            [(ngModel)]="topic"
            placeholder="Enter a topic (e.g., AI in E-commerce)"
            class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Platform</label>
          <select [(ngModel)]="platform" class="w-full px-4 py-2 border border-slate-200 rounded-lg">
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        <div class="flex items-center gap-3">
          <input type="checkbox" [(ngModel)]="generateImage" id="generateImage" />
          <label for="generateImage" class="text-sm text-slate-600">Generate image</label>
        </div>

        <button
          (click)="generate()"
          [disabled]="!topic.trim() || loading()"
          class="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {{ loading() ? 'Generating...' : 'Generate Blog' }}
        </button>

        @if (generatedBlog()) {
          <div class="mt-6 p-4 border border-slate-200 rounded-lg">
            <h2 class="font-bold text-xl">{{ generatedBlog()?.title }}</h2>
            <p class="text-sm text-slate-400 mt-1">{{ generatedBlog()?.topic }}</p>
            <div class="mt-4 prose prose-sm max-w-none" [innerHTML]="generatedBlog()?.content | nl2br"></div>
            <button (click)="save()" class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
              Save Blog
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class BlogCreateComponent {
  private blogService = inject(BlogService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  topic = '';
  platform = 'linkedin';
  generateImage = false;
  loading = signal(false);
  generatedBlog = signal<any>(null);
  selectedCategoryId : string | null = null; 

  generate() {
    if (!this.topic.trim()) return;
    this.loading.set(true);

    this.blogService.generateBlog(this.topic, this.platform, this.generateImage).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'info', summary: 'Processing', detail: 'Blog generation started' });
        // Poll for status or implement WebSocket
        this.loading.set(false);
        this.generatedBlog.set({
          title: 'Generated: ' + this.topic,
          content: 'This is a generated blog post from the AI. It will be replaced with real content.',
          topic: this.topic,
          platform: this.platform
        });
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Generation failed' });
      }
    });
  }

  save() {
  const blog = this.generatedBlog();
  if (!blog) return;

  this.blogService.createBlog({
    title: blog.title,
    content: blog.content,
    topic: this.topic,
    platform: this.platform,
    categoryId: this.selectedCategoryId || undefined || '',
  }).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Blog saved successfully' });
      this.router.navigate(['/blog/list']);
    },
    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Save failed' })
  });
}
}