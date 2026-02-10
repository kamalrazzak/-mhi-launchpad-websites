#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const PAGES_DIR = path.join(__dirname, 'pages');
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Get all page configs
const pageFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'));

console.log(`\n🚀 LP Deployer - Building ${pageFiles.length} landing page(s)...\n`);

pageFiles.forEach(pageFile => {
    const config = JSON.parse(fs.readFileSync(path.join(PAGES_DIR, pageFile), 'utf8'));
    const templateName = config.template || 'lead-magnet';
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);

    if (!fs.existsSync(templatePath)) {
        console.error(`❌ Template not found: ${templateName}`);
        return;
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace all {{PLACEHOLDER}} with config values
    Object.keys(config).forEach(key => {
        const placeholder = `{{${key}}}`;
        html = html.split(placeholder).join(config[key]);
    });

    // Create page directory
    const pageDir = path.join(DIST_DIR, config.slug);
    if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
    }

    // Write the built HTML
    const outputPath = path.join(pageDir, 'index.html');
    fs.writeFileSync(outputPath, html);

    console.log(`✅ Built: /${config.slug}/`);
});

// Use homepage template for root index
const homepageTemplate = path.join(TEMPLATES_DIR, 'homepage.html');
if (fs.existsSync(homepageTemplate)) {
    const homepageHtml = fs.readFileSync(homepageTemplate, 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homepageHtml);
    console.log(`✅ Built: / (homepage)`);
} else {
    console.log(`⚠️ No homepage template found`);
}

console.log(`\n📦 Build complete! Output in ./dist/\n`);
console.log(`Run 'npm run deploy' to deploy to Netlify\n`);
