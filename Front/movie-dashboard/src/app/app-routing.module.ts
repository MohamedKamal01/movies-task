
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user/dashboard/user-dashboard.component';
import { MovieDetailsComponent } from './user/movie-details/movie-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/movie/:id', component: MovieDetailsComponent },

  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' }
  },

  {
    path: 'user/dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'USER' }
  },

  // Fallback for unknown routes
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
