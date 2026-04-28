/* ============================================================
   script.js — For You, Baby 🌧️
   Handles: rain canvas · date · persuasion modal for No button
            · gently convinces user to pick Yes
   ============================================================ */

/* ── 1. Auto date ── */
(function () {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const d = new Date();
  const el = document.getElementById("ldate");
  if (el) {
    el.textContent =
      months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }
})();

/* ── 2. Rain canvas ── */
(function () {
  const canvas = document.getElementById("rain");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, drops = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    spawnDrops();
  }

  function spawnDrops() {
    drops = [];
    const count = Math.floor(W * 0.06);
    for (let i = 0; i < count; i++) {
      drops.push(mkDrop());
    }
  }

  function mkDrop() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      len:   6 + Math.random() * 14,
      speed: 8 + Math.random() * 10,
      alpha: 0.1 + Math.random() * 0.25,
      width: 0.4 + Math.random() * 0.5,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "#c896a8";
    drops.forEach(d => {
      ctx.globalAlpha = d.alpha;
      ctx.lineWidth   = d.width;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 1, d.y + d.len);
      ctx.stroke();

      d.y += d.speed;
      if (d.y > H + 20) {
        d.x   = Math.random() * W;
        d.y   = -20;
        d.len   = 6 + Math.random() * 14;
        d.speed = 8 + Math.random() * 10;
        d.alpha = 0.1 + Math.random() * 0.25;
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ── 3. Persuasion Messages (progressive convincing) ── */
let noClickCount = 0;
let persuasionActive = false;
let noButtonPermanentlyDisabled = false;

const persuasionMessages = [
  { title: "PLS BABY", message: "Are you sure? My heart aches just reading that. Please don't say no. I love you so much." },
  { title: "PATAWARIN MO NA AKO HUHU", message: "Every moment without your forgiveness feels heavy. I know I messed up, but I'm trying. Give us a chance?" },
  { title: "MISS NA KITA E", message: "You mean everything to me. Saying no breaks me a little more each time. Please, baby... say yes." },
  { title: "I LOVE YOU SORRY NA", message: "All the laughs, the late night talks, the way you make me feel home. That's worth forgiving, isn't it?" },
  { title: "DI NA PO MAUULIT BABY", message: "I promise you, I will spend every single day making it up to you. Just say yes. Let me love you right." },
  { title: "IIYAK NAKO", message: "Without you, nothing makes sense. Please forgive me, baby. I can't lose you." },
  { title: "PLS USAP NA ULIT TAYO :((", message: "Come on, you know you want to forgive me. Click 'Yes, I forgive you' and let's heal together. Mahal kita palagi." }
];

function showPersuasionModal() {
  if (persuasionActive) return;
  
  // Progressive message based on click count
  const msgIndex = Math.min(noClickCount - 1, persuasionMessages.length - 1);
  const msg = persuasionMessages[msgIndex] || persuasionMessages[persuasionMessages.length - 1];
  
  const overlay = document.getElementById("persuasionOverlay");
  const titleEl = document.getElementById("persuasionTitle");
  const messageEl = document.getElementById("persuasionMessage");
  
  if (titleEl) titleEl.textContent = msg.title;
  if (messageEl) messageEl.textContent = msg.message;
  
  if (overlay) {
    overlay.classList.add("active");
    persuasionActive = true;
  }
}

function closePersuasionModal() {
  const overlay = document.getElementById("persuasionOverlay");
  if (overlay) {
    overlay.classList.remove("active");
    persuasionActive = false;
  }
}

// This handles the "Yes" button inside the persuasion modal (forgiveness)
function handlePersuasionYes() {
  closePersuasionModal();
  handleYes(); // Trigger the main Yes flow
}

// This handles when user still clicks "No" in persuasion modal
function handlePersuasionNo() {
  closePersuasionModal();
  
  // Update hint to be more persuasive
  const hint = document.getElementById("dodgeHint");
  if (hint) {
    hint.textContent = "SAKIT PERO HINDI AKO SUSUKO BABY, MISS NA KITA";
    hint.style.color = "var(--rose)";
  }
  
  // After 2 seconds, reset hint
  setTimeout(() => {
    if (hint && !noButtonPermanentlyDisabled) {
      hint.textContent = "CALL AND PLAY NA TAYO PLS";
    }
  }, 3000);
}

/* ── 4. No Button Handler (shows persuasion modal) ── */
function handleNo() {
  if (noButtonPermanentlyDisabled) return;
  
  noClickCount++;
  
  // Update the No button text to show persuasion
  const noBtn = document.getElementById("btnNo");
  if (noBtn && noClickCount === 1) {
    noBtn.textContent = "PLS BABY MISS NA KITA";
  } else if (noBtn && noClickCount === 2) {
    noBtn.textContent = "NAIIYAK NAKO BABY";
  } else if (noBtn && noClickCount >= 3) {
    noBtn.textContent = "PLS PO BABY?";
  }
  
  // Show persuasive modal
  showPersuasionModal();
  
  // After 5 No clicks, disable No button and strongly encourage Yes
  if (noClickCount >= 5 && !noButtonPermanentlyDisabled) {
    noButtonPermanentlyDisabled = true;
    if (noBtn) {
      noBtn.style.opacity = "0.5";
      noBtn.style.cursor = "default";
      noBtn.style.pointerEvents = "none";
      noBtn.textContent = "sIGE NA PLS";
    }
    const hint = document.getElementById("dodgeHint");
    if (hint) {
      hint.textContent = "Okay, I'll stop running... now please forgive me? 🥺💕";
      hint.style.color = "var(--rose-soft)";
    }
  }
  
  // Dodge effect - small movement when clicked (playful)
  const btn = document.getElementById("btnNo");
  if (btn && !noButtonPermanentlyDisabled) {
    btn.style.transform = "translate(8px, -5px)";
    setTimeout(() => {
      if (btn) btn.style.transform = "";
    }, 100);
  }
}

/* ── 5. Dodge on hover (playful but not breaking alignment) ── */
function dodgeBtn(e, btn) {
  if (noButtonPermanentlyDisabled) return;
  
  const isTouch = e.type === "touchstart";
  const clientX = isTouch ? e.touches[0].clientX : e.clientX;
  const clientY = isTouch ? e.touches[0].clientY : e.clientY;
  
  const rect = btn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;
  
  const dx = clientX - btnCenterX;
  const dy = clientY - btnCenterY;
  const distance = Math.hypot(dx, dy);
  
  if (distance < 70) {
    const angle = Math.atan2(dy, dx);
    const strength = Math.min(30, 65 - distance);
    const offsetX = Math.cos(angle) * strength * 0.6;
    const offsetY = Math.sin(angle) * strength * 0.6;
    btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    
    setTimeout(() => {
      if (btn && !noButtonPermanentlyDisabled) btn.style.transform = "";
    }, 120);
  }
}

/* ── 6. Yes Handler (Forgiveness) ── */
function handleYes() {
  const overlay = document.getElementById("yesOverlay");
  if (!overlay) return;
  overlay.classList.add("active");
  
  const container = document.getElementById("yesHearts");
  if (container) {
    container.innerHTML = "💛 🌸 💛 💗 🌹";
  }
  
  // Spawn many floating hearts
  for (let i = 0; i < 35; i++) {
    spawnHeart();
  }
  
  // If persuasion modal is open, close it
  closePersuasionModal();
}

function closeYes() {
  const overlay = document.getElementById("yesOverlay");
  if (overlay) overlay.classList.remove("active");
}

function spawnHeart() {
  const el = document.createElement("div");
  el.textContent = ["💛","🌸","💗","🌷","✨","🕊️","💕","🌹","💖"][Math.floor(Math.random() * 9)];
  el.style.cssText = `
    position: fixed;
    left: ${10 + Math.random() * 80}vw;
    top: 100vh;
    font-size: ${0.9 + Math.random() * 1.4}rem;
    z-index: 200;
    pointer-events: none;
    animation: floatUp ${2 + Math.random() * 3}s ease forwards;
    animation-delay: ${Math.random() * 1.5}s;
    opacity: 0;
  `;
  document.body.appendChild(el);
  
  if (!document.getElementById("floatUpStyle")) {
    const s = document.createElement("style");
    s.id = "floatUpStyle";
    s.textContent = `
      @keyframes floatUp {
        0%   { transform: translateY(0) scale(0.8);   opacity: 0; }
        20%  { opacity: 1; }
        100% { transform: translateY(-100vh) scale(1.1); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }
  
  el.addEventListener("animationend", () => el.remove());
}

/* ── 7. Event Listeners ── */
document.addEventListener("DOMContentLoaded", () => {
  const yesBtn = document.getElementById("btnYes");
  const noBtn = document.getElementById("btnNo");
  const persuasionClose = document.getElementById("persuasionClose");
  const persuasionYesBtn = document.getElementById("persuasionYesBtn");
  const persuasionNoBtn = document.getElementById("persuasionNoBtn");
  
  if (yesBtn) {
    yesBtn.addEventListener("click", handleYes);
  }
  
  if (noBtn) {
    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleNo();
    });
    noBtn.addEventListener("mousemove", (e) => dodgeBtn(e, noBtn));
    noBtn.addEventListener("touchstart", (e) => dodgeBtn(e, noBtn));
  }
  
  if (persuasionClose) {
    persuasionClose.addEventListener("click", closePersuasionModal);
  }
  
  if (persuasionYesBtn) {
    persuasionYesBtn.addEventListener("click", handlePersuasionYes);
  }
  
  if (persuasionNoBtn) {
    persuasionNoBtn.addEventListener("click", handlePersuasionNo);
  }
  
  // Close persuasion modal when clicking outside
  const persuasionOverlay = document.getElementById("persuasionOverlay");
  if (persuasionOverlay) {
    persuasionOverlay.addEventListener("click", (e) => {
      if (e.target === persuasionOverlay) {
        closePersuasionModal();
      }
    });
  }
});

/* ── 8. Keyboard: Escape closes modals ── */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeYes();
    closePersuasionModal();
  }
});