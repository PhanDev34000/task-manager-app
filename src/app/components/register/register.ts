import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  username = '';
  email    = '';
  password = '';
  confirm  = '';
  error    = '';
  loading  = false;

  constructor(
    private authService: AuthService,
    private router:      Router
  ) {}

  onSubmit(): void {
    if (!this.username || !this.email || !this.password) return;

    if (this.password !== this.confirm) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit faire au moins 6 caractères';
      return;
    }

    this.loading = true;
    this.error   = '';

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/board']);
      },
      error: (err) => {
        this.loading = false;
        this.error   = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
}