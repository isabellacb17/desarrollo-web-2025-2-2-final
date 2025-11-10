# Guía rápida: Tablas con Angular Material (MatTable)

Esta guía explica cómo se compone una tabla Material, cómo construirla y cómo leer (interpretar) sus datos en la vista de `Sessions`.

---

## 1) Partes de una tabla Material
- **DataSource**: colección de filas que la tabla renderiza. Puede ser un arreglo simple o `MatTableDataSource<T>` (para integrar con paginación y sort).
- **Columnas declaradas**: por cada columna se define un bloque `matColumnDef` con su header y celda.
- **Cabecera/filas**: se declaran las filas de encabezado y de datos, indicando qué columnas mostrar y en qué orden.
- **Paginación (MatPaginator)** y **Ordenamiento (MatSort)**: componentes auxiliares que se conectan al `dataSource`.

---

## 2) Estructura mínima (HTML)

```html
<table mat-table [dataSource]="dataSource" matSort>
  <!-- Columna Sala -->
  <ng-container matColumnDef="room">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Sala</th>
    <td mat-cell *matCellDef="let s">{{ s.roomName }}</td>
  </ng-container>

  <!-- Columna Inicio -->
  <ng-container matColumnDef="start">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Inicio</th>
    <td mat-cell *matCellDef="let s">{{ s.start | date:'short' }}</td>
  </ng-container>

  <!-- Columna Fin -->
  <ng-container matColumnDef="end">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Fin</th>
    <td mat-cell *matCellDef="let s">{{ s.end | date:'short' }}</td>
  </ng-container>

  <!-- Columna Acción -->
  <ng-container matColumnDef="action">
    <th mat-header-cell *matHeaderCellDef>Acción</th>
    <td mat-cell *matCellDef="let s">
      <button mat-stroked-button color="primary">Ver</button>
    </td>
  </ng-container>

  <!-- Filas -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>

<mat-paginator [length]="dataSource.data.length"
               [pageSize]="10"
               [pageSizeOptions]="[5,10,25]">
</mat-paginator>
```

Puntos clave:
- `matColumnDef` define cada columna (header y celda).
- `displayedColumns` (en el componente TS) determina el orden y la selección de columnas.
- `mat-sort-header` activa el ordenamiento por columna.

---

## 3) Lado TS (componente)

```ts
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';

type Session = { id: string; roomName: string; start: string; end: string };

export class SessionsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['room', 'start', 'end', 'action'];
  dataSource = new MatTableDataSource<Session>([]);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Cuando recibas datos (por HTTP/RxJS), asigna:
  // this.dataSource.data = sessions;
}
```

Puntos clave:
- Conectar `paginator` y `sort` después de que existan las vistas (`ngAfterViewInit`).
- Asignar los datos al `dataSource.data` cuando llegue la respuesta HTTP.

---

## 4) Buenas prácticas
- Mantén `displayedColumns` sincronizado con tus `<ng-container matColumnDef="...">`.
- Usa pipes (`date`, etc.) para formatear sin lógica extra en plantilla.
- Para grandes listas, pagina desde el servidor o usa filtros/orden en el backend.

---

## 5) Interpretación de la tabla (qué está mostrando)
- Cada fila corresponde a una sesión (id, sala, inicio, fin).
- El orden actual lo determina la columna con `mat-sort-header` activa (flecha en el encabezado).
- La paginación limita cuántas filas se muestran por página; revisa el paginador para saber en qué segmento estás.
- Si no hay resultados (filtros muy restrictivos), la tabla puede verse vacía: revisa filtros y rango de fechas.

Esta guía cubre lo que necesitas para leer, construir y ajustar tablas en la vista de `Sessions`.*** End Patch

