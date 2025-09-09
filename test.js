const axios = require('axios');
const cheerio = require('cheerio');

async function test(){ 
  const response = await axios.get('https://motoringpress.agency');
  const $ = cheerio.load(response.data);
  console.log($('title').text()); // Just print the page title to test
  const articles = [];
    $('article').each((_, el) => {      
      const link =$(el).find('a').attr('href') || '';	  
	  // ✅ Extract image from inside .post-image > a > img  document.querySelector("#post-4720 > div") #post-4720 > div
      const imageD =$(el).find('.lae-post-overlay ').css('background-image') || '';
	  const image=imageD.slice(4,-1);//replace(/^url\(['"](.+)['"]\)/, '$1');	
	  
		  
		
		getStringAsync(link).then(v => {
			let summary=v("meta[name='description']").attr('content');
			let title=v('title').text();
		  //console.log(metaDescription); // Output: Another asynchronous string.
		  articles.push({ title, summary, link, image });
		});
      
    });
	console.log(articles);
    //fs.mkdirSync('data', { recursive: true });
    //fs.writeFileSync('data/articles.json', JSON.stringify(articles, null, 2));
    console.log('Scraped successfully.');
}

//test();// https://motoringpress.agency/is-that-a-trailer/
/*
getStringAsync("https://motoringpress.agency/is-that-a-trailer/").then(v => {
			var metaDescription = v("meta[name='description']").attr('content');
			summary=metaDescription;
		  console.log(v('title').text()); // Output: Another asynchronous string.
		  console.log(metaDescription); 
		});
*/
async function getStringAsync(link) {
	const response = await axios.get(link);
	return cheerio.load(response.data);		  
}

async function processArticles() {
  const articles = [];
  const response = await axios.get('https://motoringpress.agency');
  const $ = cheerio.load(response.data);
  
  // Use a map to create an array of promises for each article link
  const promises = $('article').get().map(el => {
    const link = $(el).find('a').attr('href') || '';
    
    // Return a promise that resolves with the final article object
    return getStringAsync(link).then(v => {
      const summary = v("meta[name='description']").attr('content')||'-';
      const title = v('title').text()||'-';
      const image = $(el).find('.lae-post-overlay').css('background-image').replace(/^url\(['"]?(.+?)['"]?\)/, '$1');

      return { title, summary, link, image };
    });
  });

  // Wait for all the promises to resolve
  const resolvedArticles = await Promise.all(promises);

  // Now the array is fully populated
  console.log(resolvedArticles);
  console.log('Done.');
}

// Call the async function to start the process
processArticles();


