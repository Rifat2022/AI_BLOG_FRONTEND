import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BlogService } from '../../../core/services/blog.service';
import { Category } from '../../../core/models/category.model';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, ToastModule],
    providers: [MessageService],
    template: `
    <div class="flex gap-6 h-full">
      <!-- Left Panel: Categories -->
      <div class="w-80 bg-white rounded-xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Categories</h2>
          <button
            (click)="showCreateDialog = true"
            class="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
          >
            + Add
          </button>
        </div>

        <!-- Search -->
        <input
          [(ngModel)]="searchTerm"
          (ngModelChange)="filterCategories()"
          placeholder="Search categories..."
          class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <!-- Category List -->
        <div class="mt-3 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
          @for (cat of filteredCategories(); track cat.id) {
            <div
              (click)="selectCategory(cat)"
              class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition"
              [class.bg-blue-50]="selectedCategoryId() === cat.id"
            >
              <span class="text-sm text-slate-700">{{ cat.name }}</span>
              <div class="flex gap-1">
                <button (click)="editCategory(cat); $event.stopPropagation()" class="text-slate-400 hover:text-blue-500 text-xs">
                  <i class="pi pi-pencil"></i>
                </button>
                <button (click)="deleteCategory(cat.id); $event.stopPropagation()" class="text-slate-400 hover:text-red-500 text-xs">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>
          } @empty {
            <p class="text-sm text-slate-400 text-center py-4">No categories found</p>
          }
        </div>
      </div>

      <!-- Right Panel: Blog List -->
      <div class="flex-1 bg-white rounded-xl shadow-sm p-4">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">
          Blogs
          @if (selectedCategory()) {
            <span class="text-sm font-normal text-slate-500">in {{ selectedCategory()?.name }}</span>
          }
        </h2>

        <!-- Blog Search -->
        <input
          [(ngModel)]="blogSearch"
          (ngModelChange)="filterBlogs()"
          placeholder="Search blogs..."
          class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <!-- Blog List -->
        <div class="mt-3 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
          @for (blog of filteredBlogs(); track blog.id) {
            <div class="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:shadow-sm transition">
              <div>
                <h3 class="font-medium text-slate-800">{{ blog.title }}</h3>
                <p class="text-xs text-slate-400">{{ blog.createdAt | date }}</p>
              </div>
              <div class="flex gap-2">
                <button (click)="viewBlog(blog.id)" class="text-blue-500 hover:text-blue-600 text-sm">View</button>
                <button (click)="editBlog(blog)" class="text-slate-400 hover:text-blue-500 text-sm">Edit</button>
                <button (click)="deleteBlog(blog.id)" class="text-slate-400 hover:text-red-500 text-sm">Delete</button>
              </div>
            </div>
          } @empty {
            <p class="text-sm text-slate-400 text-center py-8">No blogs in this category</p>
          }
        </div>
      </div>
    </div>

    <!-- Create/Edit Category Dialog -->
    <p-dialog header="Category" [(visible)]="showCreateDialog" [modal]="true" [style]="{ width: '450px' }">
      <div class="space-y-3">
        <label class="block text-sm font-medium text-slate-700">Category Name</label>
        <input [(ngModel)]="categoryForm.name" placeholder="Enter category name..." class="w-full px-3 py-2 border rounded-lg" />
        <div class="flex justify-end gap-2 pt-2">
          <button (click)="showCreateDialog = false" class="px-4 py-2 border rounded-lg hover:bg-slate-50 transition">Cancel</button>
          <button (click)="saveCategory()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Save</button>
        </div>
      </div>
    </p-dialog>
  `
})
export class CategoryListComponent implements OnInit {
    private blogService = inject(BlogService);
    private messageService = inject(MessageService);

    categories = signal<Category[]>([]);
    selectedCategoryId = signal<string | null>(null);
    selectedCategory = signal<Category | null>(null);
    searchTerm = '';
    filteredCategories = signal<Category[]>([]);

    blogs = signal<any[]>([]);
    filteredBlogs = signal<any[]>([]);
    blogSearch = '';

    showCreateDialog = false;
    categoryForm = { id: '', name: '' };

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.blogService.getCategories().subscribe({
            next: (data) => {
                this.categories.set(data);
                this.filterCategories();
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' })
        });
    }

    filterCategories() {
        const term = this.searchTerm.toLowerCase();
        this.filteredCategories.set(
            this.categories().filter(c => c.name.toLowerCase().includes(term))
        );
    }

    selectCategory(category: Category) {
        this.selectedCategoryId.set(category.id);
        this.selectedCategory.set(category);
        this.loadBlogs(category.id);
    }

    loadBlogs(categoryId: string) {
        this.blogService.getBlogs({ categoryId }).subscribe({
            next: (data) => {
                this.blogs.set(data);
                this.filteredBlogs.set(data);
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load blogs' })
        });
    }

    filterBlogs() {
        const term = this.blogSearch.toLowerCase();
        this.filteredBlogs.set(
            this.blogs().filter(b => b.title.toLowerCase().includes(term))
        );
    }

    saveCategory() {
        const name = this.categoryForm.name.trim();
        if (!name) return;

        const request = this.categoryForm.id
            ? this.blogService.updateCategory(this.categoryForm.id, name)
            : this.blogService.createCategory(name);

        request.subscribe({
            next: () => {
                this.showCreateDialog = false;
                this.categoryForm = { id: '', name: '' };
                this.loadCategories();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category saved' });
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save category' })
        });
    }

    editCategory(category: Category) {
        this.categoryForm = { id: category.id, name: category.name };
        this.showCreateDialog = true;
    }

    deleteCategory(id: string) {
        if (!confirm('Delete this category?')) return;
        this.blogService.deleteCategory(id).subscribe({
            next: () => {
                this.loadCategories();
                this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Category deleted' });
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' })
        });
    }

    viewBlog(id: string) { /* Navigate to blog detail */ }
    editBlog(blog: any) { /* Open edit dialog */ }
    deleteBlog(id: string) { /* Delete blog */ }
}