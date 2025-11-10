# Examen Final – Gestión de Salas de Escape (Angular + NestJS)

Duración: 60 minutos  
Modalidad: individual (con repos base provistos)  
Objetivo: completar TODOs marcados en archivos existentes, sin crear archivos nuevos.

---

### Contexto 
En la ciudad de Arcadia, las salas de escape son más que un juego: son el laboratorio donde equipos creativos ponen a prueba comunicación, lógica y nervios bajo presión. Durante años, la operación se sostuvo con hojas de cálculo y llamadas telefónicas; el resultado fue caótico: dobles reservas, jugadores esperando fuera de horario y “Game Masters” improvisando evaluaciones sin registro histórico.

Nuestro sistema nace para ordenar el caos:
- Evita solapes automáticamente y muestra la disponibilidad en tiempo real.
- Permite a los “Game Masters” puntuar puzzles para medir dificultad y mejorar la experiencia.
- Estandariza la seguridad con sesiones autenticadas y autorización por roles.
- Ofrece una UX clara para que los jugadores reserven sin fricción.

¿Quién lo usa y cómo?
- Jugadores (player): exploran salas y reservan sesiones en franjas seguras.
- Game Masters (gm): registran puntajes y observaciones tras cada sesión para calibrar la dificultad.
- Coordinación/Operación: supervisa la ocupación, identifica cuellos de botella y ajusta la grilla de horarios.

El valor: menos errores operativos, más transparencia para el equipo y una curva de aprendizaje para los puzzles basada en datos reales, no en percepciones.

---

## Contexto del dominio
Una plataforma para gestionar Salas de Escape:
- Los jugadores reservan sesiones en salas específicas (`Room`).
- Un “Game Master” (`gm`) evalúa puzzles al finalizar (`PuzzleScore`).
- Existen restricciones de tiempo (sin solapes y con buffer) y reglas de seguridad (JWT, roles, expiración).

El backend NestJS está 100% funcional salvo algunos TODOs de lógica/seguridad/caché.  
El frontend Angular está listo con vistas y componentes base; faltan TODOs de validación, guard/interceptor y RxJS.

---

## Mockups de referencia (@mockups)
Revisa la carpeta `mockups/` en la raíz del proyecto para guiar el diseño de las vistas:
- `login.png`: pantalla de inicio de sesión (card centrado, campos email/contraseña).
- `lista de sesiones.png`: listado con filtros y tabla de sesiones.
- `formulario de reservas.png`: formulario de reserva con validaciones visibles.
- `error de solape.png`: ejemplo de feedback y resaltado ante `SESSION_OVERLAP`.
- `Registro de puntajes.png`: formulario para `gm` con score e intento.
- `Error de sesion.png`: ejemplo de snackbar/redirección al login.

Los estilos no requieren ser responsive; prioriza consistencia visual y uso de Angular Material según estos mockups.

--- 

## Reglas del examen
- No crear ni borrar archivos. Solo completar los `// TODO:` y `PASO:` marcados.
- No cambiar nombres de archivos, rutas o firmas públicas.
- No instalar librerías nuevas (todas las necesarias ya vienen instaladas).
- Mantener el estilo de código existente.
- Puedes ejecutar el proyecto y probar cuantas veces necesites dentro del tiempo.

---

## Estructura del repositorio
```
backend/        # Proyecto NestJS
  src/
    auth/
      roles.guard.ts           # TODO backend (roles + expiración cercana)
    rooms/
      rooms.controller.ts      # TODO backend (caché)
      rooms.service.ts
    sessions/
      sessions.service.ts      # TODO backend (solapes + buffer + transacción)
    puzzle-scores/
      dto/
        create-puzzle-score.dto.ts  # TODO backend (validaciones)
      puzzle-scores.service.ts
    main.ts
  README.md (guía por carpeta)

frontend/       # Proyecto Angular
  src/app/
    auth/
      auth.guard.ts            # TODO frontend (roles + expiración cercana)
    core/interceptors/
      auth.interceptor.ts      # TODO frontend (JWT + 401 + 429 backoff)
    sessions/
      sessions.component.ts    # TODO frontend (form + tabla + RxJS)
  README.md (guía por carpeta)
```

---

