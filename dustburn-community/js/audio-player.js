/**
 * DUSTBURN - Official Background Music Player HUD
 * Reproductor de música oficial con ecualizador de fuego
 */
(function() {
  const audio = document.getElementById('main-audio');
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const progressTrack = document.getElementById('progress-track');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');
  const eqBars = document.querySelectorAll('.eq-bar');

  if (!audio) return;

  let isPlaying = false;

  // Format seconds to mm:ss
  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Toggle Play / Pause
  function togglePlay() {
    if (audio.paused) {
      audio.play().then(() => {
        isPlaying = true;
        updatePlayState();
      }).catch(err => {
        console.log("Audio autoplay prevented, user interaction required:", err);
      });
    } else {
      audio.pause();
      isPlaying = false;
      updatePlayState();
    }
  }

  function updatePlayState() {
    if (!audio.paused) {
      playIcon.className = 'fas fa-pause';
      eqBars.forEach(bar => bar.classList.add('active'));
    } else {
      playIcon.className = 'fas fa-play';
      eqBars.forEach(bar => bar.classList.remove('active'));
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);

  // Time & Progress Update
  audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
  });

  // Click on progress bar to seek
  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      const rect = progressTrack.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * audio.duration;
    });
  }

  // Volume
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = parseFloat(e.target.value);
      audio.muted = false;
      updateVolumeIcon();
    });
  }

  // Mute
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      updateVolumeIcon();
    });
  }

  function updateVolumeIcon() {
    if (!muteIcon) return;
    if (audio.muted || audio.volume === 0) {
      muteIcon.className = 'fas fa-volume-mute';
    } else if (audio.volume < 0.5) {
      muteIcon.className = 'fas fa-volume-down';
    } else {
      muteIcon.className = 'fas fa-volume-up';
    }
  }

  // Auto loop
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
  });

  // Make globally available to window
  window.DustburnPlayer = {
    togglePlay,
    play: () => { audio.play(); updatePlayState(); },
    pause: () => { audio.pause(); updatePlayState(); }
  };
})();
