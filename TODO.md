# TODO - Mejora Gestión de Citas (Admin)

- [x] Analizar CitasManager y definir mejoras UI/UX, filtros, validación y WhatsApp
- [ ] Actualizar `src/components/Admin/CitasManager.js`:
  - [x] Quitar bloque Debug (details con JSON)
  - [x] Agregar barra de búsqueda (nombre/email/telefono/servicio)
  - [x] Agregar filtros por rango de fechas (desde/hasta) y orden (asc/desc)
  - [ ] Mejorar estado vacío/loading
  - [x] Mejorar mensaje de WhatsApp (encodeURIComponent, textos más claros, emojis, normalización de teléfono)
  - [ ] Validar horario al cambiar estado (confirmar/pendiente/rechazar): evitar solapes con citas activas usando `duracion_min` y verificando intersección en frontend (y manejar 409 del backend con mensaje amigable)
- [ ] Actualizar `src/components/Admin/CitasManager.css` con estilos para la nueva UI (search, filtros fechas/orden, estados)
- [ ] Ejecutar `npm test` o `npm run build` (según corresponda) y/o revisar consola

