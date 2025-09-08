import requests
from bs4 import BeautifulSoup
import json

def scrape_articles():
    url = 'https://motoringpress.agency'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    articles = []
    for article in soup.select('article'):
        title = article.find('h2').get_text(strip=True)
        summary = article.find('p').get_text(strip=True)
        link = article.find('a')['href']
        image = article.find('img')['src']
        articles.append({
            'title': title,
            'summary': summary,
            'link': link,
            'image': image
        })

    with open('data/articles.json', 'w') as f:
        json.dump(articles, f, indent=2)

if name == 'main':
    scrape_articles()

