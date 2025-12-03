# Lineamientos Frontend (React + Vite)

Este documento define los estándares de desarrollo, arquitectura y convenciones para el frontend del proyecto, basándose en la implementación de referencia `libelux-frontend`.

## 1. Stack Tecnológico

*   **Core**: React 18+, TypeScript, Vite.
*   **Estado Global**: Redux Toolkit (RTK).
*   **Estilos**: Tailwind CSS (v4).
*   **Cliente HTTP**: Axios.
*   **Enrutamiento**: React Router DOM.
*   **Iconos**: Lucide React.
*   **Utilidades de Clase**: `clsx`, `tailwind-merge`.

---

## 2. Arquitectura y Estructura de Carpetas

El proyecto sigue una arquitectura orientada a **Features** (funcionalidades), agrupando la lógica relacionada con una característica específica en un mismo lugar, separándola de los componentes compartidos.

### Estructura del Proyecto

```
src/
├── app/                    # Configuración global de la aplicación
│   ├── app.tsx             # Componente raíz
│   ├── routes.tsx          # Definición centralizada de rutas
│   ├── store.ts            # Configuración del Store de Redux
│   └── private-route.tsx   # Guard para rutas protegidas
├── features/               # Módulos de negocio (Features)
│   ├── auth/               # Ejemplo: Módulo de Autenticación
│   │   ├── services/       # Servicios API específicos del feature
│   │   └── store/          # Slices y Thunks de Redux
│   ├── usuarios/           # Ejemplo: Módulo de Usuarios
│   │   ├── services/       
│   │   └── types/          # Tipos TypeScript específicos
│   └── documentos/
├── pages/                  # Páginas (Vistas) que componen la UI
│   ├── home/
│   ├── login/
│   └── usuarios/
├── shared/                 # Código reutilizable en toda la app
│   ├── components/
│   │   ├── layout/         # Componentes de estructura (Sidebar, Header)
│   │   └── ui/             # Componentes UI base (Button, Input, Modal)
│   ├── hooks/              # Hooks personalizados compartidos
│   ├── services/           # Configuración base de API (Axios)
│   └── utils/              # Funciones de utilidad puras
├── assets/                 # Imágenes, fuentes y estáticos
└── styles/                 # Estilos globales (Tailwind directives)
```

---

## 3. Gestión de Estado (Redux Toolkit)

Se utiliza **Redux Toolkit** para el estado global de la aplicación.

### 3.1 Configuración del Store
El store se configura en `src/app/store.ts` y combina los reducers de cada feature.

### 3.2 Slices y Thunks
Cada feature que requiera estado global debe tener su propio archivo slice (ej: `features/auth/store/auth-slice.ts`).
*   **Slice**: Define el estado inicial y los reducers.
*   **Thunks**: Se utilizan `createAsyncThunk` para operaciones asíncronas (llamadas API).

**Patrón de Slice:**
```typescript
// features/ejemplo/store/ejemplo-slice.ts
export const fetchData = createAsyncThunk(...)

const ejemploSlice = createSlice({
  name: 'ejemplo',
  initialState,
  reducers: {
    // Acciones síncronas
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    // Manejo de acciones asíncronas (Thunks)
    builder
      .addCase(fetchData.pending, (state) => { state.loading = true })
      .addCase(fetchData.fulfilled, (state, action) => { ... })
  }
});
```

---

## 4. Servicios y Comunicación API

La comunicación con el backend se centraliza mediante servicios que consumen una instancia configurada de Axios.

### 4.1 Cliente Axios (`api-client.ts`)
Ubicado en `src/shared/services/api-client.ts`.
*   Define la `baseURL` (usando variables de entorno `VITE_API_URL`).
*   Implementa **interceptores** para inyectar el token de autenticación (Bearer Token) en cada petición.

