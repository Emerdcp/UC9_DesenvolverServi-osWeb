process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function buscarCoordenadas(cidade) {
    const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1`
    );

    const data = await res.json();

    return data.results[0];
}

async function fnTemperatura() {
    const cidade = 'Americana';

    const local = await buscarCoordenadas(cidade);

    const resposta = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&timezone=America/Sao_Paulo`
    );

    const data = await resposta.json();

    console.log(`Clima em ${local.name}:`);
    console.log(`Temperatura: ${data.current.temperature_2m}°C`);
    console.log(`Vento: ${data.current.wind_speed_10m} km/h`);
    console.log(`Umidade: ${data.current.relative_humidity_2m}%`);

    console.log(`\n Previsão para os próximos 7 dias:`)
    for (let i = 0; i < 7; i++) {
        console.log(`
            Dia: ${data.daily.time[i]}
                Min: ${data.daily.temperature_2m_min[i]}°C
                Max: ${data.daily.temperature_2m_max[i]}°C
                Chuva: ${data.daily.precipitation_sum[i]} mm
                Nascer do sol: ${data.daily.sunrise[i]}
                Pôr do sol: ${data.daily.sunset[i]}
            `)
    }
    console.log(data.current);
}
fnTemperatura();