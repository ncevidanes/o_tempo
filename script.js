// Seleciona os elementos que vamos atualizar
const titleElement = document.getElementById('location-title');
const emojiElement = document.getElementById('weather-emoji');
const tempElement = document.getElementById('weather-temp');
const descElement = document.getElementById('weather-desc');

// Objeto para "traduzir" os códigos do tempo (mesmo de antes)
const weatherCodes = {
    0: { desc: 'Céu limpo', emoji: '☀️' },
    1: { desc: 'Principalmente limpo', emoji: '🌤️' },
    2: { desc: 'Parcialmente nublado', emoji: '⛅' },
    3: { desc: 'Nublado', emoji: '☁️' },
    61: { desc: 'Chuva leve', emoji: '🌧️' },
    80: { desc: 'Pancadas de chuva', emoji: '🌧️' },
    95: { desc: 'Trovoada', emoji: '⛈️' },
    // Adicione mais códigos conforme necessário
};

// Função que busca o clima, agora recebendo lat e lon como parâmetros
function buscarClima(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=America/Sao_Paulo`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const currentTemp = data.current.temperature_2m;
            const currentCode = data.current.weather_code;
            const weatherInfo = weatherCodes[currentCode] || { desc: 'Tempo desconhecido', emoji: '🤷' };

            // Atualiza o HTML com os dados
            titleElement.textContent = `Clima Agora`; // Título genérico
            emojiElement.textContent = weatherInfo.emoji;
            tempElement.textContent = `${Math.round(currentTemp)}°C`;
            descElement.textContent = weatherInfo.desc;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do clima:', error);
            descElement.textContent = 'Não foi possível carregar o clima.';
        });
}

// Função para lidar com o sucesso ao obter a localização
function sucessoNaLocalizacao(posicao) {
    // A API nos devolve um objeto 'posicao' com as coordenadas
    const latitude = posicao.coords.latitude;
    const longitude = posicao.coords.longitude;

    console.log(`Localização obtida: Lat ${latitude}, Lon ${longitude}`);
    
    // Agora que temos as coordenadas, chamamos a função para buscar o clima
    buscarClima(latitude, longitude);
}

// Função para lidar com o erro ao obter a localização
function erroNaLocalizacao(erro) {
    console.error(`Erro ao obter localização: ${erro.message}`);
    descElement.textContent = 'Não foi possível obter sua localização. Permita o acesso e atualize a página.';
    emojiElement.textContent = '❌';
}

// A MÁGICA ACONTECE AQUI!
// Verificamos se o navegador suporta geolocalização
if ('geolocation' in navigator) {
    // Se suportar, pedimos a posição do usuário.
    // O navegador vai pedir permissão.
    // Se o usuário aceitar, a função sucessoNaLocalizacao será chamada.
    // Se ele negar ou der erro, a função erroNaLocalizacao será chamada.
    navigator.geolocation.getCurrentPosition(sucessoNaLocalizacao, erroNaLocalizacao);
} else {
    // Caso o navegador seja muito antigo e não tenha suporte
    descElement.textContent = 'Seu navegador não suporta geolocalização.';
}
