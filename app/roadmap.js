// The road to the platinum, in three stages. Built from the official descriptions:
// story trophies first, then the 100% completion checklist, then the last cleanup.
// Stage trophy lists name trophy ids from data/trophies.json.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Play the story',
    hours: '60–80 hours',
    text: 'Finish all five chapters and enjoy the campaign. Story trophies pop as you go. Along the way, do the side-character chains as they open (Andy, Kenton, Billy, Randy, Tyrone, Bret), scan vehicles and study animals, and meditate whenever you see a spot.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16, 20, 21, 22, 23, 24, 26, 27, 28, 29, 33, 34, 39, 45, 46],
  },
  {
    stage: 2,
    title: 'Stage 2 — 100% completion',
    hours: 'About 100 hours',
    text: 'After the story, the 100% checklist opens under Progress. It is forgiving — roughly 60% of everything — but robberies, underwater finds, shooting ranges, drone races and Bret’s hunts need everything. Work the checklist and the big grinds: stunts, cards, WAiNK scans, challenges, vehicles and exploration.',
    trophyIds: [14, 15, 17, 18, 19, 30, 31, 32, 35, 37, 38, 40, 41, 42, 43, 44, 47, 50, 52, 53, 54, 55],
  },
  {
    stage: 3,
    title: 'Stage 3 — Last cleanup',
    hours: 'About 10 hours',
    text: 'Finish the stranger strands, the passive counters and anything left over. Most of these will already be close from the first two stages; pick off the stragglers and the platinum follows.',
    trophyIds: [1, 25, 48, 49, 51],
  },
];

// Render the three stages into a container, marking earned trophies.
// When hideSpoilers is on, unrevealed story and side trophies show as hidden.
const SPOILER_KINDS = new Set(['story', 'side']);
export function renderRoadmap(container, trophies, earned, hideSpoilers = false) {
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const box = document.createElement('article');
    box.className = 'roadmap-stage';
    const h = document.createElement('h3');
    h.textContent = stage.title;
    const hours = document.createElement('p');
    hours.className = 'stage-hours';
    hours.textContent = stage.hours;
    const text = document.createElement('p');
    text.textContent = stage.text;
    const list = document.createElement('ul');
    let done = 0;
    for (const id of stage.trophyIds) {
      const trophy = trophies.find((t) => t.id === id);
      if (!trophy) continue;
      const li = document.createElement('li');
      const isDone = earned.has(trophy.name);
      if (isDone) { li.className = 'done'; done += 1; }
      const hidden = hideSpoilers && !isDone && trophy.kinds.some((k) => SPOILER_KINDS.has(k));
      li.textContent = hidden ? 'Hidden story trophy' : trophy.name;
      list.append(li);
    }
    const count = document.createElement('p');
    count.className = 'stage-count';
    count.textContent = `${done} of ${stage.trophyIds.length} earned in this stage`;
    box.append(h, hours, text, list, count);
    container.append(box);
  }
}
