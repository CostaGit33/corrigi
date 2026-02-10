import { apiRequest, calculatePoints, showFeedback } from "./globais.js";

/* ======================================================
   UTIL
====================================================== */

function getPlayerIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/* ======================================================
   ELEMENTOS
====================================================== */

const stateEl   = document.getElementById("playerState");
const profileEl = document.getElementById("playerProfile");

const nameEl    = document.getElementById("playerName");
const pointsEl  = document.getElementById("playerPoints");

const statV     = document.getElementById("statVitorias");
const statG     = document.getElementById("statGols");
const statD     = document.getElementById("statDefesas");
const statE     = document.getElementById("statEmpates");
const statI     = document.getElementById("statInfracoes");

const photoEl   = document.getElementById("playerPhoto");
const editBtn   = document.getElementById("editPlayerBtn");

/* ======================================================
   LOAD PLAYER
====================================================== */

async function loadPlayer() {
  const id = getPlayerIdFromURL();

  if (!id) {
    showError("ID do jogador não fornecido.");
    return;
  }

  try {
    // Tenta buscar primeiro na tabela de jogadores principal
    let player;
    try {
      player = await apiRequest(`/jogadores/${id}`);
    } catch (e) {
      // Se não encontrar, tenta na tabela de goleiros (jogadores2)
      player = await apiRequest(`/jogadores2/${id}`);
    }

    if (!player) {
      showError("Jogador não encontrado.");
      return;
    }

    renderPlayer(player);

  } catch (err) {
    console.error("Erro ao carregar jogador:", err);
    showError("Erro ao carregar dados do jogador.");
  }
}

/* ======================================================
   RENDER
====================================================== */

function renderPlayer(p) {
  // Estado
  if (stateEl) stateEl.hidden = true;
  if (profileEl) profileEl.hidden = false;

  // Nome
  nameEl.textContent = p.nome;

  // Normalização de campos (suporte a diferentes nomes de colunas se houver)
  const v = Number(p.vitorias) || 0;
  const e = Number(p.empate) || 0;
  const d = Number(p.defesa) || 0;
  const g = Number(p.gols) || 0;
  const i = Number(p.infracoes) || 0;

  // Pontos recalculados usando a função global (fonte da verdade)
  const pontosCalculados = calculatePoints(v, e, d, g, i);
  pointsEl.textContent = pontosCalculados.toFixed(1);

  // Estatísticas
  if (statV) statV.textContent = v;
  if (statG) statG.textContent = g;
  if (statD) statD.textContent = d;
  if (statE) statE.textContent = e;
  if (statI) statI.textContent = i;

  // Foto segura
  if (photoEl) {
    photoEl.src = p.foto || "futponts_large.png";
    photoEl.alt = `Foto de ${p.nome}`;
  }

  // Link para edição
  if (editBtn) {
    editBtn.href = `adicionar.html?id=${p.id}`;
  }
}

/* ======================================================
   ERRO
====================================================== */

function showError(message) {
  if (stateEl) {
    stateEl.textContent = message;
    stateEl.className = "player-error";
    stateEl.hidden = false;
  }
  if (profileEl) {
    profileEl.hidden = true;
  }

  showFeedback(message, "error");
}

/* ======================================================
   INIT
====================================================== */

document.addEventListener("DOMContentLoaded", loadPlayer);

console.info(
  "%cFutPontos | Detalhes do Jogador ativo",
  "color:#D62828;font-weight:bold;font-size:13px"
);
