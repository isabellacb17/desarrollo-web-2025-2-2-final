import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <mat-card>
      <h2>Iniciar sesión</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" style="display:block">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
        </mat-form-field>

        <mat-form-field appearance="outline" style="display:block">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>

        <button mat-raised-button color="primary" [disabled]="loading()">Entrar</button>
      </form>
    </mat-card>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  loading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);

    // TODO: Ajustar la URL real del backend
    this.http.post<{ token: string }>('/api/auth/login', this.form.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.snack.open('Bienvenido', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/sessions']);
      },
      error: () => {
        this.snack.open('Credenciales inválidas', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }
}


