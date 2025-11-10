import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-puzzle-scores',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  // TODO: Extraer la vista a un archivo HTML independiente e importarlo acá
  template: `
    <mat-card>
      <h2>Puntajes de Puzzles</h2>
      <form (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" style="display:block">
          <mat-label>Sesión ID</mat-label>
          <input matInput>
        </mat-form-field>

        <mat-form-field appearance="outline" style="display:block">
          <mat-label>Intento</mat-label>
          <input matInput type="number">
        </mat-form-field>

        <mat-form-field appearance="outline" style="display:block">
          <mat-label>Score (0-100)</mat-label>
          <input matInput type="number">
        </mat-form-field>

        <mat-checkbox>Final</mat-checkbox>

        <div style="margin-top:12px">
          <button mat-raised-button color="primary">Guardar</button>
        </div>
      </form>
    </mat-card>
  `,
})
export class PuzzleScoresComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly snack = inject(MatSnackBar);

  form = this.fb.group({
    sessionId: ['', Validators.required],
    attempt: [1, [Validators.required, Validators.min(1)]],
    score: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    isFinal: [false],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.http.post('/api/puzzle-scores', this.form.value).subscribe({
      next: () => this.snack.open('Puntaje guardado', 'Cerrar', { duration: 2000 }),
      error: () => this.snack.open('Error al guardar', 'Cerrar', { duration: 3000 }),
    });
  }
}


