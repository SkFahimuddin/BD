// =============================================
//  BIRTHDAY SITE — script.js
// =============================================

let currentTheme = null;
let audioCtx = null;
let musicNodes = {};
let musicPlaying = {};

// =============================================
//  INIT ON LOAD
// =============================================
window.addEventListener('load', () => {
  createLandingSparkles();
  createSnowflakes();
  createStars();
  createMagicDust();
  createNightStars();
  launchLandingConfetti();
});

// =============================================
//  SCREEN NAVIGATION
// =============================================
function enterTheme(theme) {
  const landing = document.getElementById('landing');
  const themeScreen = document.getElementById(`theme-${theme}`);

  landing.classList.remove('active');
  setTimeout(() => {
    themeScreen.classList.add('active');
    currentTheme = theme;
  }, 300);
}

function goBack() {
  if (!currentTheme) return;
  const themeScreen = document.getElementById(`theme-${currentTheme}`);
  const landing = document.getElementById('landing');

  // Stop music
  stopMusic(currentTheme);

  themeScreen.classList.remove('active');
  setTimeout(() => {
    landing.classList.add('active');
    currentTheme = null;
  }, 300);
}

// =============================================
//  LANDING SPARKLES
// =============================================
function createLandingSparkles() {
  const container = document.getElementById('landingSparkles');
  const colors = ['#f9d94c', '#a8d8ea', '#e8a0c8', '#ff6b35', '#ffffff', '#90e0ef'];

  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    const size = Math.random() * 4 + 2;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --dur: ${Math.random() * 3 + 1.5}s;
      animation-delay: ${Math.random() * 3}s;
      box-shadow: 0 0 ${size * 2}px ${colors[Math.floor(Math.random() * colors.length)]};
    `;
    container.appendChild(el);
  }
}

// =============================================
//  SNOWFLAKES (FROZEN)
// =============================================
function createSnowflakes() {
  const container = document.getElementById('snowflakes');
  const flakes = ['❄', '❅', '❆', '✦', '•'];

  for (let i = 0; i < 50; i++) {
    const el = document.createElement('div');
    el.className = 'snowflake';
    const size = Math.random() * 18 + 8;
    el.textContent = flakes[Math.floor(Math.random() * flakes.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${Math.random() * 8 + 5}s;
      --size: ${size}px;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.7 + 0.3};
    `;
    container.appendChild(el);
  }
}

// =============================================
//  STARS (CINDERELLA)
// =============================================
function createStars() {
  const container = document.getElementById('stars');

  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    el.className = 'star';
    const size = Math.random() * 3 + 1;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${Math.random() * 3 + 1}s;
      animation-delay: ${Math.random() * 4}s;
      box-shadow: 0 0 ${size * 3}px rgba(249, 217, 76, 0.8);
    `;
    container.appendChild(el);
  }
}

// =============================================
//  MAGIC DUST (CINDERELLA)
// =============================================
function createMagicDust() {
  const container = document.getElementById('magicDust');
  const colors = ['#f9d94c', '#e8a0c8', '#f4d4e8', '#fff0b3'];

  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'dust-particle';
    const left = Math.random() * 100;
    const dx = (Math.random() - 0.5) * 200;
    const color = colors[Math.floor(Math.random() * colors.length)];
    el.style.cssText = `
      left: ${left}%;
      --dur: ${Math.random() * 5 + 4}s;
      --dx: ${dx}px;
      animation-delay: ${Math.random() * 6}s;
      background: ${color};
      box-shadow: 0 0 6px ${color};
    `;
    container.appendChild(el);
  }
}

// =============================================
//  NIGHT STARS (MOANA)
// =============================================
function createNightStars() {
  const container = document.getElementById('nightStars');

  for (let i = 0; i < 100; i++) {
    const el = document.createElement('div');
    el.className = 'night-star';
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 60}%;
      --dur: ${Math.random() * 3 + 1.5}s;
      animation-delay: ${Math.random() * 4}s;
    `;
    container.appendChild(el);
  }
}

