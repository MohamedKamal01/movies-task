
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Admin
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { MovieSearchComponent } from './admin/movie-search/movie-search.component';
import { MovieListComponent } from './admin/movie-list/movie-list.component';
// User
import { UserDashboardComponent } from './user/dashboard/user-dashboard.component';
import { MovieDetailsComponent } from './user/movie-details/movie-details.component';
import { SearchBarComponent } from './user/search-bar/search-bar.component';

// Services and helpers
import { AuthService } from './services/auth.service';
import { MovieService } from './services/movie.service';
import { TokenService } from './services/token.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';


import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,

    // Auth
    LoginComponent,
    RegisterComponent,

    // Admin
    AdminDashboardComponent,
    MovieSearchComponent,
    MovieListComponent,
    // User
    UserDashboardComponent,
    MovieDetailsComponent,
    SearchBarComponent,
 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // مكان الرسالة
      timeOut: 3000, // وقت الاختفاء
      closeButton: true, // زر إغلاق
      progressBar: true // شريط تقدم
    })
  ],
  providers: [
    AuthService,
    MovieService,
    TokenService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
