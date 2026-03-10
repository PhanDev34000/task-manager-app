import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  email    = '';
  password = '';
  error    = '';
  loading  = false;

  constructor(
    private authService: AuthService,
    private router:      Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.error   = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/board']);
      },
      error: (err) => {
        this.loading = false;
        this.error   = err.error?.message || 'Erreur de connexion';
      }
    });
  }
}