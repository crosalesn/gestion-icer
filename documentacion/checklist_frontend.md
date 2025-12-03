# Checklist Frontend - Gestión ICER

## ✅ COMPLETADO (70%)

### Autenticación
- [x] Login con JWT
- [x] Redux slice para auth
- [x] PrivateRoute guard
- [x] Interceptor Axios con token
- [x] UI de login profesional

### Colaboradores
- [x] Listar colaboradores
- [x] Ver detalle de colaborador
- [x] Crear colaborador (modal)
- [x] Servicio API completo
- [x] Normalización de datos del backend
- [x] Visualización de nivel de riesgo

### Evaluaciones (Sistema Nuevo con Templates)
- [x] Vista "Mis Evaluaciones Pendientes"
- [x] Componente `DynamicEvaluationForm`
- [x] Carga de evaluaciones pendientes (`getMyPending`)
- [x] Envío de respuestas (`submitAssignment`)
- [x] Redux slice para evaluations
- [x] Tipos TypeScript completos
- [x] Validación de formularios
- [x] Soporte para SCALE_1_4 y OPEN_TEXT
- [x] Agrupación por dimensiones
- [x] Ordenamiento de preguntas

### Layout y Componentes
- [x] MainLayout con Sidebar y Header
- [x] Componentes UI base (Button, Input, Modal)
- [x] Navegación completa
- [x] Diseño responsive

### Home y Documentación
- [x] Página Home con metodología ICER
- [x] Explicación de dimensiones
- [x] Escalas de evaluación
- [x] Planes de desarrollo

### Configuración
- [x] Redux Store configurado
- [x] API Client con Axios
- [x] Rutas centralizadas
- [x] Variables de entorno

---

## 🟡 PARCIALMENTE IMPLEMENTADO (20%)

### Planes de Acción
- [x] Servicio API básico
- [x] Tipos TypeScript
- [x] Páginas creadas (vacías)
- [ ] Lista de planes implementada
- [ ] Formulario de asignación
- [ ] Vista de detalle
- [ ] Tracking de progreso

### Reportes
- [x] Página Dashboard creada
- [x] Servicio API
- [x] Visualización básica de stats
- [ ] Gráficas de evolución
- [ ] Exportación de reportes
- [ ] Métricas avanzadas

### Usuarios
- [x] Páginas creadas
- [x] Servicio básico
- [ ] Lista de usuarios
- [ ] Formulario de creación/edición
- [ ] Gestión de roles

---

## ❌ NO IMPLEMENTADO (10%)

### 🔴 CRÍTICO

#### Resultados de Hitos (MilestoneResults)
- [ ] Servicio `getCollaboratorResults`
- [ ] Tipos `MilestoneResult`
- [ ] Componente de visualización
- [ ] Gráfica de evolución de puntajes
- [ ] Integración en detalle de colaborador
- [ ] Vista de fórmulas de cálculo
- [ ] Timeline visual de hitos

#### Asignación de Evaluaciones
- [ ] Página de asignación (`/evaluaciones/asignar`)
- [ ] Formulario de asignación
- [ ] Actualizar botones en `collaborator-detail.tsx`
- [ ] Usar `assignEvaluation` en lugar de `create`

### 🟡 IMPORTANTE

#### Administración de Templates
- [ ] Página de lista de templates
- [ ] Botón "Seed Templates"
- [ ] Vista de preguntas por template
- [ ] Editor de templates (crear/editar)
- [ ] Gestión de versiones

#### Mejoras de UX
- [ ] Sistema de Toast notifications (`react-hot-toast`)
- [ ] Feedback visual en acciones
- [ ] Loading states mejorados
- [ ] Manejo de errores consistente

#### Gráficas y Visualización
- [ ] Instalar `recharts`
- [ ] Gráfica de evolución en detalle
- [ ] Gráfica de distribución de riesgos
- [ ] Gráficas en Dashboard

### 🟢 DESEABLE

#### Notificaciones
- [ ] Badge de notificaciones en header
- [ ] Panel de notificaciones
- [ ] Alertas de evaluaciones vencidas
- [ ] Alertas de riesgos detectados

#### Exportación
- [ ] Exportar reportes a PDF
- [ ] Exportar a Excel
- [ ] Imprimir fichas de colaborador

#### Testing
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests E2E

#### Otras Mejoras
- [ ] Dark mode
- [ ] Búsqueda avanzada
- [ ] Filtros mejorados
- [ ] Paginación

---

## 🔧 TAREAS DE LIMPIEZA

### Código Legacy (Sistema Antiguo de Evaluaciones)
- [ ] Marcar funciones como `@deprecated`:
  - [ ] `evaluationsService.create()`
  - [ ] `evaluationsService.submit()`
  - [ ] `evaluationsService.getById()`
  - [ ] `evaluationsService.getByCollaborator()`
- [ ] Renombrar o eliminar:
  - [ ] `features/evaluations/constants/questions.ts` ❌ ELIMINAR
  - [ ] `pages/evaluations/evaluations-list.tsx` → `*-legacy.tsx`
  - [ ] `pages/evaluations/evaluation-form.tsx` → `*-legacy.tsx`
  - [ ] `features/evaluations/types/evaluation.types.ts` → `*-legacy.types.ts`
