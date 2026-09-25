# Clínica Salud Integral — API NestJS

## Descripción

API backend para la gestión de pacientes, médicos, especialidades, usuarios y citas de la Clínica Salud Integral.

## Tecnologías

El proyecto fue desarrollado utilizando:

NestJS
TypeScript
Prisma ORM
PostgreSQL
JWT para autenticación
Swagger para documentación de la API
class-validator para validación de datos

## Instalación

pnpm install

## Variables de entorno

Configurar las variables de entorno tomando como referencia:

.env.example

Luego ejecutar la aplicación en modo desarrollo:

pnpm run start:dev

La API utiliza el puerto definido mediante la variable PORT.

## Swagger

La documentación interactiva de la API está disponible en:

http://localhost:3000/api/docs

Swagger permite consultar los endpoints disponibles y enviar solicitudes directamente a la API.
Para los endpoints protegidos se utiliza autenticación mediante JWT.

## Autenticación

Se utiliza JSON Web Token para proteger los recursos.

Primero se debe hacer el login:

POST /auth/login

Ejemplo:

{
  "email": "usuario@example.com",
  "password": "12345678"
}

La respuesta contiene el token:

{
  "token": "..."
}

El token debe enviarse posteriormente mediante el header:

Authorization: Bearer <token>

## Roles y permisos

Se utilizan diferentes roles para controlar el acceso a los recursos:

- RECEPCIONISTA
- MEDICO
- GERENCIA

- Los Guards se encargan de validar la autenticación y autorización.

- JwtAuthGuard comprueba que la solicitud contenga un token válido.

- Si el token no existe, es inválido o está expirado, responde con un error de autenticación.

- RolesGuard comprueba que el usuario autenticado tenga uno de los roles permitidos para el endpoint. Por ejemplo, para crear una cita: RECEPCIONISTA es el rol autorizado.


## Citas

# Crear una cita

POST /citas

Requiere autenticación y rol RECEPCIONISTA.

Ejemplo de solicitud:

{
  "CI_paciente": 12345678,
  "id_medico": 1,
  "fecha_hora": "2026-10-01T10:00:00.000Z"
}

La fecha de la cita debe corresponder a una fecha futura.
Si los datos son válidos se crea la cita.

# Consultar citas

GET /citas

Puede ser utilizado por:

- RECEPCIONISTA
- MEDICO
- GERENCIA

También permite aplicar filtros mediante:
- desde
- hasta
El resultado depende del rol del usuario autenticado

# Actualizar el estado de una cita

PATCH /citas/:id/estado

Requiere autenticación y rol MEDICO.

El médico solamente puede modificar una cita que le corresponda.


## Pacientes


## Validación

## Manejo de errores

## LoggingInterceptor

## Pipeline de NestJS

## Verificación de la API