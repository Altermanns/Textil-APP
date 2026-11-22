# Product Backlog & User Stories - Proyecto Integrador de Seguridad

## Epica 1: Control de Identidades y SSO (Enfoque Sistema A)

**US1: Autenticación Centralizada en Sistema A (Keycloak)**
Como administrador, quiero que el Sistema A se autentique a través de Keycloak para centralizar la gestión de identidades.

- _Criterios de Aceptación:_
  - El Sistema A redirige al login de Keycloak.
  - El usuario es creado/mapeado en el Sistema A tras el login exitoso.

**US2: Preparación para SSO**
Como desarrollador, quiero que el Sistema A utilice tokens estándar (JWT) para que el SSO sea inmediato cuando se integre el Sistema B.

- _Criterios de Aceptación:_
  - Sistema A valida la sesión de Keycloak de forma persistente.

**US3: Segundo Factor de Autenticación (2FA)**
Como responsable de seguridad, quiero obligar a los usuarios de Sistema A a usar un segundo factor (OTP).

- _Criterios de Aceptación:_
  - Keycloak solicita OTP para el acceso al Sistema A.

**US4: Autorización por Roles**
Como administrador, quiero definir roles (Admin, Operario) en Keycloak para que el acceso a funcionalidades en A y B esté restringido.

- _Criterios de Aceptación:_
  - El Sistema A reconoce el rol del token de Keycloak.
  - Usuarios sin el rol adecuado reciben un error 403.

## Epica 2: Comunicación Segura (KMS)

**US5: Comunicación Encriptada A -> B**
Como desarrollador, quiero que los datos sensibles enviados de A a B viajen encriptados usando una clave gestionada por un KMS externo.

- _Criterios de Aceptación:_
  - El Sistema A solicita encriptación al KMS.
  - El Sistema B solicita desencriptación al KMS.
  - La trama interceptada no debe ser legible sin acceso al KMS.

## Epica 3: Calidad y Seguridad de Código

**US6: Análisis Estático de Seguridad**
Como líder técnico, quiero ejecutar herramientas de análisis estático (SAST) para identificar y mitigar vulnerabilidades en el código antes del despliegue.

- _Criterios de Aceptación:_
  - Ejecución de Bandit en el código Python.
  - Reporte de brechas de seguridad generado.

---

# Planificación de Sprints (Estimación: 8 Horas)

## Sprint 1: Cimientos e Identidad (Horas 1-4)

- Configuración de infraestructura (Docker: Keycloak, Apps A y B).
- Configuración de Realm, Clientes y Roles en Keycloak.
- Integración OIDC en Sistema A y B.
- Implementación de SSO y 2FA.

## Sprint 2: Comunicación y Auditoría (Horas 5-8)

- Configuración de KMS (HashiCorp Vault o similar).
- Implementación de lógica de encriptación/desencriptación en los servicios.
- Pruebas de integración A -> B.
- Análisis SAST (Bandit).
- Preparación de presentación final.
