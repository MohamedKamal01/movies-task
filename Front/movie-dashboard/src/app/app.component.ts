
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent {
  isLoading = this.loaderService.isLoading;

  constructor(private tokenService: TokenService, private router: Router, private loaderService: LoaderService) { }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.tokenService.getUserRole() === 'ADMIN';
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
