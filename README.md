# Demo de Playwright (Node.js)

Ejemplo sencillo que muestra para qué sirve **Playwright**: controlar un navegador real (Chromium) desde código.

## Qué hace
Una página web local (Express) recibe una URL. El servidor usa Playwright para:
1. Abrir la URL en un Chromium sin ventana (headless).
2. Extraer el título, el primer `<h1>` y los primeros 10 enlaces.
3. Tomar una captura de pantalla.

Luego la página muestra el resultado.

## Uso
```bash
npm install
npx playwright install chromium
npm start
```
Abre http://localhost:3001

## Archivos
- `server.js`: servidor Express y código de Playwright (`/api/scrape`).
- `public/index.html`: interfaz.
