# Diagramas Adicionales del Sistema

Este documento proporciona diagramas de alto nivel para entender la estructura, el uso y los flujos del proyecto.

---

## 1. Diagrama de Clases

Este diagrama muestra los modelos de datos más importantes del sistema y las relaciones entre ellos. Se centra en las entidades principales de la aplicación `Texcore`.

```mermaid
classDiagram
    direction LR

    class User {
        -username
        -password
        -email
    }

    class Profile {
        -role
    }

    class Materia {
        -tipo
        -cantidad
        -lote
    }

    class PreparacionMateria {
        -tipo_proceso
        -estado
        -cantidad_procesada
    }

    class DetallePreparacion {
        -temperatura
        -humedad
        -equipo_utilizado
    }
    
    class ProcesoHilatura {
        -etapa
        -estado
        -cantidad_fibra_entrada
        -cantidad_hilo_salida
    }

    class DetalleHilatura {
        -velocidad_maquina
        -temperatura
        -humedad
        -maquina_hiladora
    }

    User "1" -- "1" Profile : extends
    User "1" -- "0..*" Materia : "registra"
    User "1" -- "0..*" PreparacionMateria : "es preparador"
    User "1" -- "0..*" ProcesoHilatura : "es operador"

    Materia "1" -- "0..*" PreparacionMateria : "es origen de"
    PreparacionMateria "1" -- "0..*" DetallePreparacion : "tiene detalles"
    PreparacionMateria "1" -- "0..*" ProcesoHilatura : "es origen de"
    ProcesoHilatura "1" -- "0..*" DetalleHilatura : "tiene detalles"
```

---

## 2. Diagrama de Casos de Uso

Este diagrama ilustra las interacciones entre los diferentes tipos de usuarios (actores) y el sistema. Muestra las funcionalidades clave que cada rol puede realizar.

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

## 3. Diagrama de Flujo (Proceso de Login)

Este diagrama de flujo detalla los pasos que sigue el sistema cuando un usuario intenta iniciar sesión, desde que introduce sus credenciales hasta que es redirigido a su panel de control correspondiente.

```mermaid
graph TD
    Start((Inicio)) --> Input[Usuario introduce<br>username y password]
    Input --> Validate{¿Credenciales válidas?}
    Validate -- No --> ErrorMsg["Mostrar mensaje 'Credenciales inválidas'"]
    ErrorMsg --> Finish((Fin))
    
    Validate -- Sí --> Auth[Autenticar usuario y<br>crear sesión]
    Auth --> GetRole{Obtener rol del usuario}
    GetRole -- Rol: Admin --> RedirectAdmin[Redirigir a /dashboard/admin]
    GetRole -- Rol: Preparador --> RedirectPrep[Redirigir a /dashboard/preparador]
    GetRole -- Rol: Operario --> RedirectOp[Redirigir a /dashboard/operario]
    
    RedirectAdmin --> EndAdmin((Fin))
    RedirectPrep --> EndPrep((Fin))
    RedirectOp --> EndOp((Fin))
```
---

## 4. Diagrama de Carriles (Swimlane) - Proceso de Preparación

Este diagrama de carriles muestra cómo el proceso de preparación de materia prima fluye a través de diferentes roles (Operario, Preparador, Administrativo) y el sistema.

```mermaid
graph TD
    subgraph Operario
        A1[Registra nueva materia prima]
    end
    subgraph Sistema
        B1[Crea registro de Materia Prima]
        B2[Estado de preparación: 'Pendiente']
        B3[Actualiza estado a 'En Proceso']
        B4[Registra detalles del proceso]
        B5[Actualiza estado a 'Completada']
    end
    subgraph Preparador
        C1[Selecciona materia para preparar]
        C2[Inicia el proceso de preparación]
        C3[Añade detalles: temperatura, humedad, etc.]
        C4[Finaliza y marca como 'Completada']
    end
    subgraph Administrativo
        D1[Supervisa dashboards]
        D2[Verifica estado de los procesos]
    end

    A1 --> B1
    B1 --> C1
    C1 --> B2
    B2 --> C2
    C2 --> B3
    B3 --> C3
    C3 --> B4
    B4 --> C4
    C4 --> B5
    B5 --> D1
    D1 --> D2
```