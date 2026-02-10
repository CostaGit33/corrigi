import { apiRequest, calculatePoints } from "./globais.js";

/* ======================================================
   CONFIGURAÇÃO
====================================================== */
const GOLEIROS_ENDPOINT = "/goleiros";

/* ======================================================
   INICIALIZAÇÃO
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  carregarGoleiros();
});

/* ======================================================
   LÓGICA PRINCIPAL
====================================================== */
async function carregarGoleiros() {
  const tbody = document.getElementById("tabela-goleiros"); // ID corrigido
  const cardsContainer = document.getElementById("cards-goleiros"); // ID corrigido

  try {
    // Busca dados da API usando o cliente global
    const dados = await apiRequest(GOLEIROS_ENDPOINT);

    // Processa e calcula os pontos de cada goleiro
    const goleirosProcessados = normalizar(dados);

    // Renderiza os componentes na tela
    if (tbody) renderTabela(goleirosProcessados, tbody);
    if (cardsContainer) renderCards(goleirosProcessados, cardsContainer);

  } catch (err) {
    console.error("Erro ao carregar goleiros:", err);
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem;">Erro ao carregar dados dos goleiros.</td></tr>`;
    }
  }
}

/* ======================================================
   NORMALIZAÇÃO E CÁLCULO
====================================================== */
function normalizar(lista) {
  if (!Array.isArray(lista)) return [];

  return lista
    .map(g => {
      // Garante que valores nulos do banco virem 0 e calcula os pontos reais
      const v = Number(g.vitorias) || 0;
      const e = Number(g.empate) || 0;
      const d = Number(g.defesa) || 0;
      const gols = Number(g.gols) || 0;
      const inf = Number(g.infracoes) || 0;

      return {
        ...g,
        vitorias: v,
        empate: e,
        defesa: d,
        gols: gols,
        infracoes: inf,
        // Aplica a regra oficial definida no globais.js
        pontos: calculatePoints(v, e, d, gols, inf)
      };
    })
    // Ordena por Pontos -> Defesas -> Vitórias
    .sort((a, b) => 
      b.pontos - a.pontos || 
      b.defesa - a.defesa || 
      b.vitorias - a.vitorias
    );
}

/* ======================================================
   RENDERIZAÇÃO DA TABELA
====================================================== */
function renderTabela(lista, tbody) {
  tbody.innerHTML = lista.map((g, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>
        <a href="jogador.html?id=${g.id}" class="player-link">
          ${g.nome}
        </a>
      </td>
      <td><strong>${g.pontos.toFixed(1)}</strong></td>
      <td>${g.vitorias}</td>
      <td>${g.empate}</td>
      <td>${g.gols}</td>
      <td>${g.defesa}</td>
      <td>${g.infracoes}</td>
    </tr>
  `).join('');
}

/* ======================================================
   RENDERIZAÇÃO DOS CARDS
====================================================== */
function renderCards(lista, container) {
  container.innerHTML = "";
  
  // Exibe apenas os melhores ou todos conforme sua necessidade
  lista.forEach((g, i) => {
    const card = document.createElement("div");
    card.className = "player-card";
    
    // Destaque visual para o Top 3
    if (i === 0) card.classList.add("top-1");
    if (i === 1) card.classList.add("top-2");
    if (i === 2) card.classList.add("top-3");

    card.innerHTML = `
      <div class="player-rank">#${i + 1}</div>
      <div class="player-name">${g.nome}</div>
      <div class="player-points">${g.pontos.toFixed(1)} pts</div>
      
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min((g.pontos / (lista[0].pontos || 1)) * 100, 100)}%"></div>
      </div>

      <div class="player-stats">
        <span>🧤 ${g.defesa} Defesas</span>
        <span>🏆 ${g.vitorias} Vitórias</span>
      </div>
    `;
    container.appendChild(card);
  });
}