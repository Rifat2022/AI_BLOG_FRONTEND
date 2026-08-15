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
  templateUrl: "./category-list.component.html",
  template: ``
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