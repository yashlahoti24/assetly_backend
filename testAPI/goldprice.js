const API_KEY = "02508d1401aae152cebea1f4662b01ab"
async function getGoldPrice(){
    const goldURL= `https://api.metalpriceapi.com/v1/latest?api_key=${API_KEY}`
    const res = await fetch(goldURL)
    const data = await res.json();
    let price = data.rates.XAU;
    // console.log(price);
    console.log(`Gold Price per ounce: ${1/price}`);
}

getGoldPrice();