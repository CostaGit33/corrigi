const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// Dados mockados para o teste
const jogadores = [
  { id: 1, nome: "Jogador Alpha", vitorias: 10, empate: 5, defesa: 2, gols: 15, infracoes: 1, foto: "" },
  { id: 2, nome: "Jogador Beta", vitorias: 8, empate: 3, defesa: 1, gols: 12, infracoes: 2, foto: "" }
];

const goleiros = [
  { id: 101, nome: "Goleiro Muralha", vitorias: 12, empate: 4, defesa: 45, gols: 0, infracoes: 0, foto: "" },
  { id: 102, nome: "Goleiro Luva", vitorias: 9, empate: 6, defesa: 38, gols: 1, infracoes: 1, foto: "" }
];

app.get("/", (req, res) => {
  res.json({ status: "online", message: "API MOCK FutPontos ONLINE" })
})

app.get("/jogadores", (req, res) => res.json(jogadores))
app.get("/jogadores/:id", (req, res) => {
  const p = jogadores.find(j => j.id == req.params.id) || goleiros.find(j => j.id == req.params.id);
  p ? res.json(p) : res.status(404).json({ error: "Não encontrado" });
})

app.get("/goleiros", (req, res) => res.json(goleiros))
app.get("/goleiros/:id", (req, res) => {
  const p = goleiros.find(j => j.id == req.params.id);
  p ? res.json(p) : res.status(404).json({ error: "Não encontrado" });
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor MOCK rodando na porta " + PORT);
});
