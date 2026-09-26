# Clínica Salud Integral — API NestJS

## Descripción

API backend para la gestión de pacientes, médicos, especialidades, usuarios y citas de la Clínica Salud Integral.

## Tecnologías

El proyecto fue desarrollado utilizando:

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT para autenticación
* Swagger para documentación de la API
* class-validator para validación de datos

## Instalación

### Requisitos

* Node.js
* pnpm
* PostgreSQL

Instalar las dependencias:

```bash
pnpm install
```

## Variables de entorno

Configurar las variables de entorno tomando como referencia el archivo:

```text
.env.example
```

Generar Prisma Client:

```bash
pnpm prisma generate
```

Luego ejecutar la aplicación en modo desarrollo:

```bash
pnpm run start:dev
```

La API utiliza el puerto definido mediante la variable `PORT`.

## Swagger

La documentación interactiva de la API está disponible en:

```text
http://localhost:3000/api/docs
```

Swagger permite consultar los endpoints disponibles, visualizar los DTOs y enviar solicitudes directamente a la API.

Los endpoints protegidos utilizan autenticación mediante JWT.

## Autenticación

Se utiliza JSON Web Token para proteger los recursos.

Primero se debe realizar el login:

```text
POST /auth/login
```

Ejemplo:

```json
{
  "email": "usuario@gmail.com",
  "password": "12345678"
}
```

La respuesta contiene el token:

```json
{
  "token": "..."
}
```

El token debe enviarse posteriormente mediante el encabezado:

```text
Authorization: Bearer <token>
```

En Swagger se puede utilizar el botón **Authorize** para ingresar el token y acceder a los endpoints protegidos.

## Roles y permisos

La API utiliza los siguientes roles:

* `RECEPCIONISTA`
* `MEDICO`
* `GERENCIA`

Los Guards controlan la autenticación y autorización:

* `JwtAuthGuard`: comprueba que exista un JWT válido.
* `RolesGuard`: comprueba que el usuario tenga el rol requerido para acceder al endpoint.

Si el token no existe, es inválido o está expirado, la solicitud es rechazada.

## Endpoints principales

### Autenticación

#### Registrar usuario

`POST /auth/register`

#### Iniciar sesión

`POST /auth/login`

Permite autenticarse y obtener un JWT.

---

# Pacientes

### Listar todos los pacientes registrados

`GET /pacientes`


### Consultar  datos de un paciente mediante su id 

`GET /pacientes/:id`


### Consultar expediente

`GET /pacientes/:CI/expediente`

Permite consultar los datos del paciente junto con su historial de citas.

El historial incluye:

* Fecha de la cita.
* Estado.
* Médico.
* Especialidad.

### Crear un nuevo registro de paciente

`POST /pacientes`


### Actualizar los datos de un paciente

`PATCH /pacientes/:id`


### Eliminar paciente

`DELETE /pacientes/:id`

---

# Médicos

### Consultar médicos

`GET /medicos`

Permite consultar los médicos registrados. También permite filtrar médicos por especialidad.

### Consultar datos de un médico

`GET /medicos/:id`

### Consultar agenda

`GET /medicos/citas`

Requiere autenticación y rol `MEDICO`.

Permite al médico autenticado consultar sus propias citas.

Puede utilizar los filtros:

* `desde`
* `hasta`

Ejemplo:

```text
GET /medicos/citas?desde=2026-10-01T00:00:00.000Z&hasta=2026-10-31T23:59:59.999Z
```

El médico solamente puede consultar las citas que le corresponden.

### Crear un nuevo médico

`POST /medicos`


### Actualizar datos de un médico

`PATCH /medicos/:id`


### Eliminar médico

`DELETE /medicos/:id`


---

# Especialidades

### Consultar especialidades disponibles

`GET /especialidades`


### Consultar especialidad por su id

`GET /especialidades/:id`


### Crear especialidad

`POST /especialidades`


### Actualizar especialidad

`PATCH /especialidades/:id`


### Eliminar especialidad

`DELETE /especialidades/:id`

