# Studify API

Backend de **Studify**, una aplicación web para estudiantes que organiza tareas, materias, apuntes, exámenes y sesiones de estudio. Está desarrollado con **NestJS** y **Prisma**, y se encarga de gestionar las peticiones que llegan desde el frontend (React) y de guardar y consultar los datos en una base MySQL.

- **Frontend:** https://github.com/FrancoTms/Studify-N2
- **Repositorio del backend:** https://github.com/FrancoTms/Studify-Backend

## Estado del proyecto

| Etapa | Estado |
| --- | --- |
| Creación del proyecto con Nest CLI | Hecho |
| Organización en módulos (`src/modules`) | Hecho |
| Recursos REST con CRUD generados por módulo | Hecho |
| DTOs con validación de datos | Hecho |
| Diseño de la base de datos relacional | Hecho |
| Conexión con la base de datos mediante Prisma y migración inicial | Hecho |
| Services con Prisma Client | Hecho |
| Autenticación con token (JWT) y protección de rutas | Pendiente |

## Tecnologías

- [NestJS](https://nestjs.com/) y [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/) 7, con el adaptador de MySQL/MariaDB
- MySQL
- [class-validator](https://github.com/typestack/class-validator) y [class-transformer](https://github.com/typestack/class-transformer) para validar los DTOs
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) para proteger las contraseñas
- Git y GitHub

## Requisitos previos

- Node.js (versión LTS recomendada) y npm
- Git
- MySQL en funcionamiento y un gestor como MySQL Workbench o XAMPP
- Opcional: Nest CLI global (`npm install -g @nestjs/cli`) para generar nuevos recursos

## Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/FrancoTms/Studify-Backend.git
   cd Studify-Backend
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear en MySQL una base de datos **vacía** (por ejemplo, `studify_api`).

4. Crear el archivo `.env` a partir de `.env.example` y completar la conexión:

   ```env
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/studify_api"
   ```

   Si la contraseña tiene caracteres especiales, deben codificarse en la URL (por ejemplo, `@` se escribe `%40`). El archivo `.env` no se sube al repositorio.

5. Generar el cliente de Prisma y crear las tablas:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

6. (Opcional) Cargar datos de ejemplo ejecutando `prisma/seed.sql` sobre la base creada.

7. Iniciar el servidor en modo desarrollo:

   ```bash
   npm run start:dev
   ```

8. Verificar que funciona abriendo `http://localhost:3000`.

### Comandos

| Comando | Descripción |
| --- | --- |
| `npm run start:dev` | Inicia el servidor en modo desarrollo |
| `npm run build` | Compila el proyecto en la carpeta `dist/` |
| `npm run start:prod` | Ejecuta la versión compilada |
| `npx prisma validate` | Valida el esquema de Prisma |
| `npx prisma generate` | Genera el cliente de Prisma |
| `npx prisma migrate dev --name <nombre>` | Crea y aplica una migración |

## Estructura del proyecto

```
├── prisma/
│   ├── schema.prisma       # Modelos de la base de datos
│   └── migrations/         # Historial de migraciones
├── prisma.config.ts        # Configuración de Prisma
├── .env.example            # Ejemplo de variables de entorno
└── src/
    ├── main.ts
    └── modules/
        ├── app/            # Módulo raíz
        ├── prisma/         # PrismaModule y PrismaService (conexión a la base)
        ├── users/          # Cada recurso incluye dto/, entities/,
        ├── auth/           # controller, module y service
        ├── subjects/
        ├── notes/
        ├── exams/
        ├── tasks/
        └── study-sessions/
```

## Flujo de una solicitud

| Paso | Qué ocurre | Dónde |
| --- | --- | --- |
| 1 | El DTO valida los datos recibidos | `dto/create-*.dto.ts` y `ValidationPipe` global |
| 2 | El controller recibe la solicitud y llama al service | `*.controller.ts` |
| 3 | El service usa Prisma Client para consultar o modificar la base | `*.service.ts` |
| 4 | La API devuelve el resultado | Respuesta HTTP en formato JSON |

El `ValidationPipe` está configurado con `whitelist`, `forbidNonWhitelisted` y `transform`: descarta o rechaza los campos que el DTO no declara y convierte el cuerpo en una instancia del DTO.

## Módulos

| Módulo | Responsabilidad | Sección del frontend |
| --- | --- | --- |
| `users` | Datos de los usuarios | Perfil del sidebar |
| `auth` | Inicio de sesión | Pantalla de login |
| `subjects` | Materias y su progreso | Mis materias |
| `notes` | Apuntes de cada materia | Mis apuntes |
| `exams` | Fechas de exámenes | Próximos exámenes |
| `tasks` | Tareas con prioridad y estado | Plan de hoy |
| `study-sessions` | Sesiones de estudio y su duración | Pomodoro y horas estudiadas |

### Endpoints

Cada módulo (excepto `auth`) expone un CRUD REST. Por ejemplo, para `users`:

| Método | Ruta | Acción | Respuesta |
| --- | --- | --- | --- |
| `POST` | `/users` | Crear | 201 |
| `GET` | `/users` | Listar | 200 |
| `GET` | `/users/:id` | Obtener uno | 200 o 404 |
| `PATCH` | `/users/:id` | Actualizar | 200 o 404 |
| `DELETE` | `/users/:id` | Eliminar | 200 o 404 |

Los demás módulos siguen el mismo patrón (`/subjects`, `/notes`, `/exams`, `/tasks`, `/study-sessions`). El módulo `auth` expone `POST /auth/login`, que valida el correo y la contraseña contra la tabla `users`.

### Respuestas de error

| Código | Cuándo ocurre |
| --- | --- |
| 400 | Los datos no pasan la validación, o se referencia un usuario o materia que no existe |
| 401 | Correo o contraseña incorrectos en el login |
| 404 | El registro solicitado no existe |
| 409 | Ya existe un registro con ese dato único (por ejemplo, el correo de un usuario) |

## Base de datos

El esquema se define en `prisma/schema.prisma` y las tablas se crean con las migraciones de `prisma/migrations/`. La base debe estar vacía antes de la primera migración.

### Tablas y relaciones

| Tabla | Descripción | Clave foránea |
| --- | --- | --- |
| `users` | Usuarios del sistema | |
| `subjects` | Materias de cada usuario | `user_id` → `users` |
| `notes` | Apuntes de cada materia | `subject_id` → `subjects` |
| `exams` | Exámenes de cada materia | `subject_id` → `subjects` |
| `tasks` | Tareas del usuario, con materia opcional | `user_id` → `users`, `subject_id` → `subjects` |
| `study_sessions` | Sesiones de estudio | `user_id` → `users`, `subject_id` → `subjects` |

```mermaid
erDiagram
  USERS ||--o{ SUBJECTS : tiene
  USERS ||--o{ TASKS : crea
  USERS ||--o{ STUDY_SESSIONS : realiza
  SUBJECTS ||--o{ NOTES : contiene
  SUBJECTS ||--o{ EXAMS : tiene
  SUBJECTS |o--o{ TASKS : "se asocia"
  SUBJECTS ||--o{ STUDY_SESSIONS : "se estudia en"
```

### Restricciones principales

- `users.email` es único y las contraseñas se guardan con hash (bcrypt), nunca en texto plano.
- `subjects.progress` debe estar entre 0 y 100, y el nombre de la materia es único por usuario.
- `study_sessions.duration_minutes` debe estar entre 1 y 600.
- Al borrar un usuario o una materia se eliminan sus datos dependientes. En `tasks`, si se borra la materia, la tarea queda sin materia.

Los rangos se controlan en los DTOs, ya que Prisma no define restricciones `CHECK` en el esquema.

## Flujo de trabajo

El trabajo se integra mediante ramas y Pull Requests. Los mensajes de commit siguen el formato `tipo: descripción` (por ejemplo, `feat: implementa los services con Prisma Client`).

## Integrantes

- Garcia, Franco Tomas
- Busnelli, Bruno