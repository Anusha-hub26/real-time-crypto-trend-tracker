let previousPrice = null;
let intervalId = null;
let currentCoin = null;
let priceHistory = [];

function startTracking() {
  const coin = document.getElementById("coinInput").value.toLowerCase();
  if (!coin) return;

  currentCoin = coin;
  previousPrice = null;
  priceHistory = [];

  if (intervalId) clearInterval(intervalId);

  fetchCrypto();
  intervalId = setInterval(fetchCrypto, 10000); // Poll every 10 sec
}

async function fetchCrypto() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currentCoin}`
    );

    const data = await response.json();

    if (data.length === 0) {
      document.getElementById("trend").textContent = "Coin not found!";
      return;
    }

    const coin = data[0];
    const currentPrice = coin.current_price;

    document.getElementById("coinName").textContent = coin.name;
    document.getElementById("price").textContent = "$" + currentPrice;
    document.getElementById("change").textContent =
      coin.price_change_percentage_24h.toFixed(2) + "%";
    document.getElementById("updated").textContent =
      new Date().toLocaleTimeString();

    priceHistory.push(currentPrice);
    if (priceHistory.length > 5) priceHistory.shift();

    if (previousPrice !== null) {
      detectTrend(currentPrice);
    }

    previousPrice = currentPrice;

  } catch (error) {
    document.getElementById("trend").textContent = "Error loading data";
  }
}

function detectTrend(currentPrice) {
  const trendElement = document.getElementById("trend");
  const card = document.querySelector(".card");

  card.classList.remove("flash-up", "flash-down");

  if (currentPrice > previousPrice) {
    trendElement.textContent = "📈 Bullish (Uptrend)";
    trendElement.className = "green";
    card.classList.add("flash-up");
  } 
  else if (currentPrice < previousPrice) {
    trendElement.textContent = "📉 Bearish (Downtrend)";
    trendElement.className = "red";
    card.classList.add("flash-down");
  } 
  else {
    trendElement.textContent = "➖ Neutral";
    trendElement.className = "yellow";
  }

  // Simple moving average prediction
  if (priceHistory.length >= 5) {
    const avg =
      priceHistory.reduce((a, b) => a + b, 0) / priceHistory.length;

    if (currentPrice > avg) {
      trendElement.textContent += " 🔮 Likely to Rise";
    } else {
      trendElement.textContent += " 🔮 Likely to Fall";
    }
  }
}

