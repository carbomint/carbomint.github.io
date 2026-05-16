async function loadDiscord() {
  const userId = CFG.identity.discord;
  const elContent = document.getElementById('discordContent');
  const elLoading = document.getElementById('discordLoading');
  const elError = document.getElementById('discordError');
  if (!elContent) return;

  if (!userId || String(userId).includes('YOUR_')) {
    if (elLoading) elLoading.style.display = 'none';
    if (elError) elError.style.display = 'flex';
    return;
  }

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Not found in Lanyard');

    const p = data.data;
    const st = p.discord_status || 'offline';
    const statusLabel = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      offline: 'Offline'
    };

    if (elLoading) elLoading.style.display = 'none';
    elContent.style.display = 'block';

    const avatarEl = document.getElementById('discordAvatar');
    if (avatarEl && p.discord_user?.avatar) {
      avatarEl.src = `https://cdn.discordapp.com/avatars/${p.discord_user.id}/${p.discord_user.avatar}.png?size=80`;
    }

    const nameEl = document.getElementById('discordName');
    if (nameEl) {
      nameEl.textContent = p.discord_user?.global_name || p.discord_user?.username || '—';
    }

    const dotEl = document.getElementById('discordDot');
    const stEl = document.getElementById('discordStatusText');
    if (dotEl) dotEl.className = `discord-dot ${st}`;
    if (stEl) stEl.textContent = statusLabel[st] || 'Offline';

    const aboutDot = document.getElementById('aboutStatusDot');
    if (aboutDot) aboutDot.className = `about-status-dot ${st}`;

    const act = p.activities?.find(a => a.type !== 4);
    const actEl = document.getElementById('discordActivity');
    const actTx = document.getElementById('discordActivityText');
    if (act && actEl && actTx) {
      actEl.style.display = 'flex';
      actTx.textContent = act.name + (act.details ? ` — ${act.details}` : '');
    }

    const cs = p.activities?.find(a => a.type === 4);
    const csEl = document.getElementById('discordCustomStatus');
    const csTx = document.getElementById('discordCustomText');
    if (cs && csEl && csTx && (cs.state || cs.emoji?.name)) {
      csEl.style.display = 'block';
      let emojiHtml = '';
      if (cs.emoji) {
        if (cs.emoji.id) {
          const ext = cs.emoji.animated ? 'gif' : 'png';
          emojiHtml = `<img src="https://cdn.discordapp.com/emojis/${cs.emoji.id}.${ext}?size=20" style="width:18px;height:18px;vertical-align:middle;margin-right:5px;" alt="${cs.emoji.name}">`;
        } else {
          emojiHtml = `<span style="margin-right:4px">${cs.emoji.name}</span>`;
        }
      }
      csTx.innerHTML = emojiHtml + (cs.state || '');
    }
  } catch (err) {
    console.warn('[discord]', err.message);
    if (elLoading) elLoading.style.display = 'none';
    if (elError) elError.style.display = 'flex';
  }
}
