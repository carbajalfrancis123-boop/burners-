/**
 * DUSTBURN - Burners Community Roster & Registration System
 * Registro de miembros de la comunidad con persistencia en LocalStorage
 */
(function() {
  const STORAGE_KEY = 'dustburn_burners_members';
  const CURRENT_USER_KEY = 'dustburn_current_user';

  // Default initial members of the Burners community
  const defaultMembers = [
    {
      id: 'burner_dustburn',
      nick: 'Dustburn 👑',
      steamId: 'https://steamcommunity.com/id/dustburnn',
      discord: 'dustburnn#0001',
      role: 'Streamer / Lead',
      favChar: 'Francis',
      hours: '3,500 hrs',
      kickRank: 'Streamer',
      motto: '¡Bienvenidos a la llama del Left 4 Dead 2!',
      avatar: 'assets/dustburn_logo.webp'
    },
    {
      id: 'burner_mod1',
      nick: 'BurnerMod_L4D',
      steamId: 'https://steamcommunity.com/profiles/76561198012345678',
      discord: 'burnermod#4421',
      role: 'Moderador / Tanque',
      favChar: 'Coach',
      hours: '2,100 hrs',
      kickRank: 'Moderador',
      motto: 'Controlando el lobby y repartiendo escopetazos.',
      avatar: ''
    },
    {
      id: 'burner_snip',
      nick: 'ZoeyHeadshot',
      steamId: 'https://steamcommunity.com/profiles/76561198087654321',
      discord: 'zoey_hs#1337',
      role: 'Francotirador',
      favChar: 'Zoey',
      hours: '1,450 hrs',
      kickRank: 'Sub VIP',
      motto: 'Hunter que salta, hunter que cae.',
      avatar: ''
    },
    {
      id: 'burner_hunter',
      nick: 'NightHunter_PE',
      steamId: 'https://steamcommunity.com/id/nighthunter_pe',
      discord: 'nighthunter#9999',
      role: 'Infectado Especial',
      favChar: 'Hunter / Jockey',
      hours: '1,890 hrs',
      kickRank: 'Sub VIP',
      motto: '25 de daño desde el techo más alto.',
      avatar: ''
    },
    {
      id: 'burner_medic',
      nick: 'Dr_Adrenalina',
      steamId: 'https://steamcommunity.com/id/dradrenalina',
      discord: 'adrenalina#5522',
      role: 'Soporte / Medic',
      favChar: 'Ellis',
      hours: '980 hrs',
      kickRank: 'Seguidor',
      motto: 'Píldoras y botiquines para todo el equipo.',
      avatar: ''
    },
    {
      id: 'burner_rusher',
      nick: 'ShotgunFiend',
      steamId: 'https://steamcommunity.com/id/shotgunfiend',
      discord: 'shotgun_king#2024',
      role: 'Rushing Shotgun',
      favChar: 'Bill',
      hours: '2,800 hrs',
      kickRank: 'Seguidor',
      motto: 'Frente en alto, nunca retroceder.',
      avatar: ''
    }
  ];

  let members = [];
  let currentFilter = 'all';
  let searchQuery = '';

  function loadMembers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        members = JSON.parse(data);
      } else {
        members = defaultMembers;
        saveMembers();
      }
    } catch (e) {
      members = defaultMembers;
    }
  }

  function saveMembers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }

  function renderMembers() {
    const grid = document.getElementById('burners-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = members.filter(m => {
      // Role filter
      if (currentFilter === 'streamer' && m.kickRank !== 'Streamer') return false;
      if (currentFilter === 'mods' && m.kickRank !== 'Moderador') return false;
      if (currentFilter === 'vips' && m.kickRank !== 'Sub VIP') return false;
      if (currentFilter === 'infected' && !m.role.toLowerCase().includes('infectad') && !m.role.toLowerCase().includes('hunter') && !m.role.toLowerCase().includes('tank')) return false;
      if (currentFilter === 'survivors' && (m.role.toLowerCase().includes('infectad') || m.role.toLowerCase().includes('hunter'))) return false;

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNick = m.nick.toLowerCase().includes(q);
        const matchRole = m.role.toLowerCase().includes(q);
        const matchChar = (m.favChar || '').toLowerCase().includes(q);
        return matchNick || matchRole || matchChar;
      }
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 35px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
          <i class="fas fa-user-slash" style="font-size: 2.5rem; margin-bottom: 10px; color: var(--fire-primary);"></i>
          <h4>No se encontraron Burners con esos criterios</h4>
          <p>Prueba con otra búsqueda o sé el primero en registrarte</p>
        </div>
      `;
      return;
    }

    filtered.forEach(m => {
      const card = document.createElement('div');
      card.className = `burner-card ${m.kickRank === 'Streamer' ? 'streamer' : ''}`;

      let roleBadgeClass = 'role-burner';
      if (m.kickRank === 'Streamer') roleBadgeClass = 'role-streamer';
      else if (m.kickRank === 'Moderador') roleBadgeClass = 'role-mod';

      const avatarSrc = m.avatar || 'assets/dustburn_logo.webp';

      card.innerHTML = `
        <span class="burner-badge-role ${roleBadgeClass}">${escapeHTML(m.kickRank || 'Burner')}</span>

        <div class="burner-profile-head">
          <img src="${avatarSrc}" alt="${escapeHTML(m.nick)}" class="burner-avatar" onerror="this.src='assets/dustburn_logo.webp'">
          <div class="burner-names">
            <h4>${escapeHTML(m.nick)}</h4>
            <span><i class="fab fa-discord" style="color: #7289da;"></i> ${escapeHTML(m.discord || 'No especificado')}</span>
          </div>
        </div>

        <div class="burner-stats-row">
          <div class="burner-stat-mini">
            <span class="label">Rol</span>
            <span class="val">${escapeHTML(m.role)}</span>
          </div>
          <div class="burner-stat-mini">
            <span class="label">Personaje</span>
            <span class="val">${escapeHTML(m.favChar || 'Cualquiera')}</span>
          </div>
          <div class="burner-stat-mini">
            <span class="label">Horas L4D2</span>
            <span class="val">${escapeHTML(m.hours || '100+')}</span>
          </div>
        </div>

        <div class="burner-tags">
          <span class="tag-mini"><i class="fas fa-fire text-fire"></i> Burner Activo</span>
          ${m.motto ? `<span class="tag-mini" style="font-style: italic; width: 100%; margin-top: 4px;">"${escapeHTML(m.motto)}"</span>` : ''}
        </div>

        <div class="burner-actions">
          ${m.steamId ? `
            <a href="${m.steamId.startsWith('http') ? m.steamId : '#'}" target="_blank" class="btn btn-secondary" style="flex:1; font-size: 0.8rem; padding: 6px;" title="Ver Steam">
              <i class="fab fa-steam"></i> Steam
            </a>
          ` : ''}
          <button class="btn btn-primary" style="flex:1; font-size: 0.8rem; padding: 6px;" onclick="BurnersCommunity.inviteToMatch('${escapeHTML(m.nick)}')">
            <i class="fas fa-crosshairs"></i> Invitar
          </button>
        </div>
      `;

      grid.appendChild(card);
    });

    // Update global counters
    const countEl = document.getElementById('stat-total-burners');
    if (countEl) countEl.textContent = members.length;
    const badgeCount = document.getElementById('community-total-badge');
    if (badgeCount) badgeCount.textContent = `${members.length} Miembros`;
  }

  // Register a new Burner
  function registerBurner(data) {
    if (!data.nick || !data.nick.trim()) {
      alert('Por favor ingresa tu Gamertag / Apodo');
      return false;
    }

    const newMember = {
      id: 'burner_' + Date.now(),
      nick: data.nick.trim(),
      steamId: data.steamId ? data.steamId.trim() : '',
      discord: data.discord ? data.discord.trim() : '',
      role: data.role || 'Superviviente',
      favChar: data.favChar || 'Ellis',
      hours: data.hours ? `${data.hours} hrs` : '100+ hrs',
      kickRank: data.kickRank || 'Seguidor',
      motto: data.motto ? data.motto.trim() : '¡Listo para jugar con Dustburn!',
      avatar: 'assets/dustburn_logo.webp'
    };

    // Save as current user for lobby auto-fill
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newMember));

    // Check if nick already exists
    const existingIndex = members.findIndex(m => m.nick.toLowerCase() === newMember.nick.toLowerCase());
    if (existingIndex >= 0) {
      members[existingIndex] = newMember;
    } else {
      members.push(newMember);
    }

    saveMembers();
    renderMembers();

    if (window.DustburnApp) {
      window.DustburnApp.showToast(`🔥 ¡Bienvenido a la comunidad Burners, ${newMember.nick}!`);
    }

    return true;
  }

  // Export to CSV for moderators / streamer
  function exportCSV() {
    let csv = 'ID,Nickname,Steam,Discord,Rol,Personaje,Horas,RangoKick,Lema\n';
    members.forEach(m => {
      csv += `"${m.id}","${m.nick}","${m.steamId}","${m.discord}","${m.role}","${m.favChar}","${m.hours}","${m.kickRank}","${m.motto}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `burners_comunidad_dustburn_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    if (window.DustburnApp) {
      window.DustburnApp.showToast('📥 ¡Lista de Burners descargada en formato CSV!');
    }
  }

  function inviteToMatch(nick) {
    if (window.L4D2Soundboard) window.L4D2Soundboard.pillsHere();
    if (window.DustburnApp) {
      window.DustburnApp.showToast(`🎮 ¡Invitación enviada a ${nick}!`);
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
    loadMembers();
    renderMembers();

    // Search bar event
    const searchInput = document.getElementById('burner-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderMembers();
      });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'all';
        renderMembers();
      });
    });
  });

  window.BurnersCommunity = {
    registerBurner,
    exportCSV,
    inviteToMatch,
    getMembers: () => members
  };
})();
