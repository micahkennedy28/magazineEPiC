/* ── Shared: nav, footer, toast, animations ─── */

const NAV_LINKS = [
  { name: 'Home',     href: '/',        id: 'home'     },
  { name: 'About',    href: '/about',   id: 'about'    },
  { name: 'Team',     href: '/team',    id: 'team'     },
  { name: 'Magazine', href: '/magazine',id: 'magazine' },
  { name: 'Impact',   href: '/impact',  id: 'impact'   },
  { name: 'Contact',  href: '/contact', id: 'contact'  },
];

export function renderNav(activePage) {
  const root = document.getElementById('nav-root');
  if (!root) return;

  root.innerHTML = `
    <nav id="main-nav" class="sticky top-0 z-50 w-full border-b border-white border-opacity-10" style="background:rgba(10,10,10,0.95);">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="flex items-center justify-between h-20">

          <a href="/" class="flex items-center gap-3 flex-shrink-0">
            <img src="/assets/logo.png" alt="E.P.i.C. Logo" class="h-12 w-auto object-contain"
                 onerror="this.style.display='none'">
            <span class="font-heading text-2xl tracking-wider hidden sm:block mt-1" style="color:#D4AF37;font-family:'Anton',sans-serif;">E.P.i.C.</span>
          </a>

          <div class="hidden md:flex items-center space-x-6">
            ${NAV_LINKS.map(l => `
              <a href="${l.href}"
                 class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                 style="font-family:'Poppins',sans-serif; color:${activePage === l.id ? '#D4AF37' : '#fff'};"
                 onmouseover="this.style.color='#D4AF37'"
                 onmouseout="this.style.color='${activePage === l.id ? '#D4AF37' : '#fff'}'"
              >${l.name}</a>
            `).join('')}
          </div>

          <a href="/magazine"
             class="hidden md:inline-flex items-center px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-colors"
             style="background:#D4AF37;color:#0A0A0A;font-family:'Poppins',sans-serif;"
             onmouseover="this.style.background='#c09c2a'"
             onmouseout="this.style.background='#D4AF37'"
          >LATEST ISSUE</a>

          <button id="nav-toggle" aria-label="Toggle menu"
                  class="md:hidden p-2 rounded-md" style="color:#D4AF37;">
            <svg id="icon-menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg id="icon-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="hidden">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="hidden md:hidden border-t border-white border-opacity-10"
           style="background:#111;">
        <div class="px-3 py-3 space-y-1">
          ${NAV_LINKS.map(l => `
            <a href="${l.href}"
               class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
               style="font-family:'Poppins',sans-serif; color:${activePage === l.id ? '#D4AF37' : '#fff'}; background:${activePage === l.id ? 'rgba(212,175,55,0.1)' : 'transparent'};"
            >${l.name}</a>
          `).join('')}
          <div class="pt-3 px-3">
            <a href="/magazine"
               class="block w-full text-center px-4 py-2 rounded-full font-bold transition-colors"
               style="background:#D4AF37;color:#0A0A0A;font-family:'Poppins',sans-serif;"
            >READ LATEST ISSUE</a>
          </div>
        </div>
      </div>
    </nav>
  `;

  const toggle   = document.getElementById('nav-toggle');
  const menu     = document.getElementById('mobile-menu');
  const iconMenu = document.getElementById('icon-menu');
  const iconX    = document.getElementById('icon-close');

  toggle.addEventListener('click', () => {
    const open = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', open);
    iconMenu.classList.toggle('hidden', !open);
    iconX.classList.toggle('hidden', open);
  });
}

