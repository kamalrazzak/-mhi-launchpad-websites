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

// Create root index that lists all pages (for development)
const indexHtml = `<!DOCTYPE html>
<html>
<head>
    <title>LP Deployer - MHI Media</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">LP Deployer</h1>
        <p class="text-gray-600 mb-8">MHI Media Landing Pages</p>
        <div class="bg-white rounded-lg shadow-sm divide-y">
            ${pageFiles.map(f => {
                const config = JSON.parse(fs.readFileSync(path.join(PAGES_DIR, f), 'utf8'));
                return `<a href="/${config.slug}/" class="block p-4 hover:bg-gray-50">
                    <div class="font-medium text-gray-900">${config.TITLE}</div>
                    <div class="text-sm text-gray-500">/${config.slug}/</div>
                </a>`;
            }).join('\n')}
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHtml);

console.log(`\n📦 Build complete! Output in ./dist/\n`);
console.log(`Run 'npm run deploy' to deploy to Netlify\n`);
