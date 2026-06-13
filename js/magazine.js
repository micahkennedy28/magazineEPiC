import { renderNav, renderFooter, initScrollReveal, fmtMonthYear, fmtShortMonthYear } from './shared.js';
import { fetchLatestMagazine, fetchMagazines } from './api.js';

renderNav('magazine');
renderFooter();

async function loadMagazine() {
  try {
    const [latest, all] = await Promise.all([fetchLatestMagazine(), fetchMagazines()]);

    // Latest issue highlight
    const latestSection = document.getElementById('latest-section');
    if (latestSection && latest) {
      latestSection.innerHTML = `
        <div class="rounded-3xl overflow-hidden p-8 md:p-12 relative flex flex-col md:flex-row gap-12 items-center" style="background:#111;border:1px solid rgba(255,255,255,0.1);">
          <div class="absolute pointer-events-none" style="top:0;right:0;width:50%;height:100%;background:rgba(212,175,55,0.04);filter:blur(100px);"></div>

          <div class="w-full md:w-2/5 flex-shrink-0 relative z-10">
            <div class="absolute font-bold font-sans text-xs px-4 py-1 uppercase tracking-widest rounded shadow-lg z-20" style="top:-16px;left:-16px;background:#F97316;color:#fff;transform:rotate(-3deg);">
              Newest Issue
            </div>
            <img src="${latest.coverImageUrl}" alt="${latest.title}"
                 class="w-full rounded-xl shadow-2xl" style="aspect-ratio:3/4;object-fit:cover;border:1px solid rgba(255,255,255,0.1);">
          </div>

          <div class="w-full md:w-3/5 relative z-10 space-y-6">
            <div class="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest" style="color:#D4AF37;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              ${fmtMonthYear(latest.publishedAt)}
              ${latest.edition ? `<span style="color:#a3a3a3;">| ${latest.edition}</span>` : ''}
            </div>

            <h2 class="font-heading uppercase leading-none" style="font-size:clamp(2.5rem,5vw,4rem);color:#fff;">
              ${latest.title}
            </h2>

            <p class="font-sans text-lg max-w-xl" style="color:rgba(255,255,255,0.7);">
              ${latest.description || 'Dive into our newest collection of inspiring stories and content designed to encourage your faith journey.'}
            </p>

            <div class="flex flex-wrap gap-4 pt-6">
              ${latest.pdfUrl ? `
                <a href="${latest.pdfUrl}" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-colors"
                   style="background:#D4AF37;color:#0A0A0A;"
                   onmouseover="this.style.background='#c09c2a'" onmouseout="this.style.background='#D4AF37'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  READ ONLINE
                </a>
                <a href="${latest.pdfUrl}" download
                   class="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-colors"
                   style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.2);"
                   onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  DOWNLOAD PDF
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // Archive grid
    const archiveGrid = document.getElementById('archive-grid');
    if (archiveGrid && all) {
      const sorted = [...all].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      const archive = sorted.filter(m => m.id !== latest?.id);

      if (archive.length === 0) {
        archiveGrid.innerHTML = `<div class="col-span-full text-center py-16 rounded-2xl" style="border:1px dashed rgba(255,255,255,0.1);background:rgba(17,17,17,0.5);"><p class="font-sans" style="color:#a3a3a3;">No archived issues found yet.</p></div>`;
        return;
      }

      archiveGrid.innerHTML = archive.map((mag, i) => `
        <div class="mag-card group reveal" data-delay="${(i % 4) + 1}">
          <div class="relative overflow-hidden rounded-xl mb-4 bg-card" style="aspect-ratio:3/4;border:1px solid rgba(255,255,255,0.1);">
            <img src="${mag.coverImageUrl}" alt="${mag.title}" class="mag-img w-full h-full object-cover">
            ${mag.pdfUrl ? `
              <div class="mag-overlay absolute inset-0 flex flex-col items-center justify-center gap-3" style="opacity:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);">
                <a href="${mag.pdfUrl}" target="_blank" rel="noopener noreferrer"
                   class="px-0 py-2 rounded-full font-bold font-sans text-sm transition-colors"
                   style="width:160px;text-align:center;background:#D4AF37;color:#0A0A0A;"
                   onmouseover="this.style.background='#c09c2a'" onmouseout="this.style.background='#D4AF37'">READ ONLINE</a>
                <a href="${mag.pdfUrl}" download
                   class="px-0 py-2 rounded-full font-bold font-sans text-sm transition-colors"
                   style="width:160px;text-align:center;background:transparent;color:#fff;border:1px solid #fff;"
                   onmouseover="this.style.background='#fff';this.style.color='#0A0A0A'" onmouseout="this.style.background='transparent';this.style.color='#fff'">DOWNLOAD PDF</a>
              </div>
            ` : ''}
          </div>
          <div class="space-y-1">
            <p class="font-sans text-xs font-bold uppercase tracking-wider" style="color:#D4AF37;">
              ${fmtShortMonthYear(mag.publishedAt)}${mag.edition ? ` • ${mag.edition}` : ''}
            </p>
            <h3 class="font-heading text-2xl uppercase line-clamp-1 transition-colors" style="color:#fff;font-family:'Anton',sans-serif;"
                onmouseover="this.style.color='#D4AF37'" onmouseout="this.style.color='#fff'">
              ${mag.title}
            </h3>
          </div>
        </div>
      `).join('');

      initScrollReveal();
    }
  } catch (err) {
    const ls = document.getElementById('latest-section');
    if (ls) ls.innerHTML = `<div class="text-center py-12"><p class="font-sans" style="color:#a3a3a3;">Could not load magazine data.</p></div>`;
    const ag = document.getElementById('archive-grid');
    if (ag) ag.innerHTML = '';
  }
}

loadMagazine();
