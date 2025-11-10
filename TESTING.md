### Guía de pruebas - Estado actual del proyecto (Angular + NestJS)

Duración estimada: 10–15 minutos

---

## 1) Arranque rápido
- Terminal A (backend):
  - `cd backend`
  - `npm run start:dev`
  - Base URL backend: `http://localhost:3000/api`

- Terminal B (frontend):
  - `cd frontend`
  - `npm start`
  - URL frontend: `http://localhost:4200`

---

## 2) Credenciales de prueba
- player: `player@u.com` / `player123`  → rol: `player`
- gm: `gm@u.com` / `gm123`              → rol: `gm`

Respuesta de login (estado actual):
```json
{
  "token": "<JWT>"
}
```
El payload del token incluye `roles` (por ejemplo `["player"]` o `["gm"]`). El frontend lo guarda en `localStorage` bajo la clave `token`.

---

## 3) Semillas de datos (backend en memoria)

### 3.1 Sessions
Sembradas en memoria en `sessions.service`. Ejemplos (UTC):
- s1: Sala `faraon`, `2025-11-15T14:00:00Z` → `15:00:00Z`, `userId: u-seed-1`
- s2: Sala `submarino`, `2025-11-15T16:00:00Z` → `17:00:00Z`, `userId: u-seed-2`
- s3: Sala `faraon`, `2025-11-15T14:30:00Z` → `15:30:00Z`, `userId: u-seed-3` (solapa con s1)
- s4: Sala `laboratorio`, `2025-11-15T14:15:00Z` → `14:45:00Z`, `userId: u-seed-1` (solapa por usuario con s1)

### 3.2 Rooms/slots
Sembrado simple (UTC):
- `faraon`: 14:00–15:00 y 15:30–16:30
- `submarino`: 16:00–17:00
- `laboratorio`: 14:15–15:15

---

## 4) Endpoints de API (estado actual)

- Login: `POST /api/auth/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Respuesta: `{ "token": "<JWT>" }`

- Listar sesiones: `GET /api/sessions?roomId=&start=&end=`
  - Filtros opcionales: `roomId` (`faraon|submarino|laboratorio`), `start` y/o `end` en ISO.

- Reservar sesión: `POST /api/sessions/book`
  - Body esperado (ejemplo):
    ```json
    { "roomId": "faraon", "userId": "u-player", "start": "2025-11-15T14:20:00Z", "end": "2025-11-15T14:50:00Z" }
    ```
  - Estado actual: siempre responde `{ "id": "<nuevoId>" }` (NO valida solapes aún; eso es parte del TODO del examen).

- Reset de semillas: `POST /api/sessions/_reset`
  - Respuesta: `{ "ok": true }`

- Slots por sala: `GET /api/rooms/slots?roomId=`

- Puntajes (protegido por rol `gm` en el backend): `POST /api/puzzle-scores`
  - Header: `Authorization: Bearer <token>`
  - Body mínimo (ejemplo): `{ "sessionId": "s1", "attempt": 1, "score": 80, "isFinal": false }`
  - Respuesta (mock actual): `{ "ok": true }`

---

## 5) Pruebas rápidas por línea de comandos

Asumiendo backend corriendo.

### 5.1 Login
```bash
curl -s http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email":"player@u.com", "password":"player123" }'
```
Respuesta esperada:
```json
{ "token": "<JWT>" }
```

### 5.2 Listar sesiones (todas)
```bash
curl -s "http://localhost:3000/api/sessions"
```
Deberías ver un arreglo con 4 elementos (s1–s4), incluyendo solapes descritos arriba.

### 5.3 Filtrar por sala
```bash
curl -s "http://localhost:3000/api/sessions?roomId=faraon"
```
Debe incluir al menos s1 y s3.

### 5.4 Reset a semillas
```bash
curl -s -X POST "http://localhost:3000/api/sessions/_reset"
```
Respuesta: `{ "ok": true }`

### 5.5 Slots
```bash
curl -s "http://localhost:3000/api/rooms/slots?roomId=faraon"
```
Debe devolver los dos intervalos para `faraon`.

---

## 6) Flujo UI (frontend)

1) Abrir `http://localhost:4200/login`
   - Iniciar sesión como `player` o `gm`.
   - Esperado: snack “Bienvenido” y redirección a “Sesiones”.

2) Ir a “Sesiones” (`/sessions`)
   - Ver barra de filtros (Sala y rango fecha/hora) y tabla Material con columnas Sala/Inicio/Fin/Estado/Acción.
   - Cambiar filtros debe refrescar la tabla (combineLatest + switchMap).