## Setup rápido (local)
Requisitos: Node 18+, npm, Angular CLI instalado globalmente (ya permitido).

Backend:
1) `cd backend`
2) `npm ci`
3) Copiar `.env.example` a `.env` si aplica (ya viene listo para local).
4) `npm run start:dev`

Frontend:
1) `cd frontend`
2) `npm ci`
3) `npm start` (o `ng serve`)

El backend corre por defecto en `http://localhost:3000`  
El frontend corre en `http://localhost:4200`

---

## Usuarios de prueba
- player: `player@u.com` / `player123`
- gm: `gm@u.com` / `gm123` (rol: `gm`)

Flujo:
1) Inicia sesión desde el frontend (las rutas están preconfiguradas).
2) Explora salas y slots; realiza reservas como `player`.
3) Como `gm`, registra puntajes de puzzles.

---

## Reglas de negocio clave
1) Reserva de sesiones sin solapes por sala y sin solapes para el mismo usuario (en cualquier sala).
2) El acceso a registro de `PuzzleScore` está restringido al rol `gm` (Game Master).
3) Respuestas de error estandarizadas para conflictos de agenda.
4) Frontend con guard e interceptor básicos (roles, expiración estándar) y formulario reactivo con validaciones cruzadas.

---

## TODOs a completar (criterios de aceptación)

### Backend (NestJS)
1) `src/sessions/sessions.service.ts` – Método `book`
   - Detectar solapes para el mismo `roomId`.
   - Evitar que un mismo `userId` tenga dos sesiones que se solapen (aunque sean en salas distintas).
   - Si hay conflicto, lanzar (shape estandarizado):
     ```json
     {
       "statusCode": 400,
       "message": "Session overlap",
       "code": "SESSION_OVERLAP",
       "details": [
         { "conflictWithSessionId": "…" }
       ]
     }
     ```
   - Se evaluará con datos semilla que incluyen conflictos intencionales.

2) `src/auth/roles.guard.ts`
   - Leer roles requeridos desde metadatos (`@SetMetadata('roles', ['gm'])` en controladores/endpoints).
   - Decodificar el JWT y denegar acceso si el rol requerido no está presente.
   - Validación de expiración estándar (token expirado) según el flujo ya provisto.  
   - Mensaje claro en `UnauthorizedException` cuando no tenga permisos.

### Frontend (Angular)
3) `src/app/auth/auth.guard.ts`
   - Leer roles requeridos desde `data.roles` de la ruta.
   - Decodificar JWT con `jwt-decode` y negar si está expirado (validación estándar).
   - Si deniega, limpiar sesión, redirigir a `/login` y mostrar `MatSnackBar` con mensaje de sesión inválida/expirada.

4) `src/app/core/interceptors/auth.interceptor.ts`
   - Adjuntar `Authorization: Bearer <token>`.
   - En `401 Unauthorized`: limpiar sesión y redirigir a `/login`.  
   - No implementar reintentos 429 (no aplica en este alcance).

5) `src/app/sessions/sessions.component.ts`
   - Formularios Reactivos:
     - Validación cruzada: `start < end`.
     - Duración mínima: 30 minutos.
   - UI:
     - Deshabilitar botón mientras se envía; mostrar `mat-spinner`.
     - Integrar `MatTable` con `MatPaginator` y `MatSort`.
   - Datos/RxJS:
     - Encadenar filtros con `combineLatest` (ver “Guía de conceptos”).
     - Ejecutar consulta con `switchMap` cancelando solicitudes previas (ver “Guía de conceptos”).
   - Post-acción:
     - Tras reservar: refrescar lista y mostrar `MatSnackBar` de éxito.
     - En error 400 con `code: 'SESSION_OVERLAP'`: resaltar campos de tiempo y mostrar mensaje contextual.

6) `src/app/sessions/sessions.component.html` y `src/app/sessions/sessions.component.scss`
   - Construir la vista con Angular Material:
     - Barra de acciones con filtros por sala y rango de fecha/hora.
     - Tabla (`mat-table`) con columnas: sala, inicio, fin, estado/acción.
     - Paginación (`mat-paginator`) y ordenamiento (`mat-sort`).
     - Formulario de reserva con `mat-form-field` y date/time pickers (provistos en el proyecto).
   - Estilos:
     - Jerarquía visual consistente (espaciados, tipografías, uso de `mat-card`).
     - Estados de validación visibles (`mat-error`) y foco accesible.

