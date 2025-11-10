import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatSnackBarModule],
  template: `
    <mat-toolbar color="primary">
      <span>{{ title() }}</span>
      <span style="flex:1 1 auto;"></span>
      <a mat-button routerLink="/sessions">Sesiones</a>
      <a mat-button routerLink="/puzzle-scores">Puntajes</a>
      <a mat-button routerLink="/login">Login</a>
    </mat-toolbar>
    <div style="padding:16px">
      <router-outlet />
    </div>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('frontend');
}
