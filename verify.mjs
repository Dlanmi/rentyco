import { chromium } from 'playwright';

const BASE = 'http://localhost:4321';
const pages = [
  { path: '/', name: 'home' },
  { path: '/arrendadores', name: 'arrendadores' },
  { path: '/inquilinos', name: 'inquilinos' },
  { path: '/blog', name: 'blog' },
  { path: '/nosotros', name: 'nosotros' },
  { path: '/lista-de-espera', name: 'lista-de-espera' },
  { path: '/como-funciona', name: 'como-funciona' },
  { path: '/renty-score', name: 'renty-score' },
];

const results = { errors: [], warnings: [], hidden: [], interactions: {} };

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

for (const { path, name } of pages) {
  const page = await context.newPage();
  const pageErrors = [];
  const pageWarnings = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') pageErrors.push(text);
    if (msg.type() === 'warning' && (text.includes('GSAP') || text.includes('gsap') || text.includes('ScrollTrigger'))) {
      pageWarnings.push(text);
    }
  });
  page.on('pageerror', (err) => pageErrors.push('PAGE ERROR: ' + err.message));

  console.log(`\n=== ${name} (${path}) ===`);

  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    console.log(`  ✗ Failed to load: ${e.message}`);
    results.errors.push({ page: name, error: e.message });
    await page.close();
    continue;
  }

  // Wait for animations to settle
  await page.waitForTimeout(1500);

  // Check for elements stuck at opacity:0 (animations failed to fire)
  const hiddenElements = await page.evaluate(() => {
    const stuck = [];
    document.querySelectorAll('*').forEach((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      // Only flag elements that are in viewport and stuck hidden
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0 && rect.height > 0;
      if (inViewport && parseFloat(style.opacity) < 0.05) {
        // Skip utility-hidden stuff
        const classes = el.className || '';
        const tag = el.tagName.toLowerCase();
        const classStr = typeof classes === 'string' ? classes : classes.baseVal || '';
        if (classStr.includes('hidden') || classStr.includes('sr-only') || style.display === 'none') return;
        // Skip filter/mask defs
        if (['filter', 'fegaussianblur', 'fecolormatrix', 'femerge', 'femergenode', 'defs'].includes(tag)) return;
        stuck.push({
          tag,
          classes: classStr.toString().slice(0, 60),
          text: (el.textContent || '').trim().slice(0, 40),
        });
      }
    });
    return stuck.slice(0, 10);
  });

  // Scroll through the page to trigger animations
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), (totalHeight * i) / steps);
    await page.waitForTimeout(200);
  }
  // Wait for final stagger animations to fully complete
  await page.waitForTimeout(1500);

  // Check again after scroll
  const hiddenAfterScroll = await page.evaluate(() => {
    const stuck = [];
    document.querySelectorAll('[data-reveal], [data-stat-card], [data-landlord-card], [data-blog-card], [data-faq-item], [data-step-card], [data-compare-old], [data-compare-new], [data-about-stat], [data-about-value], [data-waitlist-benefit], [data-waitlist-milestone], [data-pain-card], [data-solution-card], [data-journey-step], [data-footer-col]').forEach((el) => {
      const style = window.getComputedStyle(el);
      if (parseFloat(style.opacity) < 0.05) {
        stuck.push({
          tag: el.tagName.toLowerCase(),
          classes: (typeof el.className === 'string' ? el.className : el.className.baseVal || '').slice(0, 40),
          text: (el.textContent || '').trim().slice(0, 30),
        });
      }
    });
    return stuck;
  });

  console.log(`  Console errors: ${pageErrors.length}`);
  pageErrors.forEach((e) => console.log(`    ✗ ${e.slice(0, 200)}`));
  console.log(`  GSAP warnings: ${pageWarnings.length}`);
  pageWarnings.forEach((w) => console.log(`    ⚠ ${w.slice(0, 200)}`));
  console.log(`  Hidden after scroll: ${hiddenAfterScroll.length}`);
  hiddenAfterScroll.slice(0, 5).forEach((h) => console.log(`    • ${h.tag}.${h.classes} — "${h.text}"`));

  results.errors.push(...pageErrors.map((e) => ({ page: name, error: e })));
  results.warnings.push(...pageWarnings.map((w) => ({ page: name, warning: w })));
  results.hidden.push(...hiddenAfterScroll.map((h) => ({ page: name, ...h })));

  await page.close();
}

// Test Score interaction
console.log('\n=== Score interaction test ===');
const scorePage = await context.newPage();
await scorePage.goto(BASE + '/', { waitUntil: 'networkidle' });
await scorePage.waitForTimeout(1500);
await scorePage.locator('#renty-score').scrollIntoViewIfNeeded();
await scorePage.waitForTimeout(2000);

const pillCount = await scorePage.locator('[data-factor-pill]').count();
console.log(`  Factor pills found: ${pillCount}`);
if (pillCount > 0) {
  await scorePage.locator('[data-factor-pill="0"]').click();
  await scorePage.waitForTimeout(400);
  const detailOpen = await scorePage.evaluate(() => {
    const d = document.querySelector('[data-factor-detail]');
    return d ? parseFloat(window.getComputedStyle(d).opacity) > 0.5 : false;
  });
  console.log(`  Detail card opens on pill click: ${detailOpen ? '✓' : '✗'}`);
  results.interactions.scorePill = detailOpen;
}
await scorePage.close();

// Test navbar links context-awareness
console.log('\n=== Navbar links test ===');
const navTestPage = await context.newPage();
await navTestPage.goto(BASE + '/blog', { waitUntil: 'networkidle' });
const navLinks = await navTestPage.evaluate(() => {
  const links = [];
  document.querySelectorAll('[data-navbar] a[href]').forEach((a) => {
    links.push({ text: a.textContent.trim(), href: a.getAttribute('href') });
  });
  return links;
});
console.log('  Navbar links on /blog:');
navLinks.forEach((l) => console.log(`    "${l.text}" → ${l.href}`));
await navTestPage.close();

// Test waitlist form
console.log('\n=== Waitlist form test ===');
const formPage = await context.newPage();
await formPage.goto(BASE + '/', { waitUntil: 'networkidle' });
await formPage.locator('#waitlist').scrollIntoViewIfNeeded();
await formPage.waitForTimeout(500);
const tabsCount = await formPage.locator('.waitlist-tab').count();
console.log(`  Waitlist tabs: ${tabsCount}`);
if (tabsCount >= 2) {
  await formPage.locator('[data-tab="arrendador"]').click();
  await formPage.waitForTimeout(300);
  const arrendadorVisible = await formPage.evaluate(() => {
    const el = document.querySelector('[data-field-arrendador]');
    return el ? !el.classList.contains('hidden') : false;
  });
  console.log(`  Tab switch to arrendador: ${arrendadorVisible ? '✓' : '✗'}`);
  results.interactions.waitlistTab = arrendadorVisible;
}
await formPage.close();

await browser.close();

console.log('\n\n=== SUMMARY ===');
console.log(`Total errors: ${results.errors.length}`);
console.log(`Total GSAP warnings: ${results.warnings.length}`);
console.log(`Total hidden elements: ${results.hidden.length}`);
console.log(`Interactions:`, results.interactions);

if (results.errors.length || results.warnings.length || results.hidden.length) {
  process.exit(1);
}
