/*
#-------------------------------------------------------------------------------
# Name:        scraper.js
# Purpose:     Grab a list of news articles from mpa website.
#
# Author:      David Musuda Alitsi a.k.a. ~Mashtullah~
#
# Created:     08-Aug-2025
# Copyright:   (c) Mashtullah 2025
# License:     [ Apache 2.0]
#-------------------------------------------------------------------------------
*/

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

console.log("Welcome to the Motoring Press Agency news articles scrapper...");
async function processArticles() {
  const articles = [];
  const response = await axios.get('https://motoringpress.agency');
  const $ = cheerio.load(response.data);  
  
  const articleElements = $('article').get();
  const totalArticles = articleElements.length;
  let completedCount = 0;
   // The total width of the progress bar
  const barWidth = 40;
  console.log(`Attemting to scrap ${totalArticles} articles from mpa website...\n`);
  
  
  // Use a map to create an array of promises for each article link
  const promises = $('article').get().map(el => {
    const link = $(el).find('a').attr('href') || '';    
    // Return a promise that resolves with the final article object
    return getArticleAsync(link).then(v => {
      const summary = v("meta[name='description']").attr('content')||'-';
      const title = v('title').text()||'-';
      const image = $(el).find('.lae-post-overlay').css('background-image').replace(/^url\(['"]?(.+?)['"]?\)/, '$1');
	  // Increment the counter and log the progress
      completedCount++;
      const progressPercentage = Math.round((completedCount / totalArticles) * 100);
	  const filledChars = Math.floor(progressPercentage / (100 / barWidth));
      const emptyChars = barWidth - filledChars;
	   // Create the progress bar string
      const progressBar = '[' + '#'.repeat(filledChars) + '.'.repeat(emptyChars) + ']';

      // Write the progress bar and percentage to the terminal
      process.stdout.write(`Progress: ${progressBar} ${progressPercentage}%\r`);	  
	  
      return { title, summary, link, image };
    });
  });

async function getArticleAsync(link) {
	const response = await axios.get(link);
	return cheerio.load(response.data);		  
}
  // Wait for all the promises to resolve
  const resolvedArticles = await Promise.all(promises);

  // Now the array is fully populated now write it to a JSON file
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync('data/articles.json', JSON.stringify(resolvedArticles, null, 2));
  console.log('\nDone getting the news articles list.');
}


processArticles();