7) `src/app/puzzle-scores/puzzle-scores.component.html` y `.scss`
   - Implementar una vista simple para que el rol `gm` registre un puntaje:
     - Campos: sesión, intento, score (0–100), `isFinal`.
     - Validaciones visuales (requeridos, rango).
     - Botón de enviar con estado de carga.
   - Estilos: disposición clara y consistente con el look&feel general.

---

## Requisito adicional (listado de puntajes)
- Backend: implementar `GET /api/puzzle-scores?sessionId=` que devuelva los puntajes registrados (almacenamiento en memoria está bien para el examen). Incluir campos al menos: `sessionId`, `attempt`, `score`, `createdAt`. Puede protegerse con el `RolesGuard` (rol `gm`) o dejar lectura pública según lo definas para la evaluación.
- Frontend: en `puzzle-scores`, debajo del formulario, mostrar una `mat-table` que liste los puntajes de la sesión seleccionada, con columnas: Intento, Score, Fecha. Mostrar estado “Sin resultados” si no hay datos.

--- 

## Ejemplos de payloads (estandarizados)
Conflicto de agenda (400):
```json
{
  "statusCode": 400,
  "message": "Session overlap",
  "code": "SESSION_OVERLAP",
  "details": [
    { "conflictWithSessionId": "a1b2c3" }
  ]
}
```

---

## Rúbrica (100 pts)
- Backend (35 pts)
  - Solapes por sala y por usuario + shape de error: 20 pts
  - Guard: roles (gm) y expiración estándar: 15 pts
- Frontend (65 pts)
  - Guard: roles + expiración, redirección + snack: 10 pts
  - Interceptor: JWT, 401 y `X-Client-Timezone`: 10 pts
  - Sesiones (TypeScript): form reactivo, tabla con paginación/sort y RxJS `switchMap`: 20 pts
  - Vistas y estilos (HTML/SCSS): Material, responsive, validaciones visuales: 25 pts

Extra (hasta +5 pts): Indicar visualmente el intervalo conflictivo devuelto por `details` en la UI.

---

## Checklist de verificación (10 minutos)
1) Login como `player`, navegar a sesiones y probar reserva válida.
2) Intentar reservar que solape y verificar error `SESSION_OVERLAP`.
3) Expirar el token (simulado) y verificar que el guard/interceptor redirige con snack.
4) Como `gm`, acceder a la ruta con `roles: ['gm']` y confirmar que el guard lo permite.
5) Revisar vistas: estados de carga, validaciones y consistencia visual (no se exige responsive).

---

## Notas finales
- Todos los TODOs están comentados con `// TODO:` y pasos cortos.  
- No es necesario escribir pruebas unitarias en este examen.  
- La semilla de datos carga salas, usuarios y algunas sesiones para provocar conflictos reales.  
- Si algo no compila, revisa el archivo del TODO más reciente: suele ser un import faltante o una validación incompleta.

---

## Guía de conceptos (con ejemplos)

Esta sección explica brevemente los conceptos que debes usar. Copia/adapta los fragmentos según el contexto del proyecto.

### RxJS: combineLatest
“Combina” los últimos valores de varias fuentes reactivas. Útil para mezclar filtros (sala seleccionada, rango de fechas, texto de búsqueda) y disparar una sola consulta cada vez que cambie cualquiera.

Ejemplo sencillo:

```typescript
// En tu componente (TS)
roomIdControl = new FormControl<string | null>(null);
dateRangeGroup = new FormGroup({
  start: new FormControl<Date | null>(null),
  end: new FormControl<Date | null>(null),
});

roomId$ = this.roomIdControl.valueChanges.pipe(startWith(this.roomIdControl.value));
dateRange$ = this.dateRangeGroup.valueChanges.pipe(startWith(this.dateRangeGroup.value));

// Emite cada vez que cambie roomId o el rango de fechas
filters$ = combineLatest([this.roomId$, this.dateRange$]);
```