3) Probar formulario de reserva
   - Completar Sala, Inicio y Fin.
   - Validaciones visibles: “El inicio debe ser menor que el fin”, “La duración mínima es 30 minutos”.
   - Estado actual: el POST a `/api/sessions/book` devuelve `{ id }` incluso si hay solapes (la validación de solape es un TODO del examen).

4) Probar ruta protegida por rol `gm`
   - Si entras como `player`, intenta navegar a `/puzzle-scores`: el guard del frontend debe redirigirte con snack “No tienes permisos para esta sección.”
   - Con `gm`, `/puzzle-scores` debe permitir el acceso y el `POST /api/puzzle-scores` debe responder `{ ok: true }`.

5) Probar interceptor ante 401
   - Desde `localStorage`, elimina `token` y ejecuta una acción que haga una petición protegida (por ejemplo, enviar en `/puzzle-scores`). El interceptor debe limpiar sesión y redirigir a `/login?returnUrl=...`.

---

## 7) Estado actual vs. estado esperado tras TODOs

- Estado actual `POST /api/sessions/book`:
  - No valida solapes. Siempre retorna `{ "id": "<nuevoId>" }`.

- Estado esperado (después de completar el TODO del examen):
  - Debe detectar solapes por `roomId` y para el mismo `userId` (en cualquier sala).
  - En caso de conflicto, responder `400 Bad Request` con payload:
    ```json
    {
      "statusCode": 400,
      "message": "Session overlap",
      "code": "SESSION_OVERLAP",
      "details": [{ "conflictWithSessionId": "s1" }]
    }
    ```

---

## 8) Problemas comunes y soluciones
- “CORS error” desde el navegador: confirmar que el backend está en `http://localhost:3000` y que se inició con `npm run start:dev`. El backend ya expone CORS para `http://localhost:4200`.
- “No puedo acceder a /puzzle-scores siendo player”: es correcto; la ruta requiere rol `gm`. Inicia sesión como `gm@u.com`.
- “No veo datos en Sesiones”: revisa la consola del backend y el endpoint `GET /api/sessions`. Usa el botón/reset vía `POST /api/sessions/_reset` si hiciste reservas de prueba.
- Zona horaria: las semillas están en UTC; la UI muestra fechas con `date:'short'` (adaptado a tu zona local).

---

## 9) Referencias rápidas
- Backend base: `http://localhost:3000/api`
- Frontend: `http://localhost:4200`
- Login (UI): `/login`
- Sesiones (UI): `/sessions`
- Puntajes GM (UI): `/puzzle-scores` (requiere rol `gm`)

---

## 10) Instalar y usar SQLite Viewer en VS Code
1) Abre VS Code en la carpeta del proyecto.
2) Ve a Extensiones (Ctrl+Shift+X) y busca “SQLite Viewer” (autor: Florian Klampfer) o “SQLite” (autor: alexcvzz).
3) Instala la extensión.
4) En el Explorador, ubica el archivo `backend/db.sqlite`.
5) Clic derecho → “Open Database” (o “Open with” → “SQLite Viewer” según la extensión).
6) Abre el panel de la extensión:
   - “Show Tables” para ver `rooms`, `sessions`, `puzzle_scores`.
   - “New Query” para ejecutar SQL, por ejemplo:
     ```sql
     SELECT * FROM rooms;
     SELECT id, roomId, userId, startAt, endAt FROM sessions ORDER BY startAt;
     SELECT sessionId, attempt, score, createdAt FROM puzzle_scores ORDER BY createdAt DESC;
     ```
7) Si no ves datos, asegúrate de haber iniciado el backend al menos una vez (genera/siembra la BD).

---

## 11) Mockups de referencia (@mockups)
Usa la carpeta `mockups/` como guía visual durante las pruebas y la implementación de UI:
- `login.png`: layout esperado del login (card, labels, botón primario).
- `lista de sesiones.png`: disposición de filtros + tabla Material + paginador.
- `formulario de reservas.png`: estructura del form, mensajes de validación visibles.
- `error de solape.png`: feedback visual ante conflicto `SESSION_OVERLAP`.
- `Registro de puntajes.png`: formulario de puntajes para `gm`.
- `Error de sesion.png`: snackbar y navegación al login ante sesión inválida.

No es obligatorio replicar pixeles exactos, pero sí respetar la intención: componentes de Angular Material, jerarquía clara y mensajes de error/éxito coherentes.