// =============================================
//  CONFETTI SYSTEM
// =============================================
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];
let confettiActive = false;
let confettiTimer = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiPiece {
  constructor(options = {}) {
    this.reset(options);
  }

  reset(options = {}) {
    const themeColors = {
      frozen: ['#a8d8ea', '#6ecce8', '#ffffff', '#c8f0ff', '#4db8d4'],
      cinderella: ['#f9d94c', '#e8a0c8', '#f4d4e8', '#ffffff', '#f4a261'],
      moana: ['#ff6b35', '#f9d94c', '#00b4d8', '#90e0ef', '#ffffff'],
      landing: ['#f9d94c', '#a8d8ea', '#e8a0c8', '#ff6b35', '#ffffff']
    };

    const palette = themeColors[options.theme || 'landing'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.x = options.x !== undefined ? options.x : Math.random() * canvas.width;
    this.y = options.y !== undefined ? options.y : -10;
    this.size = Math.random() * 8 + 4;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = Math.random() * 3 + 2;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 8;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    this.opacity = 1;
    this.life = 1;
    this.decay = Math.random() * 0.01 + 0.005;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotSpeed;
    this.life -= this.decay;
    this.opacity = this.life;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function launchConfetti(theme, count = 120, originX, originY) {
  confettiActive = true;
  clearTimeout(confettiTimer);

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      confettiParticles.push(new ConfettiPiece({
        theme,
        x: originX,
        y: originY
      }));
    }, Math.random() * 600);
  }

  confettiTimer = setTimeout(() => {
    confettiActive = false;
  }, 4000);
}

function launchLandingConfetti() {
  launchConfetti('landing', 80);
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles = confettiParticles.filter(p => p.life > 0);

  confettiParticles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateConfetti);
}

animateConfetti();

// =============================================
//  MAGIC BUTTON ACTIONS
// =============================================
function triggerFrozenMagic() {
  launchConfetti('frozen', 150, canvas.width / 2, canvas.height / 2);
  showPopup('❄️', "Let It Go, Sanjhbati! ❄️\n\nHappy Birthday, Ice Queen! May your birthday be as magical as Elsa's palace and as warm as Olaf's hugs! ☃️✨");
}

function triggerCinderellaMagic() {
  launchConfetti('cinderella', 150, canvas.width / 2, canvas.height / 2);
  showPopup('✨', "A Dream is a Wish, Sanjhbati! 👑\n\nBibbidi-Bobbidi-Boo! Your birthday wish just came true! You are the most beautiful princess of all! 🥿💫");
}

function triggerMoanaMagic() {
  launchConfetti('moana', 150, canvas.width / 2, canvas.height / 2);
  showPopup('🌊', "The Ocean Calls, Sanjhbati! 🌺\n\nThe waves sing your name today! You are fearless, bold, and incredible — Happy Birthday, Voyager! ⛵🌟");
}

// =============================================
//  POPUP
// =============================================
function showPopup(emoji, text) {
  document.getElementById('popupEmoji').textContent = emoji;
  document.getElementById('popupText').textContent = text;
  document.getElementById('magicPopup').classList.remove('hidden');
  launchConfetti(currentTheme || 'landing', 80);
}

function closePopup() {
  document.getElementById('magicPopup').classList.add('hidden');
}

document.getElementById('magicPopup').addEventListener('click', function(e) {
  if (e.target === this) closePopup();
});

// =============================================
//  WEB AUDIO MUSIC
// =============================================
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Musical themes using Web Audio API oscillators
function createFrozenMusic(ctx) {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
  masterGain.connect(ctx.destination);

  const notes = [415, 466, 554, 622, 698, 784, 880, 784, 698, 622, 554, 466,
                 415, 370, 415, 466, 554, 622, 698, 784, 932, 880, 784, 622];
  let noteIdx = 0;
  let interval = null;

  function playNote() {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(notes[noteIdx % notes.length], ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.55);
    noteIdx++;
  }

  interval = setInterval(playNote, 280);
  return { masterGain, interval };
}