Con esto obtienes una secuencia de filtros sincronizados. A partir de ahí puedes mapearlos a una llamada HTTP (ver `switchMap` abajo).

### RxJS: switchMap
“Cambia” a un nuevo Observable y cancela el anterior. Ideal para peticiones HTTP cuando cambian rápido los filtros (evita respuestas antiguas fuera de orden).

Ejemplo combinando con `combineLatest`:

```typescript
// Servicio HTTP de sesiones (ejemplo)
getSessions(params: { roomId?: string | null; start?: string; end?: string }) {
  const httpParams = new HttpParams({ fromObject: { ...params } });
  return this.http.get<Session[]>('/api/sessions', { params: httpParams });
}

// En el componente:
sessions$ = this.filters$.pipe(
  switchMap(([roomId, range]) => {
    const startIso = range?.start ? new Date(range.start).toISOString() : undefined;
    const endIso = range?.end ? new Date(range.end).toISOString() : undefined;
    return this.sessionsService.getSessions({ roomId, start: startIso, end: endIso });
  })
);
```

Puntos clave:
- `switchMap` cancela la petición anterior si llegan nuevos filtros.
- No necesitas suscribirte manualmente si usas `| async` en plantilla.

### Angular Material: módulos e imports mínimos
Asegúrate de que en el módulo correspondiente estén importados los módulos que uses (ya instalados en el repo). Por ejemplo:

```typescript
// app.module.ts o módulo de la feature
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    // ...
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class AppModule {}
```

### MatSnackBar: mensajes de feedback
Úsalo para avisos de éxito o error (e.g., tras reservar):

```typescript
import { MatSnackBar } from '@angular/material/snack-bar';

constructor(private snack: MatSnackBar) {}

mostrarOk(mensaje: string) {
  this.snack.open(mensaje, 'Cerrar', { duration: 3000 });
}

mostrarError(mensaje: string) {
  this.snack.open(mensaje, 'Cerrar', {
    duration: 4000,
    panelClass: ['snack-error'], // opcional, define estilo en tu .scss
  });
}
```

### MatTable con paginación y sort (resumen)
TS:
```typescript
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

dataSource = new MatTableDataSource<Session>([]);
displayedColumns = ['room', 'start', 'end', 'status'];

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

// Cuando llegue sessions$:
this.sessions$.subscribe(data => this.dataSource.data = data);
```

HTML (fragmento):
```html
<table mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="room">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Sala</th>
    <td mat-cell *matCellDef="let s">{{ s.roomName }}</td>
  </ng-container>
  <!-- Repite para start, end, status -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>

<mat-paginator [length]="dataSource.data.length"
               [pageSize]="10"
               [pageSizeOptions]="[5,10,25]">
</mat-paginator>
```

### Formularios Reactivos con errores visibles
```html
<mat-form-field appearance="outline">
  <mat-label>Inicio</mat-label>
  <input matInput [matDatepicker]="pickerStart" formControlName="start">
  <mat-datepicker-toggle matSuffix [for]="pickerStart"></mat-datepicker-toggle>
  <mat-datepicker #pickerStart></mat-datepicker>
  <mat-error *ngIf="form.get('start')?.hasError('required')">
    Inicio es requerido
  </mat-error>
  <mat-error *ngIf="form.errors?.rangeInvalid">
    El inicio debe ser menor que el fin
  </mat-error>
  <mat-error *ngIf="form.errors?.minDuration">
    La duración mínima es 30 minutos
  </mat-error>
</mat-form-field>
```

### Diagrama de flujo (filtros → combineLatest → switchMap → HTTP → tabla)

```
[Controles de filtro UI]
  ├─ roomId: <mat-select>
  ├─ dateRange.start: <mat-date-range-input>
  └─ dateRange.end:   <mat-date-range-input>
            │
            │ valueChanges + startWith(valorInicial)
            ▼
        combineLatest([roomId$, dateRange$])  →  filters$
            │
            │ (cada cambio cancela la petición anterior)
            ▼
        filters$.pipe(
          switchMap(([roomId, range]) =>
            http.get('/api/sessions', { params: { roomId, start, end } })
          )
        )  →  sessions$
            │
            ├─ Template con | async → mat-table
            └─ (opcional) subscribe → dataSource.data
```



