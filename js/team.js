import { renderNav, renderFooter, initScrollReveal } from './shared.js';
import { fetchTeamMembers } from './api.js';

renderNav('team');
renderFooter();

async function loadTeam() {
  const container = document.getElementById('team-container');
  if (!container) return;

  try {
    const members = await fetchTeamMembers();
    if (!members || members.length === 0) {
      container.innerHTML = `<div class="text-center py-20"><p class="font-sans text-lg" style="color:#a3a3a3;">We are updating our team profiles. Check back soon!</p></div>`;
      return;
    }

    // Group by department
    const grouped = members.reduce((acc, m) => {
      const dept = m.department || 'Leadership';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(m);
      return acc;
    }, {});

    container.innerHTML = Object.entries(grouped).map(([dept, deptMembers]) => `
      <div class="mb-20">
        <h2 class="font-heading text-3xl uppercase mb-8 flex items-center gap-4" style="color:#fff;">
          ${dept}
          <span style="height:1px;flex:1;max-width:200px;background:linear-gradient(to right,rgba(212,175,55,0.5),transparent);"></span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${deptMembers.map((member, i) => {
            let socialLinks = {};
            try { if (member.socialLinks) socialLinks = JSON.parse(member.socialLinks); } catch {}

            return `
              <div class="reveal" data-delay="${Math.min(i + 1, 4)}" style="aspect-ratio:3/4;">
                <div class="flip-card w-full h-full" id="card-${member.id}">
                  <div class="flip-card-inner w-full h-full rounded-2xl" style="border:1px solid rgba(255,255,255,0.1);">

                    <!-- Front -->
                    <div class="flip-card-front rounded-2xl overflow-hidden cursor-pointer" style="background:#111;"
                         onclick="document.getElementById('card-${member.id}').classList.toggle('flipped')">
                      ${member.photoUrl
                        ? `<img src="${member.photoUrl}" alt="${member.name}" class="member-photo w-full h-full object-cover">`
                        : `<div class="w-full h-full flex items-center justify-center" style="background:linear-gradient(to bottom,#1f1f1f,#0A0A0A);">
                             <span class="font-heading" style="font-size:5rem;color:rgba(255,255,255,0.06);">${member.name.charAt(0)}</span>
                           </div>`
                      }
                      <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,0.9),rgba(0,0,0,0.3),transparent);"></div>
                      <div class="absolute bottom-0 left-0 w-full p-6 text-left">
                        <h3 class="font-heading text-2xl uppercase leading-none mb-1" style="color:#fff;">${member.name}</h3>
                        <p class="font-sans text-sm font-medium uppercase tracking-wider" style="color:#D4AF37;">${member.role}</p>
                      </div>
                    </div>

                    <!-- Back -->
                    <div class="flip-card-back rounded-2xl p-6 flex flex-col" style="background:#111;">
                      <div class="flex justify-between items-start mb-4">
                        <div>
                          <h3 class="font-heading text-xl uppercase leading-none" style="color:#fff;">${member.name}</h3>
                          <p class="font-sans text-xs uppercase mt-1" style="color:#D4AF37;">${member.role}</p>
                        </div>
                        <button onclick="document.getElementById('card-${member.id}').classList.remove('flipped')"
                                class="transition-colors" style="color:#a3a3a3;"
                                onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#a3a3a3'">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                      <div class="flex-grow overflow-y-auto font-sans text-sm pr-1" style="color:rgba(255,255,255,0.7);">
                        ${member.bio || 'No biography available for this team member yet.'}
                      </div>
                      <div class="pt-4 mt-auto flex gap-3" style="border-top:1px solid rgba(255,255,255,0.1);">
                        ${socialLinks.instagram ? `<a href="https://instagram.com/${socialLinks.instagram}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="transition-colors" style="color:#a3a3a3;" onmouseover="this.style.color='#D4AF37'" onmouseout="this.style.color='#a3a3a3'"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>` : ''}
                        ${socialLinks.twitter ? `<a href="https://twitter.com/${socialLinks.twitter}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="transition-colors" style="color:#a3a3a3;" onmouseover="this.style.color='#D4AF37'" onmouseout="this.style.color='#a3a3a3'"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>` : ''}
                        ${socialLinks.email ? `<a href="mailto:${socialLinks.email}" onclick="event.stopPropagation()" class="transition-colors" style="color:#a3a3a3;" onmouseover="this.style.color='#D4AF37'" onmouseout="this.style.color='#a3a3a3'"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></a>` : ''}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    initScrollReveal();
  } catch (err) {
    container.innerHTML = `<div class="text-center py-20"><p class="font-sans text-lg" style="color:#a3a3a3;">Could not load team members. Please try again later.</p></div>`;
  }
}

loadTeam();