export function renderFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;

  const year = new Date().getFullYear();
  root.innerHTML = `
    <footer style="background:#0A0A0A; border-top:1px solid #262626; padding-top:4rem; padding-bottom:2rem;">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

          <div>
            <a href="/" class="flex items-center gap-3 mb-5">
              <img src="/assets/logo.png" alt="E.P.i.C. Logo" class="h-16 w-auto object-contain"
                   onerror="this.style.display='none'">
            </a>
            <p style="font-family:'Poppins',sans-serif; font-size:0.875rem; color:#a3a3a3; line-height:1.6; max-width:240px;">
              Everything Possible in Christ. A generation of believers passionate about faith, creativity, community, and purpose.
            </p>
          </div>

          <div>
            <h4 style="font-family:'Anton',sans-serif; font-size:1.25rem; color:#fff; margin-bottom:1.5rem; letter-spacing:0.05em;">EXPLORE</h4>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.75rem; font-family:'Poppins',sans-serif; font-size:0.875rem; color:#a3a3a3;">
              ${[['About Us','/about'],['Magazine Archive','/magazine'],['Meet the Team','/team'],['E.P.i.C. Impact','/impact']].map(([n,h])=>`
                <li><a href="${h}" style="color:#a3a3a3; text-decoration:none; transition:color 0.2s;"
                        onmouseover="this.style.color='#D4AF37'" onmouseout="this.style.color='#a3a3a3'">${n}</a></li>
              `).join('')}
            </ul>
          </div>

          <div>
            <h4 style="font-family:'Anton',sans-serif; font-size:1.25rem; color:#fff; margin-bottom:1.5rem; letter-spacing:0.05em;">CONNECT</h4>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.75rem; font-family:'Poppins',sans-serif; font-size:0.875rem; color:#a3a3a3;">
              ${[['Contact Us','/contact'],['Prayer Requests','/contact'],['Donate','#']].map(([n,h])=>`
                <li><a href="${h}" style="color:#a3a3a3; text-decoration:none; transition:color 0.2s;"
                        onmouseover="this.style.color='#D4AF37'" onmouseout="this.style.color='#a3a3a3'">${n}</a></li>
              `).join('')}
            </ul>
          </div>

          <div>
            <h4 style="font-family:'Anton',sans-serif; font-size:1.25rem; color:#fff; margin-bottom:1.5rem; letter-spacing:0.05em;">SOCIAL</h4>
            <div style="display:flex; gap:0.75rem;">
              ${[
                ['Instagram','<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>'],
                ['Twitter','<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>'],
                ['YouTube','<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9"/>'],
                ['Email','<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'],
              ].map(([label, paths]) => `
                <a href="#" aria-label="${label}"
                   style="width:40px;height:40px;border-radius:9999px;background:#111;border:1px solid #262626;display:flex;align-items:center;justify-content:center;color:#fff;text-decoration:none;transition:all 0.2s;"
                   onmouseover="this.style.background='#D4AF37';this.style.color='#0A0A0A'"
                   onmouseout="this.style.background='#111';this.style.color='#fff'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>
                </a>
              `).join('')}
            </div>
            <p style="margin-top:1.5rem; font-size:0.75rem; color:#a3a3a3; font-family:'Poppins',sans-serif;">
              "ON FIRE FOR GOD. BUILT FOR TODAY. IMPACTING TOMORROW."
            </p>
          </div>
        </div>

        <div style="margin-top:4rem; padding-top:2rem; border-top:1px solid #262626;">
          <p style="font-size:0.75rem; color:#a3a3a3; font-family:'Poppins',sans-serif;">
            &copy; ${year} E.P.i.C. Youth Ministry. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `;
}

/* ── Toast ──────────────────────────────────── */
export function showToast(title, description = '', type = 'default') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast${type === 'error' ? ' toast-error' : ''}`;
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    ${description ? `<div class="toast-desc">${description}</div>` : ''}
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('toast-visible'));
  });

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

/* ── Scroll reveal ──────────────────────────── */
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Format date helpers ─────────────────────── */
export function fmtMonthYear(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
export function fmtShortMonthYear(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
export function fmtDay(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit' }).replace(/^0/, '');
}
export function fmtShortMonth(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
}
export function fmtTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
export function fmtFullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

/* ── Skeleton HTML helper ────────────────────── */
export function skeleton(w, h, cls = '') {
  return `<div class="skeleton ${cls}" style="width:${w};height:${h};"></div>`;
}
