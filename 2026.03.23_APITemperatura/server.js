const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

async function buscarClima(cidade) {
    const localRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1`
    );
    const localData = await localRes.json();

    if (!localData.results || localData.results.length === 0) return null;

    const local = localData.results[0];

    const climaRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&timezone=America/Sao_Paulo`
    );

    const clima = await climaRes.json();

    return { local, clima };
}

app.get("/api/clima", async (req, res) => {
    const cidade = req.query.cidade || "Americana";

    const data = await buscarClima(cidade);

    if (!data) {
        return res.status(404).json({ error: "Cidade não encontrada" });
    }

    res.json(data);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});