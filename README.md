# Textil-APP (Texcore)

Sistema de gestión para procesos de producción textil, incluyendo el control de materia prima, preparación y procesos de hilatura. 

El sistema utiliza una arquitectura basada en **Clean Architecture** (Principios SOLID, Patrón Repositorio y Estrategia) y centraliza la autenticación exclusivamente a través de **Keycloak**.

## Características Principales

- **Gestión de Materia Prima:** Registro y control de inventario inicial.
- **Preparación y Hilatura:** Seguimiento del ciclo de vida de los materiales y control de calidad.
- **Autenticación Centralizada:** Login exclusivo a través de **Keycloak (OIDC)**.
- **Control de Acceso Basado en Roles (RBAC):** Redirecciones y permisos automáticos según el rol asignado en Keycloak (`admin`, `preparador`, `operario`).

## Requisitos Previos

- **Python:** 3.11 o superior.
- **Keycloak:** Una instancia de Keycloak corriendo (puede ser en Docker).

## Configuración del Entorno Local

### 1. Clonar y preparar el entorno

```powershell
# Clonar el repositorio
git clone <url-del-repositorio>
cd Textil-APP

# Crear y activar un entorno virtual
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell
# source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo para crear tu configuración local:

```powershell
cp .env.example .env
```

Edita el archivo `.env` y asegúrate de configurar los parámetros de Keycloak:

```env
DEBUG=True
SECRET_KEY=tu_clave_secreta_django
DJANGO_SETTINGS_MODULE=LoginCRUD.settings.development

# Configuración de Keycloak
KEYCLOAK_URL=http://localhost:8080
KC_REALM=textil-realm
KC_CLIENT_ID=textil-app-a
KC_CLIENT_SECRET=tu-client-secret-obtenido-de-keycloak
```

### 3. Configuración en Keycloak

Para que la aplicación funcione, tu servidor de Keycloak debe tener la siguiente configuración:

1. **Realm:** `textil-realm` (o el nombre que hayas definido en `.env`).
2. **Client:** Crear un cliente llamado `textil-app-a`.
   - **Access Type:** `confidential`.
   - **Valid Redirect URIs:** `http://localhost:8000/keycloak/callback/`
   - **Post Logout Redirect URIs:** `http://localhost:8000/`
3. **Scopes:** En "Client Scopes", asegúrate de que `openid`, `profile` y `email` estén asignados como **Default**.
4. **Roles:** Crea los roles en el cliente: `admin`, `preparador` y `operario`.
5. **Usuarios:** Crea usuarios y asígnales los roles correspondientes a través de "Role Mappings".

### 4. Base de Datos y Ejecución

Aplica las migraciones e inicia el servidor de desarrollo:

```powershell
python manage.py migrate
python manage.py runserver
```

Visita `http://localhost:8000/` y utiliza el botón de "Iniciar sesión con Keycloak".

## Arquitectura y Patrones

- **Patrón Repositorio (`repositories.py`):** Encapsula el acceso a la base de datos de Django para facilitar las pruebas y la inversión de dependencias.
- **Patrón Estrategia (`auth_strategies.py`):** Utilizado para manejar la autenticación. La estrategia de Keycloak extrae la información del usuario del token JWT y sincroniza automáticamente su rol con el modelo `Profile` de Django, permitiendo un Single Sign-On (SSO) transparente.

## Licencia

MIT License

Copyright (c) 2025 Isaac Trujillo & Brandon Arrellano
