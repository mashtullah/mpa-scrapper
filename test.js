const axios = require('axios');
const cheerio = require('cheerio');

async function test(){ 
  const response = await axios.get('https://motoringpress.agency');
  const $ = cheerio.load(response.data);
  console.log($('title').text()); // Just print the page title to test
}

test();


