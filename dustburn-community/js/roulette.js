/**
 * DUSTBURN - Left 4 Dead 2 Stream Challenge Roulette
 * Ruleta interactiva de retos y castigos para partidas en stream
 */
(function() {
  const canvas = document.getElementById('canvas-roulette');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const spinBtn = document.getElementById('spin-roulette-btn');
  const resultText = document.getElementById('challenge-result-text');

  const challenges = [
    { text: '🔫 Solo Pistolas este mapa', color: '#ff4500' },
    { text: '💊 Cero Botiquines (Solo Píldoras)', color: '#d32f2f' },
    { text: '🔦 Prohibido usar Linterna', color: '#ff7b00' },
    { text: '👑 Dustburn Rushing con Escopeta', color: '#53fc18', textColor: '#000' },
    { text: '🩸 Sin disparar agachado (Modo Pro)', color: '#ffb300', textColor: '#000' },
    { text: '🏃 Prohibido quedarse quieto 3 seg', color: '#e51a24' },
    { text: '🧟 Hunter: Solo ataques de 25 daño', color: '#ff5722' },
    { text: '🎁 El primero en caer dona 1 Sub', color: '#9c27b0' }
  ];

  const numSegments = challenges.length;
  const arc = (2 * Math.PI) / numSegments;
  let currentAngle = 0;
  let isSpinning = false;

  function drawWheel() {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = centerX - 10;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < numSegments; i++) {
      const angle = currentAngle + i * arc;
      ctx.beginPath();
      ctx.fillStyle = challenges[i].color;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#121218';
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = challenges[i].textColor || '#ffffff';
      ctx.font = 'bold 12px Rajdhani, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(challenges[i].text.slice(0, 22), radius - 15, 4);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f0f14';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ff4500';
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Bebas Neue, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('L4D2', centerX, centerY + 4);
  }

  function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    if (window.L4D2Soundboard) {
      window.L4D2Soundboard.pipeBomb();
    }

    const spinRotations = 5 + Math.random() * 5; // 5 to 10 full spins
    const extraDegrees = Math.random() * 2 * Math.PI;
    const totalRotation = spinRotations * 2 * Math.PI + extraDegrees;
    const duration = 4000;
    const startTime = performance.now();
    const startAngle = currentAngle;

    function animateSpin(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      currentAngle = startAngle + totalRotation * ease;
      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        isSpinning = false;
        determineWinner();
      }
    }

    requestAnimationFrame(animateSpin);
  }

  function determineWinner() {
    const normalizedAngle = (3 * Math.PI / 2 - (currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const winningIndex = Math.floor(normalizedAngle / arc) % numSegments;
    const winningChallenge = challenges[winningIndex];

    if (resultText) {
      resultText.textContent = winningChallenge.text;
      resultText.style.animation = 'none';
      resultText.offsetHeight; // trigger reflow
      resultText.style.animation = 'flame-pulse 1s 2';
    }

    if (window.L4D2Soundboard) {
      window.L4D2Soundboard.safehouseVictory();
    }

    if (window.DustburnApp) {
      window.DustburnApp.showToast(`🎯 ¡Reto de la Ruleta: ${winningChallenge.text}!`);
    }
  }

  if (spinBtn) {
    spinBtn.addEventListener('click', spinWheel);
  }

  drawWheel();
})();
