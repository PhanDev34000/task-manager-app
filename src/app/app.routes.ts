import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { BoardComponent } from './components/board/board';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'board',    component: BoardComponent, canActivate: [authGuard] },
];