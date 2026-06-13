import { renderNav, renderFooter, initScrollReveal, fmtDay, fmtShortMonth, fmtTime } from './shared.js';
import { fetchLatestMagazine, fetchStories, fetchEvents, fetchSiteStats } from './api.js';

renderNav('home');
renderFooter();

async function loadLatestMagazine() {
  try {
    const mag = await fetchLatestMagazine();
    const imgEl = document.getElementById('latest-mag-img');
    if (imgEl) {
      imgEl.innerHTML = `
        <div class="relative group">
          <div class="absolute rounded-xl pointer-events-none" style="inset:-16px;background:linear-gradient(135deg,rgba(212,175,55,0.2),rgba(249,115,22,0.15));filter:blur(24px);opacity:0;transition:opacity 0.5s;"></div>
          <div class="relative" onmouseover="this.previousElementSibling.style.opacity=1" onmouseout="this.previousElementSibling.style.opacity=0">
            <img src="${mag.coverImageUrl}" alt="${mag.title}"
                 class="relative rounded-xl shadow-2xl z-10" style="max-width:350px;width:100%;border:1px solid rgba(255,255,255,0.1);">
            ${mag.edition ? `<div class="absolute font-bold font-sans px-4 py-2 rounded-lg z-20 shadow-lg" style="bottom:-16px;right:-16px;background:#D4AF37;color:#0A0A0A;transform:rotate(3deg);">${mag.edition}</div>` : ''}
          </div>
        </div>`;
    }
    const titleEl = document.getElementById('latest-mag-title');
    if (titleEl && mag.title) titleEl.textContent = mag.title;
    const descEl = document.getElementById('latest-mag-desc');
    if (descEl && mag.description) descEl.textContent = mag.description;
  } catch {
    const imgEl = document.getElementById('latest-mag-img');
    if (imgEl) imgEl.innerHTML = `<div class="rounded-xl flex items-center justify-center" style="width:350px;height:467px;background:#111;border:1px solid rgba(255,255,255,0.1);"><p style="color:#a3a3a3;font-family:'Poppins',sans-serif;">No latest issue found</p></div>`;
  }
}

async function loadStats() {
  try {
    const stats = await fetchSiteStats();
    if (stats.youthReached)    document.getElementById('stat-youth').textContent       = `${stats.youthReached}+`;
    if (stats.volunteerHours)  document.getElementById('stat-hours').textContent       = `${stats.volunteerHours}+`;
    if (stats.communitiesServed) document.getElementById('stat-communities').textContent = `${stats.communitiesServed}`;
  } catch { /* keep defaults */ }
}

async function loadStories() {
  const grid = document.getElementById('stories-grid');
  if (!grid) return;
  try {
    const stories = await fetchStories({ featured: true, limit: 3 });
    if (!stories || stories.length === 0) {
      grid.innerHTML = `<div class="col-span-3 text-center py-12"><p style="color:#a3a3a3;font-family:'Poppins',sans-serif;">No stories available at the moment. Check back soon!</p></div>`;
      return;
    }
    grid.innerHTML = stories.map(story => `
      <div class="story-card group cursor-pointer">
        <div class="overflow-hidden rounded-xl mb-6 relative">
          <div class="absolute z-10 font-bold font-sans uppercase px-3 py-1 rounded" style="top:16px;left:16px;background:rgba(0,0,0,0.8);color:#fff;font-size:0.75rem;">
            ${story.category || ''}
          </div>
          ${story.imageUrl
            ? `<img src="${story.imageUrl}" alt="${story.title}" class="story-img w-full object-cover" style="aspect-ratio:4/3;">`
            : `<div class="w-full flex items-center justify-center" style="aspect-ratio:4/3;background:#111;">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#333" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
               </div>`}
        </div>
        <h3 class="font-heading text-2xl uppercase mb-3 line-clamp-2 transition-colors group-hover:text-primary"
            style="color:#fff;font-family:'Anton',sans-serif;">
          ${story.title}
        </h3>
        <p class="font-sans text-sm line-clamp-3 mb-4" style="color:#a3a3a3;">${story.excerpt || ''}</p>
        <span class="font-bold font-sans text-sm uppercase tracking-wide flex items-center gap-1 transition-all group-hover:gap-2" style="color:#D4AF37;">
          Read More
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    `).join('');
  } catch {
    grid.innerHTML = `<div class="col-span-3 text-center py-12"><p style="color:#a3a3a3;font-family:'Poppins',sans-serif;">No stories available at the moment.</p></div>`;
  }
}

async function loadEvents() {
  const grid = document.getElementById('events-grid');
  if (!grid) return;
  try {
    const events = await fetchEvents({ upcoming: true, limit: 3 });
    if (!events || events.length === 0) {
      grid.innerHTML = `<div class="col-span-2 text-center py-12"><p style="color:#a3a3a3;font-family:'Poppins',sans-serif;">No upcoming events right now. Stay tuned!</p></div>`;
      return;
    }
    grid.innerHTML = events.map(event => `
      <div class="flex rounded-xl overflow-hidden transition-colors" style="background:#0A0A0A;border:1px solid rgba(255,255,255,0.05);"
           onmouseover="this.style.borderColor='rgba(212,175,55,0.5)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.05)'">
        <div class="flex flex-col justify-center items-center text-center p-6 flex-shrink-0" style="min-width:100px;background:#D4AF37;">
          <span class="font-heading text-3xl leading-none" style="font-family:'Anton',sans-serif;color:#0A0A0A;">${fmtDay(event.date)}</span>
          <span class="font-sans font-bold uppercase text-sm mt-1" style="color:#0A0A0A;">${fmtShortMonth(event.date)}</span>
        </div>
        <div class="p-6 flex-grow flex flex-col justify-center">
          <h3 class="font-heading text-2xl mb-2 line-clamp-1" style="color:#fff;font-family:'Anton',sans-serif;">${event.title}</h3>
          <div class="flex items-center gap-2 font-sans text-sm" style="color:#a3a3a3;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#D4AF37" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            ${fmtTime(event.date)} • ${event.location || ''}
          </div>
        </div>
      </div>
    `).join('');
  } catch {
    grid.innerHTML = `<div class="col-span-2 text-center py-12"><p style="color:#a3a3a3;font-family:'Poppins',sans-serif;">No upcoming events right now. Stay tuned!</p></div>`;
  }
}

Promise.all([loadLatestMagazine(), loadStats(), loadStories(), loadEvents()]);
initScrollReveal();
