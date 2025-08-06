const axios = require('axios');

const url = "https://newsapi.org/v2/everything";
const params = {
  q: "finance OR stock OR investment OR wallstreat",
  from: "2025-06-30",
  sortBy: "popularity",
  apiKey: "56d4b4b7c0474d13bd3a45619487e86b",
  language: "en",
};

axios.get(url, { params })
  .then(response => {
    const articles = response.data.articles;
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source.name}`);
      console.log(`   URL: ${article.url}`);
      console.log(`   Description: ${article.description}`);
      console.log();
    });
  })
  .catch(error => {
    console.error("Error fetching news:", error.message);
  });
