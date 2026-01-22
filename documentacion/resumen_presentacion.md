# Resumen del Proyecto para Presentación

Este documento resume los aspectos clave del proyecto "Login-CRUD", ideal para ser utilizado como base para crear diapositivas.

---

### **Diapositiva 1: Título**

-   **Título:** Login-CRUD: Sistema de Gestión de Procesos Textiles
-   **Subtítulo:** Una aplicación web full-stack para la administración de usuarios, roles y procesos en un entorno de manufactura textil.
-   **Autores:** Isaac Trujillo, Brandon Arrellano

---

### **Diapositiva 2: Visión General del Proyecto**

-   **Objetivo Principal:** Desarrollar un sistema robusto y escalable para gestionar el ciclo de vida de la producción textil, desde la materia prima hasta la hilatura, con un control de acceso detallado basado en roles.
-   **Funcionalidades Clave:**
    -   Autenticación de usuarios y gestión de sesiones.
    -   Control de acceso basado en roles (Administrativo, Preparador, Operario).
    -   Dashboards personalizados por rol.
    -   Módulos CRUD (Crear, Leer, Actualizar, Eliminar) para:
        -   Materia Prima
        -   Procesos de Preparación
        -   Procesos de Hilatura
-   **Stack Tecnológico:**
    -   **Backend:** Python, Django
    -   **Frontend:** Django Templates (SSR) y Next.js (SPA)
    -   **Base de Datos:** SQLite (para desarrollo)
    -   **Contenerización:** Docker

---

### **Diapositiva 3: Arquitectura del Sistema**

-   **Arquitectura Híbrida:** El proyecto combina un backend monolítico de Django con dos tipos de frontend, ofreciendo flexibilidad y una experiencia de usuario variada.
-   **Dos Frontends, Un Backend:**
    1.  **Django Templates:** Para la gestión interna y los CRUDs principales. Rápido, seguro y directamente integrado con el backend.
    2.  **Next.js (React):** Para una posible área de cliente o dashboard moderno (SPA), comunicándose con el backend a través de una API REST.
-   **Diagrama de Arquitectura:**
    ```mermaid
    graph TD
        subgraph "Cliente"
            A[Usuario en Navegador]
        end
        subgraph "Servidor Frontend"
            B1[Motor de Plantillas de Django]
            B2[Servidor de Next.js]
        end
        subgraph "Servidor Backend"
            C[Servidor Django / Python]
        end
        A -- HTTP Request --> B1
        A -- HTTP Request (API Call) --> B2
        B1 -- Renderiza y Sirve HTML --> A
        B2 -- Sirve JS/CSS y llama a API --> A
        B2 -- Llamada API --> C
        B1 -- Interno --> C
    ```

---

### **Diapositiva 4: Calidad y Diseño de Software**

-   **Principios SOLID y Patrones de Diseño:** Se aplicaron patrones para crear un código desacoplado, mantenible y fácil de probar.
-   **Patrones Clave:**
    1.  **Repositorio:** Abstrae el acceso a datos, permitiendo pruebas unitarias sin base de datos.
    2.  **Estrategia (Strategy):** Permite intercambiar algoritmos (como los de autenticación) sin modificar la lógica principal.
    3.  **Inversión de Dependencias (DIP):** Las capas de alto nivel no dependen de las de bajo nivel, sino de abstracciones.
-   **Beneficios:** Mayor testabilidad, flexibilidad para futuros cambios y un código más limpio y organizado.

---

### **Diapositiva 5: Roles de Usuario y Funcionalidades**

-   **Tres Roles Principales:** El sistema define permisos específicos para cada tipo de usuario.
    -   **Administrativo:** Tiene control total. Gestiona usuarios, roles y supervisa todos los procesos y reportes.
    -   **Preparador:** Enfocado en el proceso de preparación de la materia prima. Puede crear, modificar y ver los procesos de preparación.
    -   **Operario:** Encargado de la operación de maquinaria. Registra la entrada de materia prima y gestiona los procesos de hilatura.
-   **Diagrama de Casos de Uso:**
    ```mermaid
    graph TD
        subgraph "Actores"
            UA["Usuario no autenticado"]
            A(Administrativo)
            P(Preparador)
            O(Operario)
        end

        subgraph "Sistema"
            UC1[Iniciar Sesión]
            UC2[Cerrar Sesión]
            UC3[Ver Dashboard Personal]
            UC4[Gestionar CRUD de Materias Primas]
            UC5[Gestionar Procesos de Preparación]
            UC6[Gestionar Procesos de Hilatura]
            UC7[Ver Reportes Globales]
            UC8[Gestionar Usuarios y Roles]
        end

        %% Relaciones de Casos de Uso
        UA --> UC1

        %% Casos de uso comunes para roles autenticados
        A --> UC2
        P --> UC2
        O --> UC2
        A --> UC3
        P --> UC3
        O --> UC3

        %% Casos de uso específicos por rol
        O --> UC4
        P --> UC5
        O --> UC6
        A --> UC7
        A --> UC8
    ```

---

### **Diapositiva 6: Flujo de Proceso Clave**

-   **Ejemplo: Proceso de Preparación de Materia Prima:** Este flujo muestra cómo interactúan los diferentes roles y el sistema para llevar a cabo una tarea.
-   **Diagrama de Carriles (Swimlane):**
    ```mermaid
    graph TD
        subgraph Operario
            A1[Registra nueva materia prima]
        end
        subgraph Sistema
            B1[Crea registro y lo marca 'Pendiente']
        end
        subgraph Preparador
            C1[Selecciona materia para preparar]
            C2[Inicia proceso y añade detalles]
            C4[Finaliza el proceso]
        end
        subgraph Administrativo
            D1[Supervisa estado en el dashboard]
        end
        A1 --> B1 --> C1 --> C2 --> C4 --> D1
    ```

---

### **Diapositiva 7: Despliegue y Contenerización**

-   **Portabilidad con Docker:** El proyecto está completamente "dockerizado".
    -   `Dockerfile`: Define la imagen del contenedor de la aplicación Django.
    -   `docker-compose.yml`: Orquesta los servicios (aplicación y base de datos) para un despliegue sencillo y consistente en cualquier entorno.
-   **Buenas Prácticas para Producción:**
    -   Gestión de secretos (como la `SECRET_KEY`) a través de variables de entorno (`.env`).
    -   Configuraciones separadas para desarrollo y producción.
    -   Uso de un servidor de aplicaciones WSGI (como Gunicorn) detrás de un proxy inverso (como Nginx).

---

### **Diapositiva 8: Conclusión y Pasos Futuros**

-   **Logros del Proyecto:**
    -   Se construyó una base sólida y escalable para un sistema de gestión de producción.
    -   La arquitectura es flexible y fácil de mantener gracias al uso de patrones de diseño.
    -   El sistema está listo para ser desplegado de manera consistente con Docker.
-   **Posibles Mejoras y Futuro del Proyecto:**
    -   Expandir las funcionalidades del frontend de Next.js.
    -   Incrementar la cobertura de pruebas unitarias y de integración.
    -   Implementar un sistema de notificaciones en tiempo real (ej. WebSockets).
    -   Migrar la base de datos a PostgreSQL para un entorno de producción robusto.
    -   Desarrollar un módulo de reportes y analítica más avanzado.