function createCinderellaMusic(ctx) {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.15, ctx.currentTime);
  masterGain.connect(ctx.destination);

  const notes = [262, 330, 392, 523, 659, 784, 659, 523, 440, 523, 659, 784,
                 698, 587, 698, 784, 880, 784, 698, 587, 523, 440, 392, 330];
  let noteIdx = 0;
  let interval = null;

  function playNote() {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[noteIdx % notes.length], ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
    noteIdx++;

    if (noteIdx % 3 === 0) {
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.connect(bassGain);
      bassGain.connect(masterGain);
      bass.type = 'triangle';
      bass.frequency.setValueAtTime(notes[noteIdx % notes.length] / 2, ctx.currentTime);
      bassGain.gain.setValueAtTime(0.3, ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      bass.start(ctx.currentTime);
      bass.stop(ctx.currentTime + 0.85);
    }
  }

  interval = setInterval(playNote, 220);
  return { masterGain, interval };
}

function createMoanaMusic(ctx) {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
  masterGain.connect(ctx.destination);

  const melody = [587, 659, 740, 880, 740, 659, 587, 523, 587, 659, 880, 740,
                  659, 587, 523, 587, 659, 740, 880, 988, 880, 740, 659, 523];
  let noteIdx = 0;
  let interval = null;

  function playNote() {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(melody[noteIdx % melody.length], ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);

    if (noteIdx % 4 === 0) {
      const noise = ctx.createOscillator();
      const noiseGain = ctx.createGain();
      noise.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.type = 'square';
      noise.frequency.setValueAtTime(80, ctx.currentTime);
      noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.1);
    }

    noteIdx++;
  }

  interval = setInterval(playNote, 190);
  return { masterGain, interval };
}

function toggleMusic(theme) {
  const btn = document.getElementById(`music-${theme}`);

  if (musicPlaying[theme]) {
    stopMusic(theme);
    btn.textContent = '🎵 Play Music';
    btn.classList.remove('playing');
  } else {
    startMusic(theme);
    btn.textContent = '🔇 Stop Music';
    btn.classList.add('playing');
  }
}

function startMusic(theme) {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  let nodes;
  if (theme === 'frozen') nodes = createFrozenMusic(ctx);
  else if (theme === 'cinderella') nodes = createCinderellaMusic(ctx);
  else if (theme === 'moana') nodes = createMoanaMusic(ctx);

  musicNodes[theme] = nodes;
  musicPlaying[theme] = true;
}

function stopMusic(theme) {
  if (musicNodes[theme]) {
    clearInterval(musicNodes[theme].interval);
    try {
      musicNodes[theme].masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
    } catch(e) {}
    musicNodes[theme] = null;
  }
  musicPlaying[theme] = false;

  const btn = document.getElementById(`music-${theme}`);
  if (btn) {
    btn.textContent = '🎵 Play Music';
    btn.classList.remove('playing');
  }
}

// =============================================
//  CURSOR SPARKLE TRAIL
// =============================================
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.7) return;

  const span = document.createElement('span');
  span.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    background: ${getTrailColor()};
    transform: translate(-50%, -50%);
    animation: trailFade 0.6s ease forwards;
    box-shadow: 0 0 8px currentColor;
  `;
  document.body.appendChild(span);
  setTimeout(() => span.remove(), 600);
});

function getTrailColor() {
  if (currentTheme === 'frozen') return '#a8d8ea';
  if (currentTheme === 'cinderella') return '#f9d94c';
  if (currentTheme === 'moana') return '#ff6b35';
  return '#ffffff';
}

// Inject trail fade animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
  @keyframes trailFade {
    from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    to { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  }
`;
document.head.appendChild(trailStyle);