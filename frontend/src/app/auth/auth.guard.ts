import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';

type JwtPayload = { exp?: number; roles?: string[] };

export const authGuard: CanActivateFn = (route) => {
  const snack = inject(MatSnackBar);

  // TODO: Ajustar si el token se almacena en otra clave
  const token = localStorage.getItem('token');
  const requiredRoles = (route.data?.['roles'] as string[]) ?? [];

  // Sin token → redirigir a login
  if (!token) {
    snack.open('Sesión inválida o expirada. Inicia sesión.', 'Cerrar', { duration: 3000 });
    
    return false;
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    // TODO: Validar expiración estándar (si exp < ahora)
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      snack.open('Sesión expirada. Inicia sesión nuevamente.', 'Cerrar', { duration: 3000 });
      // TODO: Redirigir a login
      return false;
    }

    // TODO: Validar roles requeridos
    if (requiredRoles.length > 0) {
      const userRoles = payload.roles ?? [];
    }

    return true;
  } catch {
    snack.open('Token inválido. Inicia sesión nuevamente.', 'Cerrar', { duration: 3000 });
    // TODO: Redirigir a login
    return false;
  }
};


