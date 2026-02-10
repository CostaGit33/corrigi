import { apiRequest, calculatePoints } from "./globais.js";

/* ======================================================
   CONFIGURAÇÃO
====================================================== */

const JOGADORES_ENDPOINT = "/jogadores";
const UPDATE_INTERVAL = 10000;

/* ======================================================
   INIT
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  carregarClassificacao();
  setInterval(carregarClassificacao, UPDATE_INTERVAL);
});

/* ======================================================
   CORE
====================================================== */

async function carregarClassificacao() {
  const tbody = document.getElementById("playerList");
  const cardsContainer = document.getElementById("rankingCards");

  if (!tbody && !cardsContainer) return;

  try {
    const jogadores = await apiRequest(JOGADORES_ENDPOINT);

    if (!Array.isArray(jogadores)) {
      throw new Error("Resposta inválida da API");
    }

    // Normaliza dados e calcula pontos
    jogadores.forEach(j => {
      j.vitorias   = Number(j.vitorias)   || 0;
      j.empates    = Number(j.empate)     || 0;
      j.defesas    = Number(j.defesa)     || 0;
      j.gols       = Number(j.gols)       || 0;
      j.infracoes  = Number(j.infracoes)  || 0;

      j.pontos = calculatePoints(
        j.vitorias,
        j.empates,
        j.defesas,
        j.gols,
        j.infracoes
      );
    });

    // Ordena por pontuação
    jogadores.sort((a, b) => b.pontos - a.pontos);

    if (tbody) renderTable(jogadores, tbody);
    if (cardsContainer) renderCards(jogadores, cardsContainer);

  } catch (error) {
    console.error("Erro ao carregar classificação:", error);

    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8">Erro ao carregar dados.</td>
        </tr>
      `;
    }

    if (cardsContainer) {
      cardsContainer.innerHTML = "<p>Erro ao carregar ranking.</p>";
    }
  }
}

/* ======================================================
   RENDER TABELA
====================================================== */

function renderTable(jogadores, tbody) {
  tbody.innerHTML = "";

  if (!jogadores.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">Nenhum jogador cadastrado.</td>
      </tr>
    `;
    return;
  }

  jogadores.forEach((j, index) => {
    const tr = document.createElement("tr");

    tr.style.animation = "fadeUp .4s ease both";
    tr.style.animationDelay = `${index * 0.03}s`;

    tr.innerHTML = `
      <td>${index + 1}</td>

      <td>
        <a href="jogador.html?id=${j.id}" class="player-link">
          ${j.nome}
        </a>
      </td>

      <td><strong>${j.pontos}</strong></td>
      <td>${j.vitorias}</td>
      <td>${j.gols}</td>
      <td>${j.defesas}</td>
      <td>${j.empates}</td>
      <td>${j.infracoes}</td>
    `;

    tbody.appendChild(tr);
  });
}

/* ======================================================
   RENDER CARDS
====================================================== */

function renderCards(jogadores, container) {
  container.innerHTML = "";

  if (!jogadores.length) {
    container.innerHTML = "<p>Nenhum jogador cadastrado.</p>";
    return;
  }

  const maxPoints = jogadores[0].pontos || 1;

  jogadores.forEach((j, index) => {
    const percent = Math.min((j.pontos / maxPoints) * 100, 100);

    const card = document.createElement("div");
    card.className = "player-card";
    card.style.animationDelay = `${index * 0.05}s`;

    // Destaque Top 3
    if (index === 0) card.classList.add("top-1");
    if (index === 1) card.classList.add("top-2");
    if (index === 2) card.classList.add("top-3");

    card.innerHTML = `
      <div class="player-rank">#${index + 1}</div>

      <div class="player-name">
        <a href="jogador.html?id=${j.id}" class="player-link">
          ${j.nome}
        </a>
      </div>

      <div class="player-points">${j.pontos} pts</div>

      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>

      <div class="player-stats">
        <span>🏆 ${j.vitorias}</span>
        <span>⚽ ${j.gols}</span>
        <span>🧤 ${j.defesas}</span>
        <span>🤝 ${j.empates}</span>
      </div>
    `;

    container.appendChild(card);

    requestAnimationFrame(() => {
      card.querySelector(".progress-fill").style.width = `${percent}%`;
    });
  });
}
