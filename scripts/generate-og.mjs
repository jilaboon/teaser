import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Copy mask.png to scripts dir temporarily so the HTML can reference it
const maskSrc = path.join(__dirname, '..', 'public', 'mask.png');
const maskDst = path.join(__dirname, 'mask.png');
fs.copyFileSync(maskSrc, maskDst);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });

const htmlPath = path.join(__dirname, 'generate-og.html');
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

const outputPath = path.join(__dirname, '..', 'public', 'og-preview.png');
await page.screenshot({ path: outputPath, type: 'png' });

await browser.close();

// Clean up temp mask copy
fs.unlinkSync(maskDst);

console.log(`OG image saved to ${outputPath}`);
