function americanToProb(odds) {
  if (odds > 0) return 100 / (odds + 100);
  const abs = Math.abs(odds);
  return abs / (abs + 100);
}

function probToAmerican(p) {
  if (p > 0.5) return -Math.round((p / (1 - p)) * 100);
  return Math.round(((1 - p) / p) * 100);
}

function fmtOdds(o) {return o > 0 ? `+${o}` : `${o}`;}
function pct(p) {return (p * 100).toFixed(2) + "%";}

function computeNoVig(oddsA, oddsB) {
  const pA = americanToProb(oddsA);
  const pB = americanToProb(oddsB);
  const sum = pA + pB;
  const fairA = pA / sum;
  const fairB = pB / sum;
  return {
    aOdds: probToAmerican(fairA),
    bOdds: probToAmerican(fairB),
    aProb: fairA,
    bProb: fairB
  };
}

function runNoVig() {
  const oddsA = parseFloat(document.getElementById("oddsA").value);
  const oddsB = parseFloat(document.getElementById("oddsB").value);
  const outA = document.getElementById("outA");
  const outB = document.getElementById("outB");
  const r = computeNoVig(oddsA, oddsB);
  outA.textContent = `Side A No-Vig: ${fmtOdds(r.aOdds)} (${pct(r.aProb)})`;
  outB.textContent = `Side B No-Vig: ${fmtOdds(r.bOdds)} (${pct(r.bProb)})`;
}

document.addEventListener("DOMContentLoaded", ()=>{
  const btn=document.getElementById("calcNoVig");
  if(btn) btn.addEventListener("click",runNoVig);
});
// BetBuddy — True Odds (No-Vig) Calculator
// Converts American odds ↔ probabilities correctly: -108 ↔ 51.96%, +108 ↔ 48.04%

// ----- Helpers -----
function americanToProb(odds) {
  if (odds === 0 || !isFinite(odds)) return NaN;
  if (odds > 0) return 100 / (odds + 100);
  const A = Math.abs(odds);
  return A / (A + 100);
}

function probToAmerican(p) {
  if (!(p > 0 && p < 1)) return NaN;
  if (p > 0.5) return -Math.round((p / (1 - p)) * 100);
  return Math.round(((1 - p) / p) * 100);
}

function fmtOdds(odds) {
  if (!isFinite(odds)) return "—";
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function pct(p) {
  if (!isFinite(p)) return "—";
  return (p * 100).toFixed(2) + "%";
}

// ----- Core No-Vig Calculation -----
function computeNoVigFromAmerican(oddsA, oddsB) {
  const pA = americanToProb(oddsA);
  const pB = americanToProb(oddsB);

  if (!isFinite(pA) || !isFinite(pB) || pA <= 0 || pB <= 0) {
    return { error: "Invalid odds input." };
  }

  const sum = pA + pB;
  const pA_noVig = pA / sum;
  const pB_noVig = pB / sum;

  const a_noVig_american = probToAmerican(pA_noVig);
  const b_noVig_american = probToAmerican(pB_noVig);

  return {
    pA_noVig,
    pB_noVig,
    a_noVig_american,
    b_noVig_american
  };
}

// ----- Wire up UI -----
function runNoVig() {
  const oddsA = parseFloat(document.getElementById("oddsA").value);
  const oddsB = parseFloat(document.getElementById("oddsB").value);

  const res = computeNoVigFromAmerican(oddsA, oddsB);
  const outA = document.getElementById("outA");
  const outB = document.getElementById("outB");

  if (res.error) {
    outA.textContent = res.error;
    outB.textContent = "";
    return;
  }

  // ✅ Correct mapping: -108 → 51.96%, +108 → 48.04%
  outA.textContent = `Side A No-Vig: ${fmtOdds(res.a_noVig_american)} (${pct(res.pA_noVig)})`;
  outB.textContent = `Side B No-Vig: ${fmtOdds(res.b_noVig_american)} (${pct(res.pB_noVig)})`;
}

document.addEventListener("DOMContentLoaded", () => {
  const calcBtn = document.getElementById("calcNoVig");
  if (calcBtn) calcBtn.addEventListener("click", runNoVig);
});

