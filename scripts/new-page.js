#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PAGES_DIR = path.join(__dirname, '..', 'pages');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (question) => new Promise(resolve => rl.question(question, resolve));

async function main() {
    console.log('\n🚀 LP Deployer - Create New Landing Page\n');

    const slug = await ask('Page slug (e.g., "dtc-playbook"): ');
    const title = await ask('Page title: ');
    const headline = await ask('Main headline: ');
    const subheadline = await ask('Subheadline: ');
    const ctaText = await ask('CTA button text (default: "Get Free Access"): ') || 'Get Free Access';
    const beehiivId = await ask('Beehiiv Publication ID: ');

    const config = {
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        template: 'lead-magnet',
        BEEHIIV_PUBLICATION_ID: beehiivId,
        TITLE: title,
        DESCRIPTION: subheadline,
        BADGE_TEXT: 'Free Download',
        HEADLINE: headline,
        SUBHEADLINE: subheadline,
        CTA_TEXT: ctaText,
        PRIVACY_TEXT: 'No spam. Unsubscribe anytime.',
        STAT_1_NUMBER: '100%+',
        STAT_1_LABEL: 'Avg ROAS Lift',
        STAT_2_NUMBER: '50+',
        STAT_2_LABEL: 'Brands Helped',
        STAT_3_NUMBER: '500+',
        STAT_3_LABEL: 'Creatives Tested',
        BENEFITS_INTRO: 'Everything you need to level up your DTC marketing.',
        BENEFIT_1_TITLE: 'Proven Framework',
        BENEFIT_1_DESC: 'Battle-tested strategies from real DTC campaigns.',
        BENEFIT_2_TITLE: 'Actionable Steps',
        BENEFIT_2_DESC: 'Clear action items you can implement immediately.',
        BENEFIT_3_TITLE: 'Real Results',
        BENEFIT_3_DESC: 'Based on data from 50+ DTC brand partnerships.'
    };

    const filePath = path.join(PAGES_DIR, `${config.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

    console.log(`\n✅ Created: pages/${config.slug}.json`);
    console.log(`\nNext steps:`);
    console.log(`  1. Edit pages/${config.slug}.json to customize content`);
    console.log(`  2. Run 'npm run build' to generate the page`);
    console.log(`  3. Run 'npm run deploy' to publish to Netlify\n`);

    rl.close();
}

main().catch(console.error);