### 4.2 Servicios por Feature
Cada feature define sus propios servicios para interactuar con la API.
*   Ubicación: `src/features/{feature}/services/{feature}-service.ts`.
*   Exportan un objeto con funciones asíncronas.

**Ejemplo:**
```typescript
// features/usuarios/services/usuarios-service.ts
import api from '../../../shared/services/api-client';

const usuariosService = {
  getUsuarios: async () => {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  }
};
export default usuariosService;
```

---

## 5. Componentes y Estilos

### 5.1 Estilos con Tailwind CSS
Se utiliza **Tailwind CSS v4** para el estilizado.
*   No se usan archivos CSS/SCSS separados por componente, salvo casos excepcionales.
*   Para clases condicionales o dinámicas, se utiliza la combinación de `clsx` y `tailwind-merge`.

### 5.2 Configuración de Tema (Theme Variables)
La configuración de colores y variables del tema se realiza **directamente en CSS** utilizando la directiva `@theme` de Tailwind v4 en el archivo principal de estilos (`src/index.css`).

**Estructura de `index.css`:**
```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #2563eb;   /* Azul principal (acciones) */
  --color-brand-secondary: #1d4ed8; /* Azul oscuro (hover) */
  --color-brand-dark: #1e2332;      /* Fondo oscuro (sidebar) */
  --color-brand-darker: #151823;    /* Fondo más oscuro (header sidebar) */
  --color-brand-accent: #3b82f6;    /* Acento */
}
```

El uso en componentes debe referenciar estas variables como clases de utilidad: `bg-brand-primary`, `text-brand-dark`, etc.

### 5.3 Componentes UI Compartidos
Ubicados en `src/shared/components/ui`. Deben ser agnósticos a la lógica de negocio.

**Patrón de Componente UI:**
```typescript
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  // ...
}

const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => {
  return (
    <button 
      className={twMerge(clsx(
        'clases-base',
        variant === 'primary' && 'bg-brand-primary text-white hover:bg-brand-secondary', // Uso de variables de tema
        className
      ))} 
      {...props} 
    />
  );
};
```

---

## 6. Enrutamiento

El enrutamiento se maneja con **React Router DOM** y se define centralizadamente en `src/app/routes.tsx`.

*   **Rutas Públicas**: Accesibles sin autenticación (ej: Login).
*   **Rutas Privadas**: Protegidas por el componente `PrivateRoute` que verifica la existencia del token/sesión.
*   **Layouts**: Se usan componentes Layout (ej: `MainLayout`) para envolver las rutas que comparten estructura (Sidebar, Header).

---

## 7. Convenciones de Nombres

*   **Carpetas y Archivos**: `kebab-case` (ej: `user-profile.tsx`, `auth-service.ts`).
*   **Componentes React**: `PascalCase` (ej: `UserProfile`, `MainLayout`).
*   **Hooks**: `camelCase` con prefijo `use` (ej: `useAuth`, `useAxiosInterceptor`).
*   **Interfaces/Types**: `PascalCase` (ej: `User`, `AuthPayload`).

## 8. Variables de Entorno

El manejo de variables de entorno se realiza a través de archivos `.env` soportados por Vite.
*   Las variables expuestas al cliente deben prefijarse con `VITE_`.
*   Ejemplo: `VITE_API_URL=http://localhost:3000/api`

---

## 9. Prácticas Recomendadas

1.  **Imports**: Actualmente se utilizan rutas relativas (`../../`). Se recomienda mantener consistencia hasta que se configuren alias de ruta (`@/`).
2.  **Tipado Estricto**: Evitar el uso de `any`. Definir interfaces para respuestas de API y props de componentes.
3.  **Componentes Pequeños**: Un componente debe tener una única responsabilidad. Extraer lógica compleja a custom hooks.
4.  **Clean Code**: Nombres de variables y funciones descriptivos en inglés (o español consistente, pero el código fuente analizado muestra preferencia por nombres en inglés para estructura técnica y español para negocio).
