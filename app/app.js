// Leonida Trophy Guide — tracker: checklist saved in localStorage, export/import,
// kind + grade + search filters, a spoiler setting, and the roadmap.
// Data: app/data/trophies.json (official names, descriptions, grades; guides in our own words).
import { renderRoadmap } from './roadmap.js';

const STORE_KEY = 'gta6-trophy-guide-v1';
const KIND_LABELS = {
  all: 'All trophies',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  crime: 'Crime & robberies',
  side: 'Side quests',
  online: 'Online',
};
// Kinds whose names and descriptions are story spoilers while hidden.
const SPOILER_KINDS = new Set(['story', 'side']);

const cardsEl = document.getElementById('cards');
const emptyEl = document.getElementById('emptyState');
const listCountEl = document.getElementById('listCount');
const filterNoteEl = document.getElementById('filterNote');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const kindFiltersEl = document.getElementById('kindFilters');

const saved = loadSaved();
let earned = new Set(saved.earned ?? []);
let spoilerOn = saved.spoiler ?? true;
let activeKind = 'all';
let openGuides = new Set();

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}'); } catch { return {}; }
}
function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify({ earned: [...earned], spoiler: spoilerOn }));
}

function isSpoilerHidden(trophy) {
  return spoilerOn && !earned.has(trophy.name) && trophy.kinds.some((k) => SPOILER_KINDS.has(k));
}
function gradeCounts() {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) if (earned.has(t.name)) counts[t.grade] += 1;
  return counts;
}
function updateProgress() {
  const counts = gradeCounts();
  document.getElementById('progressText').textContent = `${earned.size} of ${trophies.length} earned`;
  document.getElementById('progressDetail').textContent =
    `Platinum ${counts.platinum}/1 · Gold ${counts.gold}/2 · Silver ${counts.silver}/6 · Bronze ${counts.bronze}/46`;
  document.getElementById('progressFill').style.width = `${(earned.size / trophies.length) * 100}%`;
}

function matchesFilters(trophy) {
  if (activeKind === 'online') return false;
  if (activeKind !== 'all' && !trophy.kinds.includes(activeKind)) return false;
  if (gradeEl.value !== 'all' && trophy.grade !== gradeEl.value) return false;
  const q = searchEl.value.trim().toLowerCase();
  if (q && !(trophy.name + ' ' + trophy.description + ' ' + trophy.guide).toLowerCase().includes(q)) return false;
  return true;
}

function buildCard(trophy) {
  const card = document.createElement('article');
  card.className = 'card' + (earned.has(trophy.name) ? ' earned' : '');
  card.dataset.trophyId = String(trophy.id);

  const head = document.createElement('div');
  head.className = 'card-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.name);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(trophy.name); else earned.delete(trophy.name);
    save();
    render();
  });
  const title = document.createElement('div');
  title.className = 'card-title';
  const name = document.createElement('h3');
  const hidden = isSpoilerHidden(trophy);
  if (hidden) {
    name.textContent = 'Hidden story trophy';
    name.className = 'spoiler-hidden-name';
  } else {
    name.textContent = trophy.name;
  }
  const desc = document.createElement('p');
  desc.className = 'official';
  desc.textContent = hidden ? 'Earn this trophy to reveal its name and description.' : trophy.description;
  title.append(name, desc);
  const badge = document.createElement('span');
  badge.className = `grade-badge grade-${trophy.grade}`;
  badge.textContent = trophy.grade;
  head.append(box, title, badge);

  const tags = document.createElement('div');
  tags.className = 'tags';
  for (const kind of trophy.kinds) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = KIND_LABELS[kind] ?? kind;
    tags.append(tag);
  }
  if (trophy.missable) {
    const tag = document.createElement('span');
    tag.className = 'tag tag-missable';
    tag.textContent = '⚠ Possibly missable';
    tags.append(tag);
  }
  if (trophy.count != null) {
    const tag = document.createElement('span');
    tag.className = 'tag tag-count';
    tag.textContent = `Target: ${trophy.count.toLocaleString('en-US')}`;
    tags.append(tag);
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'guide-toggle';
  const open = openGuides.has(trophy.id);
  toggle.textContent = open ? 'Hide the guide ▲' : 'Read the guide ▼';
  toggle.setAttribute('aria-expanded', String(open));
  const guide = document.createElement('div');
  guide.className = 'guide';
  guide.hidden = !open;
  const guideText = document.createElement('p');
  guideText.textContent = trophy.guide;
  const sources = document.createElement('p');
  sources.className = 'sources';
  sources.innerHTML = '';
  const strong = document.createElement('strong');
  strong.textContent = 'Sources: ';
  sources.append(strong, document.createTextNode(trophy.sources.join(' · ')));
  if (trophy.missable && trophy.missable_note) {
    const note = document.createElement('p');
    note.textContent = trophy.missable_note;
    guide.append(guideText, note, sources);
  } else {
    guide.append(guideText, sources);
  }
  toggle.addEventListener('click', () => {
    if (openGuides.has(trophy.id)) openGuides.delete(trophy.id); else openGuides.add(trophy.id);
    render();
  });

  card.append(head, tags, toggle, guide);
  return card;
}

function render() {
  updateProgress();
  renderRoadmap(document.getElementById('roadmapStages'), trophies, earned, spoilerOn);
  const visible = trophies.filter(matchesFilters);
  cardsEl.replaceChildren(...visible.map(buildCard));
  listCountEl.textContent = `— showing ${visible.length} of ${trophies.length}`;
  emptyEl.hidden = visible.length > 0;
  if (activeKind === 'online') {
    filterNoteEl.hidden = false;
    filterNoteEl.textContent = 'No online trophies: all 55 are single-player, and none need online play (per PowerPyx).';
  } else {
    filterNoteEl.hidden = true;
  }
  for (const button of kindFiltersEl.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button.dataset.kind === activeKind));
  }
}

function buildKindFilters() {
  for (const [kind, label] of Object.entries(KIND_LABELS)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.kind = kind;
    button.textContent = label;
    button.setAttribute('aria-pressed', String(kind === activeKind));
    button.addEventListener('click', () => { activeKind = kind; render(); });
    kindFiltersEl.append(button);
  }
}

document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set((names ?? []).filter((n) => known.has(n)));
    save();
    render();
  } catch {
    alert('That file is not a valid trophy progress export.');
  }
  event.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear every tick? This cannot be undone.')) {
    earned = new Set();
    save();
    render();
  }
});
searchEl.addEventListener('input', render);
gradeEl.addEventListener('change', render);
spoilerEl.checked = spoilerOn;
spoilerEl.addEventListener('change', () => {
  spoilerOn = spoilerEl.checked;
  save();
  render();
});

buildKindFilters();
render();

// Small hooks for testing and screenshots (not part of the guide itself).
window.__trophyApp = {
  setEarned(names) { earned = new Set(names.filter((n) => trophies.some((t) => t.name === n))); save(); render(); },
  openGuide(id) { openGuides.add(id); render(); },
  setSpoiler(on) { spoilerOn = on; spoilerEl.checked = on; save(); render(); },
  setKind(kind) { activeKind = kind; render(); },
};
