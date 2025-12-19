# Guion Detallado para la Demo — Login-CRUD

Este documento contiene el guion minuto a minuto, comandos, cuentas de prueba, rutas y pasos precisos para exponer la aplicación `Login-CRUD`. Está pensado para imprimir y usar como guía durante la presentación.

---

## Información básica

- Tiempo total recomendado: 12–15 minutos (demo) + 5–10 minutos (preguntas).
- URL de desarrollo por defecto: `http://127.0.0.1:8000/`
- Ruta de repo: `Login-CRUD/`

## Preparación (antes de la demo)

Ejecuta estos pasos en PowerShell en la carpeta raíz del proyecto (`Login-CRUD`):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
# Crear superusuario (sigue las instrucciones interactivas)
python manage.py createsuperuser
# (Opcional) o usar el comando custom si existe
python manage.py crear_usuario
python manage.py runserver
```

Si usas Docker (alternativa):

```powershell
docker-compose up --build
```

Comprueba que `http://127.0.0.1:8000/` responde antes de comenzar.

---

## Cuentas de prueba (sugeridas)

- Superusuario: creado con `createsuperuser` (elige `admin@example.com` / `Password123`).
- Si usas `crear_usuario`, revisa `management/commands/crear_usuario.py` para los credenciales generados.

---

## Guion minuto a minuto (lista para leer)

1. 00:00–00:30 — Apertura (30s)

   - Saludo rápido y objetivo: "Presento Login-CRUD, una app en Django para gestionar usuarios y procesos con roles y dashboards."

2. 00:30–01:30 — Stack y arquitectura (1 min)

   - Menciona: `Python`, `Django`, `SQLite` (dev), `Docker`.
   - Señala las carpetas clave: `Texcore/` (app principal), `Texcore/services/`, `Texcore/views/`, `Texcore/templates/`, `management/commands/`.

3. 01:30–02:00 — Preparación rápida (30s)

   - Indica que los datos de prueba ya están listos (creó el superusuario) y el servidor está en `127.0.0.1:8000`.

4. 02:00–04:30 — Demo: Login y dashboards por rol (2:30)

   - Abre `http://127.0.0.1:8000/` y navega a la pantalla de login (`/login` si aplica).
   - Inicia sesión con la cuenta de prueba.
   - Explica que hay dashboards distintos según rol y abre `paginas/admin_dashboard.html` o el dashboard correspondiente.
   - Señala los menús o accesos que cambian según el rol.

5. 04:30–08:00 — Demo: CRUD (3:30)

   - Ve a la sección de `materias` o `preparacion` (usa la navegación del proyecto).
   - Pulsar "Crear": explicar campos importantes, validaciones y por qué están en `forms.py`.
   - Guardar, luego editar el mismo registro y mostrar la lista actualizada.
   - (Opcional) Eliminar un registro si es seguro hacerlo.

6. 08:00–09:00 — Demo: Reporte o vista detalle (1 min)

   - Abre una vista `reporte.html` o `detalle.html` y muestra agregaciones o datos calculados.

7. 09:00–10:00 — Código clave (1 min)

   - Abrir rápidamente `Texcore/services/auth_service.py` y explicar dónde está la lógica de autenticación/roles.
   - Mostrar `Texcore/models.py` (modelo `Profile` o `User` extendido) y una relación importante (p. ej. `Preparacion` -> `Materia`).

8. 10:00–11:00 — Despliegue y notas (1 min)

   - Menciona `Dockerfile`, `docker-compose.yml` y `DEPLOYMENT.md` como opciones para producción.

9. 11:00–12:00 — Conclusión y Q&A (1 min)
   - Resumen breve de logros y mejoras futuras.

---

## Comandos útiles para abrir durante la demo (rápidos)

- Abrir logs o consola de Django (si necesitas mostrar errores): `.\.venv\Scripts\Activate.ps1` luego `python manage.py runserver` (ver la salida en la terminal).
- Si necesitas re-inicializar datos: `python manage.py flush` y luego `python manage.py loaddata your_fixture.json` o ejecutar `init_data.py` si aplica.

---

## Rutas y archivos que conviene tener localizados (para abrir rápido)

- `Texcore/templates/paginas/login.html` — pantalla de login.
- `Texcore/templates/paginas/admin_dashboard.html` — dashboard de admin.
- `Texcore/views/auth_views.py` o `Texcore/views_old.py` — donde están las vistas de autenticación.
- `Texcore/services/auth_service.py` — lógica de autorización/roles.
- `Texcore/forms.py` — validaciones de formularios.
- `Texcore/models.py` — modelos principales.
- `management/commands/crear_usuario.py` — script para usuarios de prueba.

---

## Fallos esperados y Plan B (qué hacer si algo falla)

- Problema de dependencias: usar Docker para asegurar entorno reproducible.
- CSS/estilos no cargan: continuar la demo sin estilos (funcionalidad intacta) o mostrar capturas en `presentacion_assets/`.
- Servidor falla en vivo: tener un video corto (2–3 min) con el flujo completo listo para reproducir.

---

## Capturas / Vídeo (Plan B)

- Recomendación: grabar un vídeo de pantalla de 2–3 minutos con: login → crear registro → editar → reporte. Guardar en `presentacion_assets/demo.mp4`.
- Si prefieres capturas, guardar 6 archivos: `login.png`, `dashboard.png`, `crear.png`, `editar.png`, `lista.png`, `reporte.png`.

---

## Checklist final previo a subir al escenario

- [ ] Ejecuté `pip install -r requirements.txt`.
- [ ] Ejecuté `python manage.py migrate`.
- [ ] Creé las cuentas de prueba necesarias.
- [ ] Servidor arrancado y URL verificada.
- [ ] Slides exportados a PDF.
- [ ] Vídeo o capturas guardadas como Plan B.
- [ ] Ensayé la demo al menos 1 vez cronometrada.

---

Si quieres, puedo: (A) crear las capturas `presentacion_assets/` automáticamente, (B) generar las diapositivas en Markdown o PPTX, o (C) grabar un vídeo demo con comandos que tú ejecutes localmente. Dime qué prefieres y procedo.
