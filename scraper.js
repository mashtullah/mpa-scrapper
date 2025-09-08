const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeArticles(){ 
  try {
    const response = await axios.get('https://motoringpress.agency');
    const $= cheerio.load(response.data);

    const articles = [];

    $('article').each((_, el) => {
      const title =$(el).find('h2').text().trim();
      const summary = $(el).find('p').first().text().trim();
      const link =$(el).find('a').attr('href') || '';
	  
	  // ✅ Extract image from inside .post-image > a > img  document.querySelector("#post-4720 > div") #post-4720 > div
      const imageD =$(el).find('.lae-post-overlay ').css('background-image') || '';
	  const image=imageD.slice(4,-1);//replace(/^url\(['"](.+)['"]\)/, '$1');	

      articles.push({ title, summary, link, image });
    });

    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/articles.json', JSON.stringify(articles, null, 2));
    console.log('Scraped successfully.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Call the async function
scrapeArticles();
