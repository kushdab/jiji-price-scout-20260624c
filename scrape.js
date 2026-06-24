const puppeteer = require('puppeteer');
const fs = require('fs');
const Table = require('cli-table3');

const CONFIG = {
    categories: [
        { name: 'Phones', url: 'https://jiji.co.ke/mobile-phones' },
        { name: 'Cars', url: 'https://jiji.co.ke/cars' }
    ],
    outputPath: './prices.json',
    headless: 'new'
};

async function scrapeJiji() {
    console.log('--- Jiji Price Scout 2026 Initiated ---');
    const browser = await puppeteer.launch({
        headless: CONFIG.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
    });

    const allResults = {};

    try {
        for (const cat of CONFIG.categories) {
            console.log(`Scouting category: ${cat.name}...`);
            const page = await browser.newPage();
            
            // Set a realistic User-Agent
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            
            await page.goto(cat.url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Wait for product cards to load
            await page.waitForSelector('.b-list-advert-base', { timeout: 15000 });

            const items = await page.evaluate(() => {
                const cards = Array.from(document.querySelectorAll('.b-list-advert-base'));
                return cards.slice(0, 10).map(card => {
                    const title = card.querySelector('.qa-advert-title')?.innerText?.trim() || 'N/A';
                    const priceRaw = card.querySelector('.qa-advert-price')?.innerText?.trim() || '0';
                    const location = card.querySelector('.b-list-advert__region-item')?.innerText?.trim() || 'Unknown';
                    const link = card.querySelector('a.js-handle-click-visitor')?.href || '';
                    
                    // Clean price string (KSh 15,000 -> 15000)
                    const priceValue = parseInt(priceRaw.replace(/[^0-9]/g, ''), 10);

                    return {
                        title,
                        price: priceValue,
                        currency: 'KSh',
                        location,
                        link,
                        scrapedAt: new Date().toISOString()
                    };
                });
            });

            allResults[cat.name] = items;
            displayTable(cat.name, items);
            await page.close();
        }

        fs.writeFileSync(CONFIG.outputPath, JSON.stringify(allResults, null, 2));
        console.log(`\nData successfully saved to ${CONFIG.outputPath}`);

    } catch (error) {
        console.error('Scouting failed:', error.message);
    } finally {
        await browser.close();
        console.log('--- Scouting Session Finished ---');
    }
}

function displayTable(category, data) {
    const table = new Table({
        head: ['Item', 'Price (KSh)', 'Location'],
        colWidths: [40, 15, 20]
    });

    data.forEach(item => {
        table.push([item.title.substring(0, 38), item.price.toLocaleString(), item.location]);
    });

    console.log(`\nTop Results for ${category}:`);
    console.log(table.toString());
}

// Run the scout
scrapeJiji();