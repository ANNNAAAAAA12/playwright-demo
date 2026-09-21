const express = require('express');
const path = require('path');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ejemplo de Playwright: abre una página, extrae datos y toma una captura.
app.post('/api/scrape', async (req, res) => {
  let url = (req.body.url || '').trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    const inicio = Date.now();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

    const titulo = await page.title();
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    const enlaces = await page.locator('a[href]').evaluateAll(els =>
      els.slice(0, 10).map(a => ({ texto: a.textContent.trim(), href: a.href }))
    );

    const captura = await page.screenshot(); // Buffer PNG
    const ms = Date.now() - inicio;

    res.json({
      url: page.url(),
      titulo,
      h1: h1 && h1.trim(),
      enlaces,
      ms,
      captura: captura.toString('base64'),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`App lista en http://localhost:${PORT}`);
});
