# Gestor de Citas

Una aplicación moderna y completa para la gestión de citas con integración de Google Calendar, Firebase y autenticación de Google.

## Características

- 📅 **Vista de calendario mensual** para visualizar citas programadas
- ✏️ **Formulario completo** para crear, editar y eliminar citas
- 📋 **Lista de citas** con filtros y búsqueda
- 🔗 **Integración con Google Calendar** para sincronización automática
- 🔐 **Autenticación con Google** usando Firebase Auth
- 💾 **Base de datos Firestore** para almacenamiento seguro
- 🔔 **Sistema de notificaciones** para recordatorios
- 📱 **Diseño responsivo** optimizado para móvil y escritorio
- ✅ **Validación de formularios** y manejo de errores

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Auth + Firestore)
- **Integración**: Google Calendar API
- **Validación**: Zod, React Hook Form
- **Fechas**: date-fns
- **Iconos**: Lucide React

## Instalación

1. **Clona el repositorio**
\`\`\`bash
git clone <repository-url>
cd appointment-manager
\`\`\`

2. **Instala las dependencias**
\`\`\`bash
npm install
# o
yarn install
# o
pnpm install
\`\`\`

3. **Configura las variables de entorno**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Completa las variables de entorno con tus credenciales de Firebase y Google Calendar.

4. **Configura Firebase**
- Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
- Habilita Authentication y Firestore Database
- Configura Google como proveedor de autenticación
- Añade las credenciales a tu archivo `.env.local`

5. **Configura Google Calendar API**
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Habilita la Google Calendar API
- Crea credenciales OAuth 2.0
- Añade los dominios autorizados

6. **Ejecuta la aplicación**
\`\`\`bash
npm run dev
# o
yarn dev
# o
pnpm dev
\`\`\`

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   ├── appointment-calendar.tsx
│   ├── appointment-form.tsx
│   ├── appointment-list.tsx
│   ├── appointment-manager.tsx
│   ├── login-form.tsx
│   └── notification-center.tsx
├── lib/
│   ├── appointment-service.ts
│   ├── firebase.ts
│   └── google-calendar-service.ts
├── types/
│   └── appointment.ts
└── README.md
\`\`\`

## Funcionalidades Principales

### 🔐 Autenticación
- Inicio de sesión con Google
- Gestión automática de sesiones
- Protección de rutas

### 📅 Gestión de Citas
- Crear nuevas citas con validación completa
- Editar citas existentes
- Eliminar citas con confirmación
- Campos: nombre, email, teléfono, fecha, hora, notas

### 📊 Visualización
- Calendario mensual interactivo
- Lista filtrable y buscable
- Estados de citas (pasadas, hoy, próximas)
- Diseño responsivo

### 🔔 Notificaciones
- Recordatorios para citas del día
- Alertas para citas próximas
- Notificaciones una hora antes
- Centro de notificaciones

### 🔗 Integración Google Calendar
- Creación automática de eventos
- Sincronización bidireccional
- Invitaciones por email
- Gestión de zona horaria

## Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otros Proveedores
La aplicación es compatible con cualquier proveedor que soporte Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Configuración Adicional

### Firebase Security Rules
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appointments/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
\`\`\`

### Google Calendar Scopes
Asegúrate de incluir estos scopes en tu configuración OAuth:
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
