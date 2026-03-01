/* ─────────────────────────────────────────
   app.js — Obsidian CLI Korean Guide
───────────────────────────────────────── */

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;

  if (!themeToggle) return;
  const isLight = theme === 'light';
  const thumb = themeToggle.querySelector('.theme-toggle-thumb');

  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? '다크 모드로 전환' : '라이트 모드로 전환');
  if (thumb) thumb.textContent = isLight ? '☀' : '☾';
}

if (themeToggle) {
  const initialTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    try {
      localStorage.setItem('obsidian-cli-theme', nextTheme);
    } catch (_) {}
  });
}

navToggle?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  const isOpen = mainNav.classList.contains('open');
  navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

// Close nav when a link is clicked
mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
  });
});

/* ── OS Tabs (install section) ── */
document.querySelectorAll('.os-tabs').forEach(tabGroup => {
  const tabs = tabGroup.querySelectorAll('.os-tab');
  const contents = tabGroup.closest('.step-body').querySelectorAll('.os-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      contents.forEach(c => {
        c.classList.toggle('active', c.dataset.os === target);
      });
    });
  });
});

/* ── Example tabs ── */
document.querySelectorAll('.ex-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ex-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.ex-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.getElementById(`ex-${tab.dataset.ex}`);
    panel?.classList.add('active');
  });
});

/* ── Copy buttons ── */
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast() {
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    let text = '';

    if (targetId) {
      const el = document.getElementById(targetId);
      text = el ? el.innerText : '';
    } else {
      // Fallback: copy code in the same block
      const pre = btn.closest('.code-block-wrap, .hero-code-wrap')?.querySelector('pre, .hero-code');
      text = pre ? pre.innerText : '';
    }

    // Strip syntax class markers (just the raw text)
    navigator.clipboard.writeText(text.trim()).then(() => {
      showToast();
      btn.textContent = '✓';
      setTimeout(() => (btn.textContent = '복사'), 1800);
    });
  });
});

/* ── Command search ── */
const cmdSearch = document.getElementById('cmdSearch');
const noResult  = document.getElementById('noResult');
const allGroups = document.querySelectorAll('.cmd-group');

cmdSearch?.addEventListener('input', () => {
  const query = cmdSearch.value.trim().toLowerCase();

  if (!query) {
    allGroups.forEach(g => {
      g.style.display = '';
      g.querySelectorAll('.cmd-item').forEach(i => (i.style.display = ''));
    });
    noResult.style.display = 'none';
    return;
  }

  let totalVisible = 0;

  allGroups.forEach(group => {
    const items = group.querySelectorAll('.cmd-item');
    let groupVisible = 0;

    items.forEach(item => {
      const name = item.dataset.name || '';
      const text = item.innerText.toLowerCase();
      const match = name.includes(query) || text.includes(query);
      item.style.display = match ? '' : 'none';
      if (match) groupVisible++;
    });

    group.style.display = groupVisible > 0 ? '' : 'none';
    if (groupVisible > 0) group.setAttribute('open', '');
    totalVisible += groupVisible;
  });

  noResult.style.display = totalVisible === 0 ? 'block' : 'none';
});

/* ── Active nav link on scroll ── */
const sections  = document.querySelectorAll('section[id], div[id="params"]');
const navLinks  = document.querySelectorAll('.main-nav a');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--text-primary)';
          }
        });
      }
    });
  },
  { rootMargin: '-20% 0px -70% 0px' }
);

sections.forEach(s => observer.observe(s));

/* ── Smooth scroll for anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
