import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username = '';
  password = '';
  role = 'USER'; // default role
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.register(this.username, this.password, this.role).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! You can now login.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Try another username.';
        console.error(err);
      },
    });
  }
}
