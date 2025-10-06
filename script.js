// 1. Seleciona os elementos que vamos atualizar
const emojiElement = document.getElementById('weather-emoji');
const tempElement = document.getElementById('weather-temp');
const descElement = document.getElementById('weather-desc');

// 2. Objeto para "traduzir" os códigos do tempo (WMO Weather interpretation codes)
//    Você pode encontrar a lista completa na documentação do Open-Meteo
const weatherCodes = {
    0: { desc: 'Céu limpo', emoji: '☀️' },
    1: { desc: 'Principalmente limpo', emoji: '🌤️' },
    2: { desc: 'Parcialmente nublado', emoji: '⛅' },
    3: { desc: 'Nublado', emoji: '☁️' },
    45: { desc: 'Nevoeiro', emoji: '🌫️' },
    48: { desc: 'Nevoeiro com geada', emoji: '🌫️' },
    51: { desc: 'Chuvisco leve', emoji: '🌦️' },
    53: { desc: 'Chuvisco moderado', emoji: '🌦️' },
    55: { desc: 'Chuvisco denso', emoji: '🌦️' },
    61: { desc: 'Chuva leve', emoji: '🌧️' },
    63: { desc: 'Chuva moderada', emoji: '🌧️' },
    65: { desc: 'Chuva forte', emoji: '🌧️' },
    80: { desc: 'Pancadas de chuva leves', emoji: '🌧️' },
    81: { desc: 'Pancadas de chuva moderadas', emoji: '🌧️' },
    82: { desc: 'Pancadas de chuva violentas', emoji: '⛈️' },
    95: { desc: 'Trovoada', emoji: '⛈️' },
    // Adicione mais códigos conforme necessário
};

// 3. Monta a URL da API com as coordenadas e dados desejados
const lat = -22.11;
const lon = -43.20;
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=America/Sao_Paulo`;

// 4. Função para buscar os dados na API
function buscarClima() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Os dados atuais estão dentro da propriedade "current"
            const currentTemp = data.current.temperature_2m;
            const currentCode = data.current.weather_code;

            // Pega a descrição e o emoji do nosso objeto `weatherCodes`
            // Se o código não for encontrado, usa um padrão
            const weatherInfo = weatherCodes[currentCode] || { desc: 'Tempo desconhecido', emoji: '🤷' };

            // 5. Atualiza o HTML com os dados recebidos
            emojiElement.textContent = weatherInfo.emoji;
            tempElement.textContent = `${Math.round(currentTemp)}°C`; // Arredonda a temperatura
            descElement.textContent = weatherInfo.desc;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do clima:', error);
            descElement.textContent = 'Não foi possível carregar o clima.';
        });
}

// 6. Chama a função assim que a página carregar
document.addEventListener('DOMContentLoaded', buscarClima);
