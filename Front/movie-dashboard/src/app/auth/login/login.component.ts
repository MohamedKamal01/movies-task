import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router,
    private tokenService: TokenService) { }

    onSubmit() {
      this.errorMessage = '';
      this.authService.login(this.username, this.password).subscribe({
        next: (token: string) => {
  
          const payload = JSON.parse(atob(token.split('.')[1]));
          const roles: string[] = payload.roles;
  
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin/dashboard']);
          } else if (roles.includes('ROLE_USER')) {
            this.router.navigate(['/user/dashboard']);
          } else {
            this.errorMessage = 'Unknown role';
          }
        },
        error: (err) => {
          this.errorMessage = 'Invalid username or password';
          console.error(err);
        },
      });
    }
}
