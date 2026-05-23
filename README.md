# BarberBook 💈

Sistema web moderno para la gestión y reserva de citas en barberías, desarrollado con tecnologías actuales del ecosistema JavaScript. BarberBook permite a los clientes reservar citas de manera rápida, organizada e intuitiva, mientras que los administradores pueden gestionar citas, servicios y barberos desde un panel administrativo completo.

---

# 🚀 Proyecto Desplegado

🔗 https://barberbook-zeta.vercel.app/

---

# 📂 Repositorio GitHub

🔗 https://github.com/MauroC18/Barberbook.git

---

# 📖 Descripción del Proyecto

BarberBook nace como una solución tecnológica para modernizar la gestión de citas en barberías independientes. Muchas barberías aún utilizan métodos manuales como llamadas telefónicas o mensajes de WhatsApp para organizar reservas, generando desorden, conflictos de horarios y pérdida de clientes.

La plataforma permite:

- Consultar servicios disponibles.
- Seleccionar barbero.
- Ver disponibilidad en tiempo real.
- Reservar citas mediante un flujo guiado.
- Gestionar citas desde un panel administrativo.
- Organizar horarios y disponibilidad.

El proyecto fue desarrollado bajo una arquitectura fullstack moderna utilizando React, APIs Serverless, Prisma ORM y PostgreSQL.

---

# 🛠 Tecnologías Utilizadas

## Frontend
- React
- Vite
- React Router DOM
- CSS Responsivo
- JavaScript ES6+

## Backend
- Node.js
- APIs Serverless

## Base de Datos
- PostgreSQL
- Prisma ORM
- Supabase

## Despliegue y Herramientas
- Vercel
- GitHub
- Visual Studio Code
- ESLint

---

# ✨ Funcionalidades Principales

## Vista Cliente

- Visualización dinámica de servicios.
- Selección de barbero.
- Consulta de horarios disponibles.
- Flujo guiado de agendamiento.
- Generación de código único de confirmación.
- Cancelación de citas mediante código.
- Diseño responsivo para móviles y escritorio.

## Vista Administrador

- Panel administrativo protegido.
- Gestión de citas.
- Gestión de estados de citas.
- Calendario visual interactivo.
- CRUD de barberos.
- CRUD de servicios.
- Historial de citas.

---

# 🏗 Arquitectura del Proyecto

El proyecto fue desarrollado bajo una arquitectura cliente-servidor moderna.

## Frontend

Aplicación SPA desarrollada con React y Vite utilizando componentes reutilizables y navegación dinámica.

## Backend

APIs Serverless desplegadas en Vercel encargadas de manejar la lógica de negocio y la comunicación con la base de datos.

## Base de Datos

Prisma ORM conectado a PostgreSQL alojado en Supabase.

---

# 📁 Estructura del Proyecto

```bash
Barberbook/
│
├── api/
│   ├── _lib/
│   │   └── prisma.js
│   │
│   ├── barberos/
│   │   └── [id].js
│   │
│   ├── citas/
│   │   ├── cancelar/
│   │   │   └── [codigo].js
│   │   ├── [id].js
│   │   └── disponibilidad.js
│   │
│   ├── servicios/
│   │   └── [id].js
│   │
│   ├── auth.js
│   ├── barberos.js
│   ├── citas.js
│   └── servicios.js
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── Barberbook/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── vercel.json
```

---

# 🧩 Organización del Backend

El backend fue desarrollado mediante APIs Serverless organizadas por módulos funcionales.

| Archivo / Ruta | Función |
|---|---|
| `auth.js` | Autenticación de administrador |
| `barberos.js` | Listado y gestión de barberos |
| `servicios.js` | Gestión de servicios |
| `citas.js` | Creación y consulta de citas |
| `citas/disponibilidad.js` | Consulta de horarios disponibles |
| `citas/cancelar/[codigo].js` | Cancelación de citas mediante código |
| `[id].js` | Actualización y eliminación de registros |
| `_lib/prisma.js` | Conexión singleton de Prisma ORM |

---

# ⚙️ Instalación y Ejecución Local

## 1. Clonar repositorio

```bash
git clone https://github.com/MauroC18/Barberbook.git
```

## 2. Entrar al proyecto

```bash
cd Barberbook
```

## 3. Instalar dependencias

### Dependencias raíz

```bash
npm install
```

### Frontend

```bash
cd Barberbook
npm install
```

---

# 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:password@host:5432/barberbook"
```

---

# 🗄 Configuración de Prisma

## Generar cliente Prisma

```bash
npx prisma generate
```

## Ejecutar migraciones

```bash
npx prisma migrate dev
```

## Poblar base de datos (opcional)

```bash
npx ts-node prisma/seed.ts
```

---

# ▶️ Ejecutar Proyecto

## Frontend

```bash
npm run dev
```

## Entorno completo recomendado

```bash
vercel dev
```

---

# 🔐 Acceso Administrador

## Credenciales de prueba

```txt
Usuario: admin
Contraseña: admin123
```

> Reemplazar según las credenciales configuradas en producción.

---

# 📋 Requerimientos Funcionales

- Gestión de citas.
- Gestión de servicios.
- Gestión de barberos.
- Panel administrativo.
- Protección de rutas.
- Disponibilidad en tiempo real.
- Historial de citas.
- Validación de conflictos de horarios.

---

# 📈 Calidad del Código

El proyecto fue desarrollado aplicando buenas prácticas de programación:

- Arquitectura modular.
- Componentes reutilizables.
- Separación de responsabilidades.
- Código mantenible y escalable.
- Validaciones en frontend y backend.
- Uso de ESLint.
- Integración mediante APIs REST.

---

# ☁️ Despliegue

El sistema fue desplegado utilizando Vercel integrando frontend, backend serverless y base de datos cloud.

---

# 📌 Estado del Proyecto

- ✅ Proyecto funcional
- ✅ Repositorio público
- ✅ Despliegue en producción
- ✅ Documentación técnica finalizada

---

# 👨‍💻 Autor

**Mauricio Carrillo**  
Universidad de La Costa – CUC  
Barranquilla, Colombia

---

# 📄 Licencia

Proyecto académico.
