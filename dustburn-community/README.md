# 🔥 DUSTBURN - Portal Oficial de la Comunidad "Burners" (Left 4 Dead 2)

¡Bienvenido al portal web oficial de **Dustburn** y su comunidad **"Burners"** en **Kick**!

---

## 🌟 Características Principales

1. **🔥 Estilo Visual Apocalipsis L4D2 & Fuego:**
   - Canvas interactivo de chispas, brasas y cenizas flotantes en tiempo real.
   - Logo oficial de Dustburn con efecto de aura llameante pulsante.
   - Paleta de colores temáticos (Fuego, sangre L4D2 y el verde neón de Kick).

2. **🎶 Reproductor de Música Oficial con Ecualizador de Fuego:**
   - Reproductor flotante integrado en la parte inferior con la música de fondo solicitada (`assets/dustburn_theme.mp3`).
   - Ecualizador visual interactivo de barras llameantes.
   - Controles de Play/Pause, barra de tiempo scrubbable y control de volumen.

3. **🎮 Sistema de Salas de Partida & Lista de Espera (Matchmaking):**
   - Lobbies interactivos para **Versus (4 vs 4 - 8 slots)**, **Campaña Co-op (4 slots)** y **Supervivencia**.
   - Cada jugador puede ocupar un slot disponible con su nombre y rol.
   - **Cola de Espera (Banca):** Si una partida está llena, los espectadores pueden anotarse en la banca; si alguien se desconecta, el siguiente en cola toma su lugar.
   - **Sorteo Aleatorio de Equipos:** Botón para balancear y sortear los equipos de Supervivientes vs Infectados para el directo.
   - **Copiar Alineación a Kick:** Genera el texto formateado con los integrantes para pegarlo directamente en el chat de Kick.
   - **Copiar IP / Comando de Conexión:** Botón de un solo clic para copiar `connect <ip>` y pegarlo en la consola de L4D2.
   - Creación de nuevas salas mediante modal interactivo.

4. **👥 Registro de Miembros "Burners":**
   - Formulario de inscripción para que todos los seguidores se registren.
   - Campos: Gamertag, Steam ID / Perfil, Discord, Rol favorito (Puntero, Francotirador, Soporte, Hunter/Tank), Personaje favorito de L4D2, Horas de juego, Rango en Kick y Lema de combate.
   - Directorio de miembros con búsqueda en vivo y filtros por rol.
   - **Exportar en CSV:** Permite a los moderadores y a Dustburn descargar la lista completa de miembros registrados en formato Excel/CSV.
   - Almacenamiento local automático en `localStorage`.

5. **📺 Enlace y Reproductor Oficial de Kick:**
   - Enlace directo a `https://kick.com/dustburnn`.
   - Embed de transmisión en vivo de Kick con reglas de comunidad y horarios.
   - Enlaces directos a TikTok (`@dustburnn`) y YouTube (`@dustburnn-99`).

6. **🎯 Ruleta de Retos & Castigos de Stream:**
   - Ruleta animada en Canvas para definir desafíos en vivo (ej. *Solo pistolas*, *Cero botiquines*, *Dustburn de frente con escopeta*, *El primero en caer regala 1 sub*).
   - Efectos sonoros de celebración y animación al ganar.

7. **🔊 Soundboard Sintetizado L4D2 (Web Audio API):**
   - 8 efectos de audio icónicos sin dependencias externas:
     - 💣 Bomba Casera (beeps acelerados + explosión)
     - 💪 Música de alerta de Tank
     - 😭 Llanto de Witch
     - 👹 Grito y pounce de Hunter
     - 🧟 Sirena de Horda zombie
     - 🔫 Escopetazo L4D2 y recarga
     - 💊 "¡Pills Here!" (campanada de pastillas)
     - 🚪 Fanfarria de victoria de refugio

---

## 🚀 Cómo Abrir la Página

### Opción 1: Abrir Directamente en el Navegador
1. Dirígete a la carpeta del proyecto:
   `C:\Users\franc\.gemini\antigravity\scratch\dustburn-community\`
2. Haz doble clic en el archivo **`index.html`**.
3. ¡Se abrirá inmediatamente en Google Chrome, Microsoft Edge, Opera o tu navegador preferido!

### Opción 2: Subir a Internet Gratis (Para compartir con toda la comunidad)
Puedes subir esta carpeta completa a cualquiera de estas plataformas gratuitas en menos de 2 minutos:
- **Netlify Drop:** Arrastra la carpeta `dustburn-community` en [app.netlify.com/drop](https://app.netlify.com/drop) y tendrás un link web activo al instante.
- **Vercel:** Sube la carpeta a [vercel.com](https://vercel.com).
- **GitHub Pages:** Sube los archivos a un repositorio de GitHub y activa GitHub Pages.

---

## 📁 Estructura de Archivos

```
dustburn-community/
├── assets/
│   ├── dustburn_logo.webp   # Logo oficial del canal
│   └── dustburn_theme.mp3   # Música oficial de fondo
├── css/
│   └── style.css            # Estilos L4D2, fuego, neón Kick y responsive
├── js/
│   ├── app.js               # Coordinador principal, modales y notificaciones
│   ├── audio-player.js      # Reproductor flotante y ecualizador
│   ├── community.js         # Registro, padrón de Burners y exportación CSV
│   ├── lobbies.js           # Salas de Versus, slots y cola de espera
│   ├── particles.js         # Canvas de chispas y fuego animado
│   ├── roulette.js          # Ruleta interactiva de retos para el stream
│   └── soundboard.js        # Sonidos sintetizados de Left 4 Dead 2
├── index.html               # Página web principal completa
└── README.md                # Guía de uso
```
