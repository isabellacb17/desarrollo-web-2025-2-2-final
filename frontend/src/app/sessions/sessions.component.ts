import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { combineLatest, map, startWith, switchMap } from 'rxjs';

type Session = { id: string; roomName: string; start: string; end: string; status?: string };

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    AsyncPipe,
    DatePipe,
    NgIf,
  ],
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly snack = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['room', 'start', 'end', 'status', 'action'];
  dataSource = new MatTableDataSource<Session>([]);

  // Filtros
  roomIdControl = new FormControl<string | null>(null);
  dateRangeGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // Formulario de reserva
  form = this.fb.group(
    {
      roomId: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
    },
    {
      validators: [this.rangeValidator(), this.minDurationValidator(30)],
    }
  );

  // Streams de filtros → combineLatest → switchMap (ver README “Guía de conceptos”)
  roomId$ = this.roomIdControl.valueChanges.pipe(startWith(this.roomIdControl.value));
  dateRange$ = this.dateRangeGroup.valueChanges.pipe(startWith(this.dateRangeGroup.value));

  // TODO: Ajustar el llamado para enviar los filtros, según los valores que se tienen en el formulario.
  sessions$ = this.http.get<Session[]>('/api/sessions');

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Vincular la tabla al stream
    this.sessions$.subscribe((rows) => (this.dataSource.data = rows));
  }

  reservar() {
    if (this.form.invalid) return;
    // TODO: Endpoint real de reserva
    this.http.post('/api/sessions/book', this.form.value).subscribe({
      next: () => this.snack.open('Reserva confirmada', 'Cerrar', { duration: 2000 }),
      error: (err) => {
        if (err?.error?.code === 'SESSION_OVERLAP') {
          // Marcar errores en el formulario
          // Mostrar mensaje de error
        } else {
          this.snack.open('Error al reservar', 'Cerrar', { duration: 3000 });
        }
      },
    });
  }

  private rangeValidator() {
    return (group: FormGroup) => {
      const s = group.get('start')?.value;
      const e = group.get('end')?.value;
      if (s && e && new Date(s) >= new Date(e)) return { rangeInvalid: true };
      return null;
    };
  }

  private minDurationValidator(minMinutes: number) {
    return (group: FormGroup) => {
      const s = group.get('start')?.value;
      const e = group.get('end')?.value;
      if (s && e) {
        const ms = new Date(e).getTime() - new Date(s).getTime();
        if (ms < minMinutes * 60_000) return { minDuration: true };
      }
      return null;
    };
  }
}