---

# Citas

### Crear cita

`POST /citas`

Permite agendar una cita entre un paciente y un médico.

Requiere autenticación y rol `RECEPCIONISTA`.

Antes de crear la cita se valida que:

* El paciente exista.
* El médico exista.
* La fecha no sea anterior a la fecha actual.

### Consultar citas

`GET /citas`

Puede ser utilizado por:

* `RECEPCIONISTA`
* `MEDICO`
* `GERENCIA`

Permite aplicar los filtros:

* `desde`
* `hasta`

El resultado depende del rol del usuario autenticado.

Un usuario con rol `MEDICO` solamente obtiene las citas asociadas al médico autenticado.

### Actualizar el estado de una cita

`PATCH /citas/:id/estado`

Requiere autenticación y rol `MEDICO`.

Permite actualizar el estado de una cita a:

* `PROGRAMADA`
* `COMPLETADA`
* `CANCELADA`

El médico solamente puede modificar una cita que le corresponda.

---

# Usuarios

Los endpoint de usuarios requieren autenticación y rol `GERENCIA`

### Consultar usuarios

`GET /usuarios`

### Consultar usuario por su id

`GET /usuarios/:id`

### Crear usuario

`POST /usuarios`

### Actualizar usuario

`PUT /usuarios/:id`

### Eliminar usuario

`DELETE /usuarios/:id`


# Validación

Se utiliza un `ValidationPipe` global para validar los datos recibidos.
Cuenta con:

* `whitelist` : elimina automáticamente las propiedades que no están definidas en el DTO.
* `forbidNonWhitelisted`: rechaza la solicitud si contiene propiedades no permitidas por el DTO.
* `transform`: transforma los datos recibidos al tipo definido en el DTO.

Los DTOs utilizan `class-validator` para validar los datos antes de procesarlos.

---

# Manejo de errores

Los errores conocidos de Prisma son transformados en respuestas HTTP mediante `PrismaExceptionFilter`.

Algunos ejemplos:

* `P2002` → `409 Conflict`: recurso duplicado.
* `P2025` → `404 Not Found`: recurso no encontrado.
* `P2003` → `409 Conflict`: conflicto con una relación existente.

Además, los servicios validan los recursos relacionados antes de realizar determinadas operaciones.

Por ejemplo, al crear una cita se verifica que el paciente y el médico existan.

---

# Logging

Se utiliza un `LoggingInterceptor` para registrar las solicitudes HTTP y su tiempo de ejecución.

Ejemplo:

```text
[HTTP] POST /citas — 12ms
```

---

# Base de datos

La aplicación utiliza PostgreSQL mediante Prisma ORM.

Las principales relaciones de la base de datos son:

* Paciente → Citas
* Médico → Citas
* Médico → Especialidad
* Médico → Usuario

Para visualizar los datos mediante Prisma Studio:

```bash
pnpm prisma studio
```

---

# Pruebas principales

Para comprobar el funcionamiento de la API se pueden realizar las siguientes pruebas:

### Login

Realizar:

```text
POST /auth/login
```

Comprobar que se obtenga un JWT válido.

### Crear cita con paciente inexistente

Enviar una cita utilizando un paciente que no exista.

Resultado esperado:

```text
404 Not Found
```

### Crear cita válida

Enviar un paciente y médico existentes junto con una fecha futura.

Resultado esperado:

```text
201 Created
```

### Crear cita con fecha pasada

Intentar crear una cita utilizando una fecha anterior a la actual.

Resultado esperado:

```text
400 Bad Request
```

### Probar autorización

Acceder a un endpoint utilizando un usuario cuyo rol no tenga permisos.

Resultado esperado:

```text
403 Forbidden
```

### Probar Swagger

Abrir:

```text
http://localhost:3000/api/docs
```

Comprobar los endpoints y utilizar **Authorize** para probar los recursos protegidos.

### Consultar expediente

Realizar:

```text
GET /pacientes/:CI/expediente
```

Comprobar que se devuelva el paciente junto con sus citas, médico y especialidad.
