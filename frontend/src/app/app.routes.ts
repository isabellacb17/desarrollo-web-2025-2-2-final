import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { SessionsComponent } from './sessions/sessions.component';
import { PuzzleScoresComponent } from './puzzle-scores/puzzle-scores.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'sessions', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sessions', component: SessionsComponent },
  {
    path: 'puzzle-scores',
    component: PuzzleScoresComponent,
    canActivate: [authGuard],
    data: { roles: ['gm'] }
  },
  { path: '**', redirectTo: 'sessions' }
];
