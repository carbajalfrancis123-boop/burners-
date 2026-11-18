/**
 * DUSTBURN - Left 4 Dead 2 Matchmaking & Lobby Queue
 * Sistema interactivo de salas y lista de espera para jugar en directo
 */
(function() {
  const STORAGE_KEY = 'dustburn_lobbies_data';

  // Initial preset lobbies
  const defaultLobbies = [
    {
      id: 'lobby_1',
      title: '🔥 Versus Estelar: Dustburn vs Burners',
      mode: 'versus',
      modeLabel: 'Versus 4v4',
      campaign: 'Dark Carnival (Feria Siniestra)',
      difficulty: 'Normal',
      serverIp: 'connect 190.113.88.24:27015; password burners',
      status: 'open',
      slots: {
        survivors: [
          { name: 'Dustburn 👑', role: 'Streamer / Lead', steamId: 'dustburn_official', avatar: 'assets/dustburn_logo.webp' },
          { name: 'Burner_Sniper', role: 'Francotirador', steamId: '765611980001', avatar: '' },
          { name: 'Coach_Master', role: 'Soporte / Botiquín', steamId: '765611980002', avatar: '' },
          null
        ],
        infected: [
          { name: 'Hunter_King', role: 'Hunter Main', steamId: '765611980003', avatar: '' },
          { name: 'Tank_Destroyer', role: 'Tank Main', steamId: '765611980004', avatar: '' },
          null,
          null
        ]
      },
      queue: ['El_Jockey_99', 'Rochelle_Pro', 'Bile_Master']
    },
    {
      id: 'lobby_2',
      title: '💀 Campaña Experto Realismo',
      mode: 'campaign',
      modeLabel: 'Campaña 4P',
      campaign: 'No Mercy (Alta Médica)',
      difficulty: 'Experto Realismo',
      serverIp: 'connect 185.220.100.12:27015',
      status: 'open',
      slots: {
        survivors: [
          { name: 'Bill_Legend', role: 'Rifle M16', steamId: '765611980010', avatar: '' },
          { name: 'Zoey_L4D', role: 'Sniper Hunter', steamId: '765611980011', avatar: '' },
          null,
          null
        ],
        infected: []
      },
      queue: []
    },
    {
      id: 'lobby_3',
      title: '⏱️ Supervivencia Récord: Gasolinera',
      mode: 'survival',
      modeLabel: 'Survival',
      campaign: 'The Passing (Defensa Portón)',
      difficulty: 'Extremo',
      serverIp: 'connect 45.235.98.11:27015',
      status: 'open',
      slots: {
        survivors: [
          { name: 'Francis_Hater', role: 'Escopeta Auto', steamId: '765611980020', avatar: '' },
          null,
          null,
          null
        ],
        infected: []
      },
      queue: []
    }
  ];

  let lobbies = [];

  function loadLobbies() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        lobbies = JSON.parse(data);
      } else {
        lobbies = defaultLobbies;
        saveLobbies();
      }
    } catch (e) {
      lobbies = defaultLobbies;
    }
  }

  function saveLobbies() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lobbies));
  }

  function renderLobbies() {
    const container = document.getElementById('lobbies-container');
    if (!container) return;

    container.innerHTML = '';

    if (lobbies.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
          <i class="fas fa-gamepad" style="font-size: 3rem; margin-bottom: 12px; color: var(--fire-primary);"></i>
          <h3>No hay salas activas en este momento</h3>
          <p>Crea una nueva partida usando el botón "+ Crear Sala de Partida"</p>
        </div>
      `;
      return;
    }

    lobbies.forEach(lobby => {
      const totalSlots = lobby.mode === 'versus' ? 8 : 4;
      const occupiedSurvivors = lobby.slots.survivors.filter(Boolean).length;
      const occupiedInfected = (lobby.slots.infected || []).filter(Boolean).length;
      const totalOccupied = occupiedSurvivors + occupiedInfected;
      const isFull = totalOccupied >= totalSlots;

      const card = document.createElement('div');
      card.className = `lobby-card ${lobby.mode}`;
      card.id = `card-${lobby.id}`;

      let badgeClass = 'badge-campaign';
      if (lobby.mode === 'versus') badgeClass = 'badge-versus';
      if (lobby.mode === 'survival') badgeClass = 'badge-survival';

      card.innerHTML = `
        <div class="lobby-top">
          <span class="lobby-mode-badge ${badgeClass}">${lobby.modeLabel}</span>
          <span class="lobby-status ${isFull ? 'status-full' : 'status-open'}">
            <i class="fas fa-circle" style="font-size: 0.6rem;"></i> ${isFull ? '¡SALA LLENA!' : `Slots: ${totalOccupied}/${totalSlots}`}
          </span>
        </div>

        <h3 class="lobby-title">${escapeHTML(lobby.title)}</h3>
        <div class="lobby-meta">
          <span><i class="fas fa-map-marked-alt text-fire"></i> ${escapeHTML(lobby.campaign)}</span>
          <span><i class="fas fa-skull"></i> ${escapeHTML(lobby.difficulty)}</span>
        </div>

        <div class="slots-wrapper">
          <div class="team-header team-survivors">
            <span><i class="fas fa-shield-alt"></i> Supervivientes (${occupiedSurvivors}/${lobby.slots.survivors.length})</span>
          </div>
          <div class="slots-grid">
            ${lobby.slots.survivors.map((slot, idx) => renderSlotItem(lobby.id, 'survivors', idx, slot)).join('')}
          </div>

          ${lobby.mode === 'versus' ? `
            <div class="team-header team-infected" style="margin-top: 10px;">
              <span><i class="fas fa-biohazard"></i> Infectados (${occupiedInfected}/${lobby.slots.infected.length})</span>
            </div>
            <div class="slots-grid">
              ${lobby.slots.infected.map((slot, idx) => renderSlotItem(lobby.id, 'infected', idx, slot)).join('')}
            </div>
          ` : ''}

          <div class="queue-box">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong><i class="fas fa-users-cog"></i> Cola de Espera / Banca (${lobby.queue.length})</strong>
              <button class="slot-btn-join" onclick="L4D2Lobbies.joinQueue('${lobby.id}')">+ Anotarme a la Banca</button>
            </div>
            <div class="queue-pills">
              ${lobby.queue.length > 0 
                ? lobby.queue.map(q => `<span class="queue-pill">${escapeHTML(q)}</span>`).join('') 
                : '<span style="color: var(--text-dim); font-size: 0.75rem;">Nadie en banca por ahora</span>'
              }
            </div>
          </div>
        </div>

        ${lobby.serverIp ? `
          <div class="server-ip-box">
            <span><i class="fas fa-terminal"></i> ${escapeHTML(lobby.serverIp)}</span>
            <button class="copy-ip-btn" onclick="L4D2Lobbies.copyText('${lobby.serverIp}', '¡IP / Comando de conexión copiado!')" title="Copiar comando">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        ` : ''}

        <div class="lobby-card-footer">
          <button class="btn btn-outline-fire" style="font-size: 0.8rem; padding: 6px 12px;" onclick="L4D2Lobbies.shuffleTeams('${lobby.id}')" title="Sorteo aleatorio de equipos">
            <i class="fas fa-random"></i> Sortear Equipos
          </button>
          <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 6px 12px;" onclick="L4D2Lobbies.copyRosterForChat('${lobby.id}')" title="Copiar equipos para el chat de Kick">
            <i class="fas fa-share-square"></i> Copiar a Kick
          </button>
          <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 6px 12px; margin-left: auto; color: #ff5252;" onclick="L4D2Lobbies.deleteLobby('${lobby.id}')" title="Eliminar sala">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    // Update global counter
    const activePartidasCount = document.getElementById('stat-active-matches');
    if (activePartidasCount) activePartidasCount.textContent = lobbies.length;
  }

  function renderSlotItem(lobbyId, team, index, slot) {
    if (slot) {
      return `
        <div class="slot-item occupied ${team === 'infected' ? 'infected' : ''}">
          <div class="slot-user">
            <div class="slot-avatar">
              ${slot.avatar ? `<img src="${slot.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : '<i class="fas fa-user"></i>'}
            </div>
            <div>
              <div class="slot-name" title="${escapeHTML(slot.name)}">${escapeHTML(slot.name)}</div>
              <div class="slot-role">${escapeHTML(slot.role || 'Jugador')}</div>
            </div>
          </div>
          <button class="slot-btn-leave" onclick="L4D2Lobbies.leaveSlot('${lobbyId}', '${team}', ${index})" title="Abandonar slot">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
    } else {
      return `
        <div class="slot-item">
          <span style="color: var(--text-dim);"><i class="fas fa-plus-circle"></i> Slot Libre</span>
          <button class="slot-btn-join" onclick="L4D2Lobbies.claimSlot('${lobbyId}', '${team}', ${index})">Unirme</button>
        </div>
      `;
    }
  }

  // Claim a slot
  function claimSlot(lobbyId, team, index) {
    const currentBurner = getCurrentBurner();
    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) return;

    let playerName = currentBurner ? currentBurner.nick : prompt('Ingresa tu Nickname o Gamertag para la partida:');
    if (!playerName || !playerName.trim()) return;

    lobby.slots[team][index] = {
      name: playerName.trim(),
      role: currentBurner ? currentBurner.role : 'Superviviente',
      steamId: currentBurner ? currentBurner.steamId : '',
      avatar: currentBurner ? currentBurner.avatar : ''
    };

    saveLobbies();
    renderLobbies();
    if (window.DustburnApp) {
      window.DustburnApp.showToast(`🔥 ¡${playerName} se unió a la partida!`);
    }
  }

  // Leave slot
  function leaveSlot(lobbyId, team, index) {
    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) return;

    const removed = lobby.slots[team][index];
    lobby.slots[team][index] = null;

    // If there is someone in the queue, automatically advance them!
    if (lobby.queue.length > 0) {
      const nextInLine = lobby.queue.shift();
      lobby.slots[team][index] = {
        name: nextInLine,
        role: 'Desde la Banca',
        steamId: '',
        avatar: ''
      };
      if (window.DustburnApp) {
        window.DustburnApp.showToast(`🚀 ¡${nextInLine} entró desde la banca!`);
      }
    }

    saveLobbies();
    renderLobbies();
  }

  // Join queue
  function joinQueue(lobbyId) {
    const currentBurner = getCurrentBurner();
    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) return;

    let playerName = currentBurner ? currentBurner.nick : prompt('Ingresa tu Nickname para la lista de espera:');
    if (!playerName || !playerName.trim()) return;

    if (!lobby.queue.includes(playerName.trim())) {
      lobby.queue.push(playerName.trim());
      saveLobbies();
      renderLobbies();
      if (window.DustburnApp) {
        window.DustburnApp.showToast(`📋 ¡${playerName} anotado en la banca!`);
      }
    }
  }

  // Shuffle teams for Versus
  function shuffleTeams(lobbyId) {
    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby || lobby.mode !== 'versus') {
      if (window.DustburnApp) window.DustburnApp.showToast('El sorteo es para partidas en modo Versus');
      return;
    }

    // Collect all players
    const allPlayers = [...lobby.slots.survivors, ...lobby.slots.infected].filter(Boolean);
    if (allPlayers.length < 2) {
      if (window.DustburnApp) window.DustburnApp.showToast('Se necesitan al menos 2 jugadores para sortear');
      return;
    }

    // Fisher-Yates shuffle
    for (let i = allPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPlayers[i], allPlayers[j]] = [allPlayers[j], allPlayers[i]];
    }

    // Reset slots
    lobby.slots.survivors = [null, null, null, null];
    lobby.slots.infected = [null, null, null, null];

    allPlayers.forEach((p, idx) => {
      if (idx % 2 === 0 && lobby.slots.survivors.includes(null)) {
        const slotIdx = lobby.slots.survivors.indexOf(null);
        lobby.slots.survivors[slotIdx] = p;
      } else if (lobby.slots.infected.includes(null)) {
        const slotIdx = lobby.slots.infected.indexOf(null);
        lobby.slots.infected[slotIdx] = p;
      } else {
        const slotIdx = lobby.slots.survivors.indexOf(null);
        if (slotIdx !== -1) lobby.slots.survivors[slotIdx] = p;
      }
    });

    saveLobbies();
    renderLobbies();
    if (window.DustburnApp) {
      window.DustburnApp.showToast('🎲 ¡Equipos sorteados y balanceados!');
    }
  }

  // Copy Roster for Kick chat
  function copyRosterForChat(lobbyId) {
    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) return;

    let text = `🔥 PARTIDA DUSTBURN [${lobby.title}] 🔥\n`;
    text += `🗺️ Mapa: ${lobby.campaign} (${lobby.difficulty})\n`;
    text += `🛡️ Supervivientes: ` + lobby.slots.survivors.map(s => s ? s.name : '[Libre]').join(', ') + '\n';
    if (lobby.mode === 'versus') {
      text += `👹 Infectados: ` + lobby.slots.infected.map(s => s ? s.name : '[Libre]').join(', ') + '\n';
    }
    if (lobby.queue.length > 0) {
      text += `⏳ Banca: ` + lobby.queue.join(', ') + '\n';
    }
    if (lobby.serverIp) {
      text += `💻 Servidor: ${lobby.serverIp}\n`;
    }
    text += `¡Únanse en kick.com/dustburnn!`;

    copyText(text, '📋 ¡Alineación copiada para pegar en el chat de Kick!');
  }

  // Create new lobby
  function createLobby(formData) {
    const newLobby = {
      id: 'lobby_' + Date.now(),
      title: formData.title || 'Partida de Comunidad Burners',
      mode: formData.mode || 'versus',
      modeLabel: formData.mode === 'versus' ? 'Versus 4v4' : formData.mode === 'campaign' ? 'Campaña 4P' : 'Supervivencia',
      campaign: formData.campaign || 'Campaña Aleatoria',
      difficulty: formData.difficulty || 'Normal',
      serverIp: formData.serverIp || '',
      status: 'open',
      slots: {
        survivors: formData.mode === 'versus' ? [null, null, null, null] : [null, null, null, null],
        infected: formData.mode === 'versus' ? [null, null, null, null] : []
      },
      queue: []
    };

    lobbies.unshift(newLobby);
    saveLobbies();
    renderLobbies();
    if (window.DustburnApp) {
      window.DustburnApp.showToast('✅ ¡Nueva sala de partida creada!');
    }
  }

  function deleteLobby(lobbyId) {
    if (confirm('¿Deseas eliminar esta sala de partida?')) {
      lobbies = lobbies.filter(l => l.id !== lobbyId);
      saveLobbies();
      renderLobbies();
      if (window.DustburnApp) {
        window.DustburnApp.showToast('🗑️ Sala eliminada');
      }
    }
  }

  function copyText(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
      if (window.DustburnApp) {
        window.DustburnApp.showToast(successMsg || '¡Texto copiado al portapapeles!');
      }
    }).catch(() => {
      prompt('Copia manualmente:', text);
    });
  }

  function getCurrentBurner() {
    try {
      const data = localStorage.getItem('dustburn_current_user');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadLobbies();
    renderLobbies();
  });

  window.L4D2Lobbies = {
    claimSlot,
    leaveSlot,
    joinQueue,
    shuffleTeams,
    copyRosterForChat,
    createLobby,
    deleteLobby,
    copyText,
    renderLobbies
  };
})();
