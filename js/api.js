const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchLatestMagazine() {
  return fetchJSON(`${API_BASE}/magazines/latest`);
}

export async function fetchMagazines() {
  return fetchJSON(`${API_BASE}/magazines`);
}

export async function fetchStories({ featured, limit } = {}) {
  const p = new URLSearchParams();
  if (featured !== undefined) p.set('featured', featured);
  if (limit   !== undefined) p.set('limit', limit);
  return fetchJSON(`${API_BASE}/stories?${p}`);
}

export async function fetchEvents({ upcoming, limit } = {}) {
  const p = new URLSearchParams();
  if (upcoming !== undefined) p.set('upcoming', upcoming);
  if (limit    !== undefined) p.set('limit', limit);
  return fetchJSON(`${API_BASE}/events?${p}`);
}

export async function fetchSiteStats() {
  return fetchJSON(`${API_BASE}/stats`);
}

export async function fetchTeamMembers() {
  return fetchJSON(`${API_BASE}/team`);
}

export async function fetchOpportunities({ category } = {}) {
  const p = new URLSearchParams();
  if (category && category !== 'all') p.set('category', category);
  return fetchJSON(`${API_BASE}/opportunities?${p}`);
}

export async function submitContact(data) {
  return fetchJSON(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function submitPrayer(data) {
  return fetchJSON(`${API_BASE}/prayer-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
