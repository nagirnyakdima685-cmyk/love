const SECRET_WORDS = ['надгора', 'над гора', '1', '0.3 0.4'];
const PORTRAIT_URL = 'love2.jpg';
const DATES = [
  '1 грудня вт',
  '2 грудня ср',
  '3 грудня чт',
  '4 грудня пт',
  '5 грудня сб',
  '6 грудня нд',
  '7 грудня пн',
  '8 грудня вт',
  '9 грудня ср',
  '10 грудня чт',
  '11 грудня пт',
  '12 грудня сб',
  '13 грудня нд',
  '14 грудня пн',
  '15 грудня вт',
  '16 грудня ср',
  '17 грудня чт',
  '18 грудня пт',
  '19 грудня сб',
  '20 грудня нд',
  '21 грудня пн',
  '22 грудня вт',
  '23 грудня ср',
  '24 грудня чт',
  '25 грудня пт',
  '26 грудня сб',
  '27 грудня нд',
  '28 грудня пн',
  '29 грудня вт',
  '30 грудня ср'
];
const TIMES = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'
];

let state = {
  planTitle: '',
  planDesc: '',
  date: DATES[1],
  time: TIMES[3]
};

function goToScreen(num) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${num}`).classList.add('active');
}

// --- ЕКРАН 1: КОДОВЕ СЛОВО ---
const secretInput = document.getElementById('secretInput');
const unlockBtn = document.getElementById('unlockBtn');

function checkSecretWord() {
  const val = secretInput.value.trim().toLowerCase();
  if (SECRET_WORDS.includes(val)) {
    unlockBtn.disabled = true;
    unlockBtn.textContent = 'перевіряю...';
    setTimeout(() => {
      goToScreen(2);
      startEnvelopeSequence();
    }, 700);
  } else {
    secretInput.classList.add('error');
    setTimeout(() => secretInput.classList.remove('error'), 400);
  }
}

unlockBtn.addEventListener('click', checkSecretWord);
secretInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    checkSecretWord();
  }
});

// --- ЕКРАН 2: КОНВЕРТ ---
function startEnvelopeSequence() {
  const intro = document.getElementById('introText');
  const wrap = document.getElementById('envelopeWrap');
  setTimeout(() => {
    intro.style.opacity = '0';
    setTimeout(() => {
      intro.style.display = 'none';
      wrap.style.display = 'flex';
    }, 600);
  }, 1500);
}

document.getElementById('envelopeWrap').addEventListener('click', () => {
  document.getElementById('envelope').classList.add('open');
  document.getElementById('envelopeHint').textContent = 'відкриваю...';
  setTimeout(() => goToScreen(3), 850);
});

// --- ЕКРАН 4: ВИБІР СЦЕНАРІЮ ---
function selectPlan(el, title, desc) {
  state.planTitle = title;
  state.planDesc = desc;
  spawnSparkles(el);
  setTimeout(() => {
    goToScreen(5);
    initPicker(DATES, 'Коли?', 'Далі', (val) => {
      state.date = val;
      initPicker(TIMES, 'О котрій?', 'Готово', (timeVal) => {
        state.time = timeVal;
        openFinalScreen();
      });
    });
  }, 650);
}

function submitCustomPlan() {
  const input = document.getElementById('customPlanInput');
  const card = document.getElementById('customPlanCard');
  if (!input || !card) return;

  const idea = input.value.trim();
  if (!idea) {
    input.style.borderColor = '#ff6b81';
    input.focus();
    setTimeout(() => {
      input.style.borderColor = 'rgba(255,255,255,0.18)';
    }, 500);
    return;
  }

  selectPlan(card, `✨ ${idea}`, 'ідея від тебе');
}

const customPlanInput = document.getElementById('customPlanInput');
if (customPlanInput) {
  customPlanInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitCustomPlan();
    }
  });
}

function spawnSparkles(el) {
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = i % 2 === 0 ? '✨' : '🌙';
    s.style.left = rect.left + Math.random() * rect.width + 'px';
    s.style.top = rect.top + Math.random() * rect.height + 'px';
    s.style.setProperty('--dx', (Math.random() - 0.5) * 90 + 'px');
    s.style.setProperty('--dy', (-30 - Math.random() * 60) + 'px');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}

// --- ЕКРАН 5: БАРАБАН ---
function initPicker(items, title, btnLabel, onConfirm) {
  document.getElementById('pickerTitle').textContent = title;
  const btn = document.getElementById('pickerBtn');
  btn.textContent = btnLabel;

  const list = document.getElementById('pickerList');
  list.innerHTML = '';
  const defaultIdx = items.length > 1 ? 1 : 0;
  let selected = items[defaultIdx];

  items.forEach((text, idx) => {
    const div = document.createElement('div');
    div.className = 'picker-item' + (idx === defaultIdx ? ' active' : '');
    div.textContent = text;
    div.onclick = () => {
      list.scrollTo({ top: idx * 44, behavior: 'smooth' });
    };
    list.appendChild(div);
  });

  list.scrollTop = defaultIdx * 44;

  list.onscroll = () => {
    const index = Math.min(items.length - 1, Math.max(0, Math.round(list.scrollTop / 44)));
    document.querySelectorAll('.picker-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    if (items[index]) selected = items[index];
  };

  btn.onclick = () => onConfirm(selected);
}

// --- ЕКРАН 6: ПОРТРЕТ ІЗ СЕРДЕЧОК ---
function openFinalScreen() {
  goToScreen(6);
  document.getElementById('finalPlan').textContent = state.planTitle;
  document.getElementById('finalDateTime').textContent = `${state.date} · ${state.time}`;
  document.getElementById('finalSub').textContent = state.planDesc;
  initHeartPortrait();
}

function initHeartPortrait() {
  const canvas = document.getElementById('heartCanvas');
  const ctx = canvas.getContext('2d');
  const counterEl = document.getElementById('heartCounter');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  counterEl.textContent = 'завантажую фото...';

  const img = new Image();
  img.decoding = 'async';
  img.src = PORTRAIT_URL;

  img.onerror = () => {
    counterEl.textContent = 'Не вдалося завантажити фото';
  };

  img.onload = async () => {
    try {
      if (img.decode) {
        await img.decode();
      }
    } catch (_) {}

    const off = document.createElement('canvas');
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext('2d', { willReadFrequently: true });

    octx.fillStyle = '#000';
    octx.fillRect(0, 0, off.width, off.height);

    const imgRatio = img.width / img.height;
    const boxRatio = off.width / off.height;
    let drawW = off.width;
    let drawH = off.height;
    let drawX = 0;
    let drawY = 0;

    if (imgRatio > boxRatio) {
      drawW = off.height * imgRatio;
      drawX = (off.width - drawW) / 2;
    } else {
      drawH = off.width / imgRatio;
      drawY = (off.height - drawH) / 2;
    }

    octx.drawImage(img, drawX, drawY, drawW, drawH);
    const data = octx.getImageData(0, 0, off.width, off.height).data;

    const step = 3;
    const points = [];
    for (let y = step; y < off.height; y += step) {
      for (let x = step; x < off.width; x += step) {
        const px = Math.min(off.width - 1, Math.floor(x));
        const py = Math.min(off.height - 1, Math.floor(y));
        const idx = (py * off.width + px) * 4;
        const brightness = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        points.push({ x, y, b: brightness });
      }
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    points.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));

    let revealed = 0;
    const total = points.length;
    ctx.font = '4px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    function drawBatch() {
      if (revealed >= total) {
        counterEl.innerHTML = `Зібрав із <b>${total}</b> сердець наше фото , бо кожне з них нагадує про тебе, Кицюнь.`;
        return;
      }
      const batch = Math.ceil(total / 40);
      for (let i = 0; i < batch && revealed < total; i++, revealed++) {
        const p = points[revealed];
        let norm = p.b / 255;
        norm = norm < 0.5 ? 2 * norm * norm : 1 - Math.pow(-2 * norm + 2, 2) / 2;
        const alpha = Math.min(1, Math.max(0.12, norm));

        ctx.fillStyle = `rgba(248, 175, 188, ${alpha.toFixed(3)})`;
        ctx.fillText('♥', p.x, p.y);
      }
      counterEl.textContent = revealed;
      requestAnimationFrame(drawBatch);
    }

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      drawBatch();
    };
    document.getElementById('canvasBox').onclick = start;
    counterEl.textContent = 'натискай...';
    setTimeout(start, 800);
  };
}

function shareResult() {
  const text = `Я обрала: ${state.planTitle} (${state.date} о ${state.time}) 🤍`;
  if (navigator.share) {
    navigator.share({ title: 'Наша зустріч', text });
  } else {
    navigator.clipboard.writeText(text);
    alert('Скопійовано! Відправ мені:\n' + text);
  }
}
