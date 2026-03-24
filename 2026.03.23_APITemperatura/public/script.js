const btnBuscar = document.getElementById("btnBuscar");
const inputCidade = document.getElementById("cidade");
const resultado = document.getElementById("resultado");

btnBuscar.addEventListener("click", async () => {
    const cidade = inputCidade.value.trim();
    if (!cidade) return;

    resultado.innerHTML = "Carregando...";

    try {
        const res = await fetch(`/api/clima?cidade=${cidade}`);
        if (!res.ok) throw new Error(`Erro: ${res.status}`);
        const data = await res.json();

        const { local, clima } = data;
        const current = clima.current;
        const daily = clima.daily;

        let html = `
            <h2 style="text-align:center;">${local.name}</h2>

                <div class="temp-principal">
                    ${current.temperature_2m}°C
                </div>

                <div class="info">
                    🌡️ Mín: ${daily.temperature_2m_min[0]}°C / Máx: ${daily.temperature_2m_max[0]}°C <br>
                    🌬️ Vento:  ${current.wind_speed_10m} km/h <br>
                    💧 Previsão Chuva: ${current.relative_humidity_2m}%
                </div>

                <div class="previsao">
                    <h3>Próximos dias</h3>
        `;

        for (let i = 1; i < 7; i++) {
            html += `
            <div class="card-dia">
                <strong>${daily.time[i]}</strong><br>
                🌡️ Mín: ${daily.temperature_2m_min[i]}°C / Máx: ${daily.temperature_2m_max[i]}°C <br>
                🌬️ Vento:  ${current.wind_speed_10m} km/h <br>
                🌧️ Previsão Chuva: ${daily.precipitation_sum[i]} mm
            </div>
        `;
        }

        html += `</div>`;

        html += "</ul>";
        resultado.innerHTML = html;

    } catch (err) {
        console.error(err);
        resultado.innerHTML = "Erro ao buscar o clima.";
    }
});