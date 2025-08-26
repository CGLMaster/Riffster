# 🎵 Riffster

<img src="/src/assets/img/riffter_logo.png" alt="Riffster Logo" width="50%" style="display: block; margin: auto; max-width: 400px;">


Riffster es una aplicación web de música construida sobre la [API de Spotify para Desarrolladores](https://developer.spotify.com/documentation/web-api), que permite a los usuarios disfrutar de su música favorita con una interfaz moderna y fluida.

## 🚀 Características

### Para todos los usuarios
- 🔍 Búsqueda avanzada de canciones, artistas, álbumes y playlists
- 📱 Interfaz responsive y moderna
- 📑 Visualización detallada de playlists y álbumes
- 👥 Exploración de perfiles de artistas
- 🎨 Diseño minimalista y elegante

### Para usuarios Premium de Spotify
- ▶️ Reproductor completo de música
- 🔊 Control total del volumen
- 🔄 Controles de reproducción (siguiente, anterior, repetir)
- 🎲 Modo aleatorio
- 📱 Sincronización con otros dispositivos

## 🛠️ Tecnologías Utilizadas

- **[Astro](https://astro.build/)**: Framework principal que ofrece un rendimiento excepcional mediante su arquitectura de islas
- **React**: Para componentes dinámicos y gestión del estado
- **Tailwind CSS**: Para el diseño y estilizado
- **Spotify Web Playback SDK**: Para la funcionalidad del reproductor
- **Axios**: Para las peticiones HTTP

## ⚙️ Características Técnicas

- 🔄 Sistema de refresco automático de tokens
- 🎮 Integración completa con el SDK de Spotify
- 🔐 Manejo seguro de autenticación
- 📦 Arquitectura de servicios centralizada
- 🌐 Enrutamiento dinámico
- 🎯 Optimización de rendimiento

## 🎯 Estado del Proyecto

Actualmente en fase beta, con las siguientes características planificadas:
- ❤️ Sistema de "Me gusta" para canciones
- 📊 Feedback visual mejorado
- ⚡ Optimizaciones de rendimiento
- 🔧 Mejoras en la gestión del estado del reproductor entre páginas
- 📱 Mejoras en la accesibilidad

## 💡 Motivación

Este proyecto surgió de la curiosidad por explorar nuevas APIs y, especialmente, por la oportunidad de experimentar con la API de una aplicación que uso diariamente. Spotify ofrece una libertad increíble para desarrolladores a través de su API, lo que me motivó a crear algo propio mientras aprendía. Elegí Astro por su enfoque innovador en el desarrollo web moderno, aunque enfrenté desafíos interesantes, especialmente en el manejo del estado del reproductor entre navegaciones debido a la naturaleza dinámica de la aplicación.

## 🎥 Demo: Riffster - Tu Música, Tu Experiencia

En este video demostración podrás ver las principales características de Riffster en acción:
- 🎵 Navegación fluida por tu biblioteca musical
- 🔍 Sistema de búsqueda en tiempo real
- ▶️ Reproductor completamente funcional (usuarios Premium)
- 📱 Interfaz responsive y moderna
- 🎨 Diseño minimalista inspirado en Spotify
- 🔄 Integración completa con la API de Spotify

[![Demo de Riffster](https://img.youtube.com/vi/2kbbo3K7GUk/0.jpg)](https://youtu.be/2kbbo3K7GUk)

## 🔧 Instalación y Configuración

### Configuración de la API de Spotify

1. Ve al [Dashboard de Spotify para Desarrolladores](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Crea una nueva aplicación:
   - Click en "Create App"
   - Rellena el formulario con:
     - Nombre de la aplicación
     - Descripción
     - URL de redirección (ejemplo: `http://localhost:4321` para desarrollo)
4. Una vez creada, accede a la configuración de la app para obtener:
   - Client ID
   - Client Secret
   - Configura las URLs permitidas en "Redirect URIs"
   - Indicar en User Management si quieres dar acceso a otra cuenta de spotify a la API

### Instalación del Proyecto

1. Clona el repositorio
```bash
git clone https://github.com/CGLMaster/Riffster.git
```

2. Instala las dependencias
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales de Spotify:
```env
PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id_del_dashboard
PUBLIC_SPOTIFY_CLIENT_SECRET=tu_client_secret_del_dashboard
```

4. Inicia el servidor de desarrollo
```bash
npm run dev
```

*Nota: Asegúrate de nunca compartir o commitear tus tokens de Spotify. El archivo `.env` está incluido en `.gitignore` por seguridad.*

## 🤝 Contribuciones

¿Tienes ideas para mejorar Riffster? Las contribuciones son bienvenidas. Por favor, abre un [issue](https://github.com/CGLMaster/Riffster/issues) o envía un [pull request](https://github.com/CGLMaster/Riffster/pulls) en GitHub para discutir los cambios que te gustaría realizar.

---

*Nota: Este proyecto no está afiliado oficialmente con Spotify. Es un proyecto personal creado con fines educativos y de aprendizaje.*
