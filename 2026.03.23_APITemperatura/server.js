process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

async function buscarClima(cidade) {
    try {
        const localRes = await axios.get(
            `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1`
        );

        const localData = localRes.data;

        if (!localData.results || localData.results.length === 0) {
            return null;
        }

        const local = localData.results[0];

        // const climaRes = await axios.get(
        //     `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max,relative_humidity_2m_min&timezone=America/Sao_Paulo`
        // );
        const climaRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max,relative_humidity_2m_min&timezone=America/Sao_Paulo`
        );
        const clima = climaRes.data;

        return { local, clima };

    } catch (err) {
        console.error("ERRO DETALHADO:", err.message);
        throw err;
    }
}

app.get("/api/clima", async (req, res) => {
    const cidade = req.query.cidade || "Americana";

    try {
        const data = await buscarClima(cidade);

        if (!data) {
            return res.status(404).json({ error: "Cidade não encontrada" });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});