import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, retry, catchError, throwError } from 'rxjs';
import { Blog } from '../models/blog.model';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private apiUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) { }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/blog/categories`)
      .pipe(retry(2), catchError(this.handleError));
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/blog/categories`, { name })
      .pipe(retry(1), catchError(this.handleError));
  }

  updateCategory(id: string, name: string): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/blog/categories/${id}`, { name })
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/categories/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Blogs
  getBlogs(params?: { categoryId?: string; search?: string; limit?: number; offset?: number }): Observable<Blog[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) httpParams = httpParams.set(key, value);
      });
    }
    return this.http.get<Blog[]>(`${this.apiUrl}/blog/posts`, { params: httpParams })
      .pipe(retry(2), catchError(this.handleError));
  }

  getBlog(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blog/posts/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  generateBlog(topic: string, platform: string, generateImage: boolean): Observable<{ job_id: string; status: string }> {
    return this.http.post<{ job_id: string; status: string }>(`${this.apiUrl}/generate`, {
      topic,
      platform,
      user_id: 'mock-user-id',
      generate_image: generateImage
    }).pipe(retry(1), catchError(this.handleError));
  }

  saveBlog(blog: Partial<Blog>): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/blog/posts`, blog)
      .pipe(retry(1), catchError(this.handleError));
  }
  
  createBlog(blog: Partial<Blog>): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/blog/posts`, blog)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateBlog(id: string, blog: Partial<Blog>): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/blog/posts/${id}`, blog)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/posts/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}