/**
 * DUSTBURN - Left 4 Dead 2 Web Audio Soundboard
 * Generador de efectos de sonido sintetizados icónicos de L4D2
 */
(function() {
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play synthesized sounds
  const SoundEffects = {
    // 1. Pipe Bomb: Beep beep beep BOOM
    pipeBomb: function() {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Accelerating beeps
      const beepIntervals = [0, 0.3, 0.55, 0.75, 0.9, 1.0, 1.08, 1.15];
      beepIntervals.forEach(t => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now + t);
        gain.gain.setValueAtTime(0.3, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.07);
      });

      // Explosion at 1.25s
      const boomTime = now + 1.22;
      const bufferSize = ctx.sampleRate * 1.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, boomTime);
      filter.frequency.exponentialRampToValueAtTime(80, boomTime + 1.2);

      const boomGain = ctx.createGain();
      boomGain.gain.setValueAtTime(0.8, boomTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 1.4);

      whiteNoise.connect(filter);
      filter.connect(boomGain);
      boomGain.connect(ctx.destination);

      whiteNoise.start(boomTime);
      whiteNoise.stop(boomTime + 1.5);
    },

    // 2. Tank Alert: Heavy menacing staccato brass chords
    tankAlert: function() {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const notes = [110, 138.59, 164.81, 220]; // A2, C#3, E3, A3
      notes.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      });
    },

    // 3. Witch Cry: Eerie high-frequency weeping vibrato
    witchCry: function() {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.5);
      osc.frequency.linearRampToValueAtTime(750, now + 1.2);

      // Tremolo
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 9; // Vibrato
      lfoGain.gain.value = 60;
      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + 1.5);
      osc.stop(now + 1.5);
    },

    // 4. Hunter Scream / Pounce
    hunterScream: function() {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.8);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    },

    // 5. Horde Incoming (Siren alarm + roar)
    hordeIncoming: function() {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Two-tone siren
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(680, now + 0.4);
      osc.frequency.linearRampToValueAtTime(520, now + 0.8);
      osc.frequency.linearRampToValueAtTime(680, now + 1.2);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    },

    // 6. Shotgun Blast + Pump
    shotgunBlast: function() {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Gunshot noise
      const bufferSize = ctx.sampleRate * 0.4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.45);

      // Pump action click (after 0.5s)
      const pumpTime = now + 0.5;
      const pumpOsc = ctx.createOscillator();
      const pumpGain = ctx.createGain();
      pumpOsc.type = 'triangle';
      pumpOsc.frequency.setValueAtTime(350, pumpTime);
      pumpOsc.frequency.exponentialRampToValueAtTime(150, pumpTime + 0.1);
      pumpGain.gain.setValueAtTime(0.4, pumpTime);
      pumpGain.gain.exponentialRampToValueAtTime(0.001, pumpTime + 0.12);

      pumpOsc.connect(pumpGain);
      pumpGain.connect(ctx.destination);
      pumpOsc.start(pumpTime);
      pumpOsc.stop(pumpTime + 0.15);
    },

    // 7. Pills Here! (Chime / Healing pickup)
    pillsHere: function() {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const notes = [587.33, 880, 1174.66]; // D5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.35, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.5);
      });
    },

    // 8. Safehouse Victory Fanfare
    safehouseVictory: function() {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const notes = [
        { f: 440, d: 0.15 },
        { f: 554.37, d: 0.15 },
        { f: 659.25, d: 0.2 },
        { f: 880, d: 0.5 }
      ];

      let elapsed = 0;
      notes.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, now + elapsed);

        gain.gain.setValueAtTime(0.4, now + elapsed);
        gain.gain.exponentialRampToValueAtTime(0.001, now + elapsed + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + elapsed);
        osc.stop(now + elapsed + item.d + 0.05);

        elapsed += item.d;
      });
    }
  };

  // Attach click listeners to all sound buttons
  document.addEventListener('DOMContentLoaded', () => {
    const soundButtons = document.querySelectorAll('.sound-btn');
    soundButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const soundKey = btn.dataset.sound;
        if (SoundEffects[soundKey]) {
          SoundEffects[soundKey]();
          btn.classList.add('playing');
          setTimeout(() => btn.classList.remove('playing'), 600);
          
          if (window.DustburnApp && window.DustburnApp.showToast) {
            window.DustburnApp.showToast(`🔊 Sonido L4D2: ${btn.querySelector('.sound-label').innerText}`);
          }
        }
      });
    });
  });

  window.L4D2Soundboard = SoundEffects;
})();
