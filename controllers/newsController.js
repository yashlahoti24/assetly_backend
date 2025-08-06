// async function getNews(){
//     const res = await fetch(newsURL)
//     const data = await res.json()
//     res.json(data)
// }

const newsURL = "https://newsapi.org/v2/everything?q=stocks&sortBy=popularity&apiKey=56d4b4b7c0474d13bd3a45619487e86b"

exports.getNews = async(req, res)=>{
    const response = await fetch(newsURL)
    const newsData = await response.json()
    console.log(newsData);
    res.json(newsData)
}