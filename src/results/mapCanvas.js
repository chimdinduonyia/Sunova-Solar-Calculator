/**
 * Procedural "Google Maps look-alike" map drawn to a <canvas>.
 * Follows the implementation spec: seeded PRNG, blob neighborhoods,
 * jittered streets, smooth polyline roads, casing technique.
 *
 * Call drawMapCanvas(canvasEl) after the canvas is in the DOM.
 */
export function drawMapCanvas(canvas) {
  const SIZE = 1500;
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // ── Seeded PRNG (LCG — seed fixed for reproducibility) ──────────────────
  let s = 20260626;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  const rng = (a, b) => a + (b - a) * rnd();

  // ── Palette (Google Maps default light) ─────────────────────────────────
  const land      = '#E8E1D1';
  const resid     = '#F1EFE9';
  const park      = '#C7DCA8';
  const water     = '#A9C9E3';
  const minor     = '#FAF8F3';
  const minorCase = '#E6E3D9';
  const arter     = '#FFFFFF';
  const arterCase = '#CED7DE';
  const hwyFill   = '#F4E4A0';
  const hwyCase   = '#E1C775';

  // ── Helpers ───────────────────────────────────────────────────────────────

  // Irregular blob — smooth ring of jittered points
  function blob(cx, cy, r, irr, n) {
    const pts = Array.from({ length: n }, (_, i) => {
      const a  = (i / n) * Math.PI * 2;
      const rr = r * (1 - irr + rnd() * irr * 2);
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
    });
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const p0 = pts[i % n], p1 = pts[(i + 1) % n];
      const m  = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      i === 0 ? ctx.moveTo(m[0], m[1]) : ctx.quadraticCurveTo(p0[0], p0[1], m[0], m[1]);
    }
    ctx.closePath();
  }

  // Smooth polyline — quadratic curve through a list of points
  function jline(p) {
    ctx.beginPath();
    ctx.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length; i++) {
      const m = [(p[i - 1][0] + p[i][0]) / 2, (p[i - 1][1] + p[i][1]) / 2];
      ctx.quadraticCurveTo(p[i - 1][0], p[i - 1][1], m[0], m[1]);
    }
    ctx.lineTo(p.at(-1)[0], p.at(-1)[1]);
  }

  // Jittered street — ~6 segments nudged perpendicular to look hand-drawn
  function street(x1, y1, x2, y2, jit) {
    const segs = 6;
    ctx.beginPath();
    for (let i = 0; i <= segs; i++) {
      const t   = i / segs;
      let   x   = x1 + (x2 - x1) * t;
      let   y   = y1 + (y2 - y1) * t;
      const nx  = -(y2 - y1), ny = (x2 - x1);
      const L   = Math.hypot(nx, ny) || 1;
      const off = (rnd() - 0.5) * jit;
      x += (nx / L) * off;
      y += (ny / L) * off;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
  }

  // Neighborhood — organic blob clipped over a rotated street grid
  // Each neighborhood gets its own random angle: the key to the "patchwork" look
  function neighborhood(cx, cy, r) {
    const ang = rng(0, Math.PI);
    const sp  = rng(36, 60);
    const sp2 = rng(42, 72);
    const jit = rng(2, 7);
    ctx.save();
    blob(cx, cy, r, 0.45, 10);
    ctx.clip();
    ctx.fillStyle = resid;
    ctx.fillRect(cx - r - 50, cy - r - 50, (r + 50) * 2, (r + 50) * 2);
    ctx.translate(cx, cy);
    ctx.rotate(ang);
    const R = r + 80;
    ctx.lineCap = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass === 0 ? minorCase : minor;
      ctx.lineWidth   = pass === 0 ? 4.5 : 2.6;
      for (let x = -R; x <= R; x += sp) {
        street(x, -R, x + rng(-12, 12), R, jit);
        ctx.stroke();
      }
      for (let y = -R; y <= R; y += sp2) {
        street(-R, y, R, y + rng(-12, 12), jit);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Arterial road — casing then fill (produces visible road outline)
  function arterial(p, w) {
    jline(p); ctx.strokeStyle = arterCase; ctx.lineWidth = w + 5; ctx.stroke();
    jline(p); ctx.strokeStyle = arter;     ctx.lineWidth = w;     ctx.stroke();
  }

  // ── Drawing (back → front) ────────────────────────────────────────────────

  // 1. Land base
  ctx.fillStyle = land;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 2. Undeveloped land blob (top-left outskirts)
  ctx.save();
  blob(180, 160, 280, 0.5, 10);
  ctx.fillStyle = land;
  ctx.fill();
  ctx.restore();

  // 3. Residential neighborhoods — patchwork of rotated grids
  [
    [1050, 360, 300], [1080, 760, 340], [1180, 1120, 300],
    [760,  560, 250], [640,  980, 260], [420,  1180, 240],
    [260,  560, 260], [180,  920, 230], [980,  1240, 220],
    [1300, 560, 200],
  ].forEach(([cx, cy, r]) => neighborhood(cx, cy, r));

  // 4. Parks
  ctx.lineCap = 'round';
  [[1320, 980, 150], [560, 300, 120], [360, 1320, 160], [1180, 180, 130]]
    .forEach(([x, y, r]) => {
      ctx.save();
      blob(x, y, r, 0.4, 9);
      ctx.fillStyle = park;
      ctx.fill();
      ctx.restore();
    });

  // 5. River
  const riverPts = [[-40, 260], [260, 420], [520, 700], [600, 1000], [520, 1320], [560, 1560]];
  ctx.lineCap = 'round';
  jline(riverPts); ctx.strokeStyle = '#9DC0DD'; ctx.lineWidth = 30; ctx.stroke();
  jline(riverPts); ctx.strokeStyle = water;     ctx.lineWidth = 24; ctx.stroke();

  // 6. Arterials (casing then fill, extended past edges so nothing floats mid-frame)
  arterial([[760, -40],  [820, 260],  [900, 560],  [1040, 900],  [1140, 1240], [1200, 1560]], 11);
  arterial([[1560, 360], [1180, 520], [820, 640],  [460, 720],   [-40, 760]],                 10);
  arterial([[1560, 1080],[1180, 980], [820, 1020], [440, 1140],  [-40, 1180]],                9);
  arterial([[300, -40],  [360, 360],  [300, 760],  [420, 1160],  [360, 1560]],                8);
  arterial([[-40, 1380], [400, 1300], [820, 1360], [1240, 1300], [1560, 1360]],               8);

  // 7. Highway — wide, with dashed median
  const hwyPts = [[-90, 700], [280, 540], [700, 360], [1120, 200], [1600, 30]];
  jline(hwyPts); ctx.strokeStyle = hwyCase; ctx.lineWidth = 34; ctx.stroke();
  jline(hwyPts); ctx.strokeStyle = hwyFill; ctx.lineWidth = 27; ctx.stroke();
  jline(hwyPts); ctx.strokeStyle = hwyCase; ctx.lineWidth = 2.5;
  ctx.setLineDash([16, 18]); ctx.stroke(); ctx.setLineDash([]);
}
