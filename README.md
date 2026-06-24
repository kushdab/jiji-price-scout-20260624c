# Jiji Price Scout 20260624c

A professional Node.js web scraper designed to track and compare prices of electronics and vehicles on the Jiji Kenya marketplace. 

## Features
- Scrapes the latest listings from Mobile Phones and Cars categories.
- Extracts title, price, location, and product links.
- Cleans price data for easy mathematical comparison.
- Outputs data to a formatted CLI table and a `prices.json` file.
- Headless browser automation using Puppeteer.

## Installation
1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Clone or download this project.
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
Run the scraper using the following command:
```bash
npm start
```

## Configuration
You can modify the `CONFIG` object in `scrape.js` to add more categories or change the output file destination.

## Disclaimer
This tool is for educational purposes only. Always respect the robots.txt file and Terms of Service of the website being scraped.