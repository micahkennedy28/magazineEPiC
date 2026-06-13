import { renderNav, renderFooter, fmtFullDate } from './shared.js';
import { fetchOpportunities, fetchSiteStats } from './api.js';

renderNav('impact');
renderFooter();

const CATEGORIES = [
  { id: 'all',         label: 'All Opportunities', icon: null },
  { id: 'volunteer',   label: 'Volunteer',          icon: heartIcon() },
  { id: 'job',         label: 'Jobs',               icon: briefcaseIcon() },
  { id: 'scholarship', label: 'Scholarships',        icon: graduationIcon() },
  { id: 'internship',  label: 'Internships',         icon: usersIcon() },
  { id: 'resource',    label: 'Resources',           icon: bookIcon() },
];

function heartIcon(size=16)       { return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`; }
function briefcaseIcon(size=16)   { return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`; }
function graduationIcon(size=16)  { return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`; }
function usersIcon(size=16)       { return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`; }
function bookIcon(size=16)        { return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`; }
function calendarIcon(size=16)    { return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`; }
function extLinkIcon(size=16)     { return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`; }

function catIcon(id, size=14) {
  switch(id) {
    case 'volunteer': return heartIcon(size);
    case 'job': return briefcaseIcon(size);
    case 'scholarship': return graduationIcon(size);
    case 'internship': return usersIcon(size);
    case 'resource': return bookIcon(size);
    default: return heartIcon(size);
  }
}

let activeTab = 'all';

function renderFilters() {
  const bar = document.getElementById('filter-bar');
  if (!bar) return;
  bar.innerHTML = CATEGORIES.map(cat => `
    <button data-cat="${cat.id}"
            class="filter-btn flex items-center gap-2 px-6 py-3 rounded-full font-sans font-medium text-sm whitespace-nowrap transition-all"
            style="${cat.id === activeTab
              ? 'background:#D4AF37;color:#0A0A0A;border:1px solid #D4AF37;'
              : 'background:#111;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.1);'}">
      ${cat.icon ? cat.icon : ''}
      ${cat.label}
    </button>
  `).join('');

  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.cat;
      renderFilters();
      loadOpportunities();
    });
    const id = btn.dataset.cat;
    if (id !== activeTab) {
      btn.addEventListener('mouseover', () => { btn.style.borderColor = 'rgba(255,255,255,0.3)'; btn.style.color = '#fff'; });
      btn.addEventListener('mouseout',  () => { btn.style.borderColor = 'rgba(255,255,255,0.1)'; btn.style.color = 'rgba(255,255,255,0.7)'; });
    }
  });
}

async function loadOpportunities() {
  const list = document.getElementById('opp-list');
  if (!list) return;
  list.innerHTML = [0,1,2,3].map(()=>`<div class="skeleton" style="width:100%;height:160px;border-radius:1rem;"></div>`).join('');
  try {
    const opps = await fetchOpportunities({ category: activeTab });
    if (!opps || opps.length === 0) {
      list.innerHTML = `
        <div class="text-center py-24 rounded-3xl" style="background:#111;border:1px solid rgba(255,255,255,0.05);">
          ${heartIcon(64).replace('stroke="currentColor"','stroke="#333"')}
          <h3 class="font-heading text-3xl uppercase mb-2 mt-4" style="color:#fff;">No Opportunities Found</h3>
          <p class="font-sans max-w-md mx-auto" style="color:#a3a3a3;">There are currently no open opportunities in this category. Please check back later or explore other categories.</p>
        </div>`;
      return;
    }

    list.innerHTML = opps.map(opp => `
      <div class="opp-card p-6 md:p-8 rounded-2xl relative overflow-hidden" style="background:#111;border:1px solid rgba(255,255,255,0.05);">
        <div class="absolute pointer-events-none" style="top:0;right:0;width:128px;height:100%;background:linear-gradient(to left,rgba(212,175,55,0.04),transparent);opacity:0;transition:opacity 0.2s;" class="opp-glow"></div>

        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div class="space-y-4 flex-grow">
            <div class="flex flex-wrap items-center gap-3">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded font-bold font-sans uppercase tracking-wider text-xs" style="background:#0A0A0A;border:1px solid rgba(255,255,255,0.1);color:#D4AF37;">
                ${catIcon(opp.category)} ${opp.category}
              </span>
              ${opp.organization ? `<span class="font-sans text-sm font-medium" style="color:#a3a3a3;">@ ${opp.organization}</span>` : ''}
            </div>

            <div>
              <h3 class="font-heading text-3xl uppercase transition-colors" style="color:#fff;"
                  onmouseover="this.style.color='#D4AF37'" onmouseout="this.style.color='#fff'">${opp.title}</h3>
              <p class="font-sans mt-2 max-w-2xl line-clamp-2 md:line-clamp-none" style="color:rgba(255,255,255,0.7);">${opp.description || ''}</p>
            </div>

            <div class="flex flex-wrap items-center gap-6 text-sm font-sans pt-2" style="color:#a3a3a3;">
              ${opp.deadline ? `
                <div class="flex items-center gap-2">
                  ${calendarIcon(16).replace('stroke="currentColor"','stroke="#F97316"')}
                  Deadline: <span style="color:rgba(255,255,255,0.9);">${fmtFullDate(opp.deadline)}</span>
                </div>` : ''}
              ${opp.amount ? `<div class="flex items-center gap-2 font-bold" style="color:#3B82F6;">${opp.amount}</div>` : ''}
            </div>
          </div>

          <div class="flex-shrink-0">
            ${opp.applyUrl
              ? `<a href="${opp.applyUrl}" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold font-sans transition-colors shadow-lg"
                    style="background:#D4AF37;color:#0A0A0A;box-shadow:0 4px 20px rgba(212,175,55,0.2);"
                    onmouseover="this.style.background='#c09c2a'" onmouseout="this.style.background='#D4AF37'">
                    APPLY NOW ${extLinkIcon(16)}
                 </a>`
              : `<span class="inline-flex px-8 py-3 rounded-full font-bold font-sans" style="background:#262626;color:#a3a3a3;cursor:not-allowed;">CLOSED</span>`}
          </div>
        </div>
      </div>
    `).join('');

    // hover glow effect
    list.querySelectorAll('.opp-card').forEach(card => {
      const glow = card.querySelector('.opp-glow');
      if (glow) {
        card.addEventListener('mouseover', () => glow.style.opacity = '1');
        card.addEventListener('mouseout',  () => glow.style.opacity = '0');
      }
    });

  } catch {
    list.innerHTML = `<div class="text-center py-12"><p class="font-sans" style="color:#a3a3a3;">Could not load opportunities. Please try again later.</p></div>`;
  }
}

async function loadStats() {
  try {
    const stats = await fetchSiteStats();
    if (stats.youthReached)     document.getElementById('stat-youth').textContent  = `${stats.youthReached}+`;
    if (stats.volunteerHours)   document.getElementById('stat-hours').textContent  = `${stats.volunteerHours}+`;
    if (stats.communitiesServed) document.getElementById('stat-comm').textContent  = `${stats.communitiesServed}`;
    if (stats.totalOpportunities) document.getElementById('stat-roles').textContent = `${stats.totalOpportunities}`;
  } catch { /* keep defaults */ }
}

renderFilters();
loadOpportunities();
loadStats();
