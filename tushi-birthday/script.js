(() => {
  const config = window.BIRTHDAY_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const welcome = $('#welcome');
  const experience = $('#experience');
  const music = $('#backgroundMusic');
  let hasOpened = false;

  // Apply the editable personalization from config.js.
  const name = config.herName || 'Tushi';
  $('#brandName').textContent = name;
  $('#footerName').textContent = name;
  document.title = `For ${name}, with love`;
  $('#heroSubtitle').textContent = config.birthdaySubtitle || '';
  if (config.birthday) {
    const birthday = new Date(`${config.birthday}T00:00:00`);
    if (!Number.isNaN(birthday.getTime())) {
      $('#birthdayDate').textContent = birthday.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    }
  }
  const message = config.mainBirthdayMessage || ['Happy Birthday,', 'My Love'];
  $('#birthdayHeading').innerHTML = `${message[0]}<br /><em>${message[1]}</em> <span class="red-heart">♥</span>`;
  $('#letterGreeting').textContent = config.letterGreeting || `My dearest ${name},`;
  $('#letterCopy').textContent = config.letter || '';
  const personalSignoff = config.signoff || '';
  const signoffText = config.yourName && config.yourName !== 'yours'
    ? personalSignoff.replace(/yours/gi, config.yourName)
    : personalSignoff;
  const signoffElement = $('#letterSignoff');
  signoffElement.textContent = '';
  $('#finalMessage').textContent = config.finalMessage || '';
  const reasonGrid = $('#reasonGrid');
  (config.reasons || []).forEach((reason) => {
    const card = document.createElement('article');
    card.className = 'reason-card reveal-on';
    card.innerHTML = '<span aria-hidden="true">♡</span>';
    const text = document.createElement('p');
    text.textContent = reason;
    card.append(text);
    reasonGrid.append(card);
  });
  const cards = [...document.querySelectorAll('.memory-card')];
  (config.photos || []).forEach((photo, index) => {
    const card = cards[index];
    if (!card) return;
    card.dataset.photo = photo.path;
    card.dataset.caption = photo.caption || '';
    card.querySelector('img').src = photo.path;
    card.querySelector('span').textContent = photo.caption || '';
  });

  // A little ambient motion, kept sparse and disabled for reduced-motion visitors.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heartField = $('#ambientHearts');
  function addFloatingHeart() {
    if (reducedMotion || document.hidden) return;
    const heart = document.createElement('span');
    heart.className = 'particle';
    heart.textContent = Math.random() > .5 ? '♥' : '✦';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.setProperty('--dur', `${10 + Math.random() * 8}s`);
    heart.style.setProperty('--size', `${10 + Math.random() * 12}px`);
    heartField.append(heart);
    window.setTimeout(() => heart.remove(), 19000);
  }
  window.setInterval(addFloatingHeart, 1500);

  function confetti(amount = 95) {
    if (reducedMotion) return;
    const colors = ['#e999ab', '#f4cf9c', '#c8b9df', '#f8e7eb', '#c77e94'];
    for (let i = 0; i < amount; i += 1) {
      const bit = document.createElement('span');
      bit.className = 'confetti';
      bit.style.setProperty('--x', `${Math.random() * 100}vw`);
      bit.style.setProperty('--color', colors[i % colors.length]);
      bit.style.setProperty('--fall', `${2.5 + Math.random() * 2.4}s`);
      bit.style.setProperty('--rot', `${Math.random() * 180}deg`);
      bit.style.setProperty('--drift', `${Math.random() * 220 - 110}px`);
      document.body.append(bit);
      window.setTimeout(() => bit.remove(), 5100);
    }
  }
  function heartBurst(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    if (reducedMotion) return;
    for (let i = 0; i < 30; i += 1) {
      const heart = document.createElement('span');
      heart.className = 'heart-confetti';
      heart.textContent = i % 4 === 0 ? '✦' : '♥';
      heart.style.setProperty('--x', `${x}px`);
      heart.style.setProperty('--y', `${y}px`);
      heart.style.setProperty('--dx', `${Math.cos((Math.PI * 2 * i) / 30) * (70 + Math.random() * 140)}px`);
      heart.style.setProperty('--dy', `${Math.sin((Math.PI * 2 * i) / 30) * (70 + Math.random() * 140)}px`);
      heart.style.setProperty('--size', `${10 + Math.random() * 14}px`);
      document.body.append(heart);
      window.setTimeout(() => heart.remove(), 2100);
    }
  }

  $('#openSurprise').addEventListener('click', () => {
    hasOpened = true;
    welcome.classList.add('is-gone');
    experience.classList.add('ready');
    experience.setAttribute('aria-hidden', 'false');
    $('#musicControls').classList.add('visible');
    if (!reducedMotion) {
      confetti(80);
      heartBurst(window.innerWidth / 2, window.innerHeight * .62);
    }
    window.setTimeout(() => welcome.remove(), 1100);
  });

  $('#cakeButton').addEventListener('click', (event) => {
    const cake = event.currentTarget;
    if (cake.classList.contains('blown')) return;
    cake.classList.add('blown');
    $('#candleHint').textContent = 'wish made. it’s going to come true ♥';
    confetti(120);
    const rect = cake.getBoundingClientRect();
    heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  let typingTimer;
  let signatureDelay;
  $('#letterOpen').addEventListener('click', () => {
    const card = $('#letterCard');
    const isOpening = !card.classList.contains('open');
    card.classList.toggle('open', isOpening);
    card.setAttribute('aria-hidden', String(!isOpening));
    $('#letterOpen').innerHTML = isOpening ? '<span>✉</span> Close my heart <b>♥</b>' : '<span>✉</span> Read my heart <b>♥</b>';
    window.clearInterval(typingTimer);
    window.clearTimeout(signatureDelay);
    signoffElement.classList.remove('typing');
    const target = config.letter || '';
    if (isOpening) {
      $('#letterCopy').textContent = '';
      signoffElement.textContent = '';
      if (reducedMotion) {
        $('#letterCopy').textContent = target;
        signoffElement.textContent = signoffText;
        return;
      }
      let i = 0;
      typingTimer = window.setInterval(() => {
        i = Math.min(i + 2, target.length);
        $('#letterCopy').textContent = target.slice(0, i);
        if (i >= target.length) {
          window.clearInterval(typingTimer);
          signatureDelay = window.setTimeout(() => {
            let j = 0;
            signoffElement.classList.add('typing');
            typingTimer = window.setInterval(() => {
              j = Math.min(j + 2, signoffText.length);
              signoffElement.textContent = signoffText.slice(0, j);
              if (j >= signoffText.length) {
                window.clearInterval(typingTimer);
                signoffElement.classList.remove('typing');
              }
            }, 18);
          }, 350);
        }
      }, 18);
    } else {
      $('#letterCopy').textContent = '';
      signoffElement.textContent = '';
    }
  });

  const lightbox = $('#lightbox');
  function closeLightbox() { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  cards.forEach((card) => card.addEventListener('click', () => {
    $('#lightboxImage').src = card.dataset.photo;
    $('#lightboxImage').alt = card.querySelector('img').alt;
    $('#lightboxCaption').textContent = card.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('#lightboxClose').focus();
  }));
  $('#lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });

  $('#heartReveal').addEventListener('click', (event) => {
    const text = $('#heartMessage');
    const isOpen = text.textContent.length > 0;
    text.textContent = isOpen ? '' : (config.heartMessage || 'You are my favourite person. ♥');
    if (!isOpen) heartBurst(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2);
  });

  function playBirthdayChant() {
    music.loop = false;
    void playConfiguredSong(true);
  }
  $('#envelope').addEventListener('click', (event) => {
    const envelope = event.currentTarget;
    const opened = envelope.classList.toggle('open');
    const band = $('#bandReveal');
    band.classList.toggle('visible', opened);
    band.setAttribute('aria-hidden', String(!opened));
    envelope.setAttribute('aria-label', opened ? 'Close the birthday band surprise' : 'Open the birthday band surprise');
    envelope.querySelector('.env-label').textContent = opened ? 'close the surprise' : 'open the surprise';
    if (opened) {
      playBirthdayChant();
      heartBurst(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2);
    } else {
      music.pause();
      music.currentTime = 0;
      $('#chantLine').textContent = '';
      $('#chantLine').classList.add('hidden');
      musicControl.classList.remove('playing');
      musicLabel.textContent = config.musicTitle || 'music';
      musicControl.setAttribute('aria-label', 'Play background music');
    }
  });
  $('#chantAgain').addEventListener('click', () => {
    music.loop = false;
    void playConfiguredSong(true);
    const rect = $('#bandCircle').getBoundingClientRect();
    heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  $('#finalButton').addEventListener('click', (event) => {
    $('#finalResult').textContent = 'Happy birthday, my love. Here’s to every tomorrow together. ♥';
    confetti(170);
    heartBurst(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2);
  });

  const startDate = new Date(config.relationshipStart || '');
  const counterFoot = $('#counterFoot');
  if (Number.isNaN(startDate.getTime())) {
    counterFoot.textContent = 'Set your special date in config.js to start the counter.';
  } else {
    function updateCounter() {
      let seconds = Math.max(0, Math.floor((Date.now() - startDate.getTime()) / 1000));
      const days = Math.floor(seconds / 86400); seconds %= 86400;
      const hours = Math.floor(seconds / 3600); seconds %= 3600;
      const minutes = Math.floor(seconds / 60); seconds %= 60;
      $('#days').textContent = days.toLocaleString();
      $('#hours').textContent = String(hours).padStart(2, '0');
      $('#minutes').textContent = String(minutes).padStart(2, '0');
      $('#seconds').textContent = String(seconds).padStart(2, '0');
    }
    counterFoot.textContent = `since ${startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`;
    updateCounter();
    window.setInterval(updateCounter, 1000);
  }

  const musicControl = $('#musicControl');
  const musicLabel = $('#musicLabel');
  const musicMute = $('#musicMute');
  if (config.musicFile) music.src = config.musicFile;
  else { musicControl.title = 'Add a song path in config.js'; musicLabel.textContent = config.musicTitle || 'add song'; }
  async function playConfiguredSong(restart = false) {
    if (!config.musicFile) { musicLabel.textContent = 'add song in config'; return; }
    if (restart) music.currentTime = 0;
    try {
      await music.play();
      $('#chantLine').textContent = '♫';
      $('#chantLine').classList.remove('hidden');
      musicControl.classList.add('playing');
      musicLabel.textContent = config.musicTitle || 'playing';
      musicControl.setAttribute('aria-label', 'Pause background music');
    } catch { musicLabel.textContent = 'tap to retry'; }
  }
  musicControl.addEventListener('click', async () => {
    if (!config.musicFile) { musicLabel.textContent = 'add song in config'; return; }
    if (music.paused) await playConfiguredSong();
    else {
      music.pause(); musicControl.classList.remove('playing'); musicLabel.textContent = config.musicTitle || 'music'; musicControl.setAttribute('aria-label', 'Play background music');
    }
  });
  musicMute.addEventListener('click', () => {
    music.muted = !music.muted;
    musicMute.textContent = music.muted ? '◖×' : '◖';
    musicMute.setAttribute('aria-label', music.muted ? 'Unmute background music' : 'Mute background music');
  });
  music.addEventListener('pause', () => {
    $('#chantLine').textContent = '';
    $('#chantLine').classList.add('hidden');
  });
  music.addEventListener('ended', () => {
    musicControl.classList.remove('playing');
    $('#chantLine').textContent = '';
    $('#chantLine').classList.add('hidden');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: .12 });
  document.querySelectorAll('.reason-card').forEach((element) => observer.observe(element));
})();