- [ ] Actualizar `collaborator-detail.tsx`:
  - [ ] Cambiar `handleCreateEvaluation` → `handleAssignEvaluation`
  - [ ] Usar `EvaluationMilestone` enum
  - [ ] Cambiar botones de crear a asignar

---

## 📦 DEPENDENCIAS A INSTALAR

```bash
# Toast notifications (CRÍTICO)
npm install react-hot-toast

# Gráficas (IMPORTANTE)
npm install recharts

# Utilidades de fecha (OPCIONAL)
npm install date-fns

# Testing (FUTURO)
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

---

## 🎯 PLAN DE ACCIÓN INMEDIATO

### Esta Semana (Fase 1)

**Día 1-2:**
- [ ] Instalar `react-hot-toast`
- [ ] Configurar toasts en la app
- [ ] Limpiar código legacy (marcar deprecated)
- [ ] Actualizar `collaborator-detail.tsx` para usar `assignEvaluation`

**Día 3-4:**
- [ ] Implementar servicio `getCollaboratorResults`
- [ ] Crear tipos `MilestoneResult`
- [ ] Crear componente de visualización de resultados
- [ ] Integrar en detalle de colaborador

**Día 5:**
- [ ] Instalar `recharts`
- [ ] Crear gráfica de evolución de puntajes
- [ ] Añadir timeline visual de hitos
- [ ] Testing manual completo

### Próxima Semana (Fase 2)

**Día 1-2:**
- [ ] Página de asignación de evaluaciones
- [ ] Formulario de asignación
- [ ] Validaciones

**Día 3-4:**
- [ ] Lista de templates
- [ ] Botón de seed templates
- [ ] Vista de preguntas por template

**Día 5:**
- [ ] Mejorar Dashboard con gráficas
- [ ] Añadir métricas adicionales
- [ ] Testing completo

---

## 🎓 GUÍA RÁPIDA DE DESARROLLO

### Para añadir una nueva página:

1. **Crear componente de página:**
   ```
   src/pages/[modulo]/[nombre-pagina].tsx
   ```

2. **Añadir ruta en `app/routes.tsx`:**
   ```tsx
   <Route path="/ruta" element={<NuevaPagina />} />
   ```

3. **Añadir enlace en `Sidebar`:**
   ```tsx
   <NavLink to="/ruta">Nombre</NavLink>
   ```

### Para añadir un servicio de API:

1. **Definir tipos en `features/[modulo]/types/`**
2. **Crear servicio en `features/[modulo]/services/`:**
   ```typescript
   const service = {
     metodo: async () => {
       const response = await api.get<Type>('/endpoint');
       return response.data;
     }
   };
   export default service;
   ```

### Para añadir estado global (Redux):

1. **Crear slice en `features/[modulo]/store/`:**
   ```typescript
   export const asyncAction = createAsyncThunk(...);
   const slice = createSlice({ ... });
   export default slice.reducer;
   ```

2. **Registrar en `app/store.ts`:**
   ```typescript
   import moduleReducer from '../features/module/store/slice';
   
   export const store = configureStore({
     reducer: {
       module: moduleReducer,
     },
   });
   ```

### Para usar componentes UI:

```tsx
import Button from '@shared/components/ui/button';
import Input from '@shared/components/ui/input';
import Modal from '@shared/components/ui/modal/modal';

<Button variant="primary" isLoading={loading}>Texto</Button>
<Input type="text" value={value} onChange={handleChange} />
<Modal isOpen={open} onClose={close}>Contenido</Modal>
```

---

## 📊 MÉTRICAS DE PROGRESO

| Categoría | Completado | Pendiente | Total | % |
|-----------|------------|-----------|-------|---|
| Autenticación | 5 | 0 | 5 | 100% |
| Colaboradores | 6 | 0 | 6 | 100% |
| Evaluaciones (nuevo) | 10 | 2 | 12 | 83% |
| Evaluaciones (results) | 0 | 7 | 7 | 0% |
| Planes de Acción | 3 | 4 | 7 | 43% |
| Reportes | 3 | 4 | 7 | 43% |
| Templates Admin | 0 | 5 | 5 | 0% |
| Layout/UI | 4 | 0 | 4 | 100% |
| Configuración | 4 | 0 | 4 | 100% |
| **TOTAL** | **35** | **22** | **57** | **61%** |

---

## ✨ BONUS: Tips de Desarrollo

### Debug de Redux:
```bash
# Instalar Redux DevTools Extension en el navegador
# Ya está configurado automáticamente con Redux Toolkit
```

### Ver requests de API:
```
Network tab en DevTools
O revisar console.log en api-client.ts
```

### Probar evaluaciones:
1. Inicializar templates: `POST /evaluations/templates/seed`
2. Crear colaborador
3. Asignar evaluación: `POST /evaluations/assign`
4. Ver en "Mis Evaluaciones Pendientes"

### Colores de Tailwind personalizados:
```
Definidos en src/index.css:
- brand-primary
- brand-secondary
- brand-dark
- brand-darker
- brand-accent
```

---

**Última actualización:** 2 de diciembre, 2025  
**Estado general:** 61% completado  
**Próximo hito:** Implementar MilestoneResults (Fase 1)

