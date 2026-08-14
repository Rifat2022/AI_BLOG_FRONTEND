import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout.component';
import { CategoryListComponent } from './features/blog/category/category-list.component';
import { BlogCreateComponent } from './features/blog/blog-create/blog-create.component';
import { BlogDetailComponent } from './features/blog/blog-detail/blog-detail.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'blog/categories', component: CategoryListComponent },
            { path: 'blog/create', component: BlogCreateComponent },
            { path: 'blog/:id', component: BlogDetailComponent },
            { path: 'users/list', component: DashboardComponent }, // Placeholder
            { path: 'users/roles', component: DashboardComponent },
            { path: 'users/assign', component: DashboardComponent },
            { path: 'blog/list', component: CategoryListComponent },
        ]
    }
];