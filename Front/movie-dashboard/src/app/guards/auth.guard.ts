import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!this.tokenService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRole = route.data['expectedRole'] as string;
    if (expectedRole) {
      const userRole = this.tokenService.getUserRole();
      if (userRole !== expectedRole) {
        this.router.navigate(['/login']);
        return false;
      }
    }

    return true;
  }
}
