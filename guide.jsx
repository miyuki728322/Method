/* ============================================================
   Shime Saba — professional method, interactive guide
   ============================================================ */

const { useState, useEffect, useCallback } = React;

/* ---------- design-system CSS (injected once) ---------- */
const CSS = `
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ---- top bar ---- */
.topbar {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 40px 20px;
  border-bottom: 1px solid var(--hair);
  flex: none;
}
.brand { display: flex; align-items: baseline; gap: 16px; }
.brand .jp {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 26px;
  letter-spacing: 0.18em;
  color: var(--ink);
}
.brand .en {
  font-family: var(--serif);
  font-size: 14px;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.topbar .meta {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: right;
  line-height: 1.7;
}
.topbar .meta b { color: var(--seal); font-weight: 500; }

/* ---- body split ---- */
.body { flex: 1; display: flex; min-height: 0; }

/* ---- rail ---- */
.rail {
  flex: none;
  width: 312px;
  border-right: 1px solid var(--hair);
  padding: 30px 0;
  overflow-y: auto;
  background: linear-gradient(90deg, var(--paper-deep), var(--paper) 70%);
}
.rail-head {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding: 0 34px 14px;
}
.step-item {
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  gap: 16px;
  padding: 14px 34px;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  position: relative;
  transition: background .18s ease;
}
.step-item:hover { background: var(--hair-soft); }
.step-item .num {
  font-family: var(--serif);
  font-size: 22px;
  color: var(--ink-faint);
  text-align: center;
  transition: color .18s ease;
}
.step-item .label { line-height: 1.25; }
.step-item .label .en {
  display: block;
  font-size: 14.5px;
  font-weight: 400;
  color: var(--ink-soft);
  letter-spacing: 0.01em;
  transition: color .18s ease;
}
.step-item .label .jp {
  display: block;
  font-family: var(--serif);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--ink-faint);
  margin-top: 2px;
}
.step-item.done .num { color: var(--ink-soft); }
.step-item.active { background: var(--hair-soft); }
.step-item.active::before {
  content: "";
  position: absolute;
  left: 0; top: 8px; bottom: 8px;
  width: 3px;
  background: var(--seal);
}
.step-item.active .num { color: var(--seal); }
.step-item.active .label .en { color: var(--ink); font-weight: 500; }
.step-item .check {
  position: absolute; right: 30px;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--seal);
  opacity: 0;
}
.step-item.checked .check { opacity: 0.55; }

/* ---- main ---- */
.main {
  flex: 1;
  position: relative;
  overflow-y: auto;
  display: flex;
}
.ghost {
  position: absolute;
  top: -3.5vh; right: 2vw;
  font-family: var(--serif);
  font-weight: 700;
  font-size: 46vh;
  line-height: 1;
  color: var(--ink);
  opacity: 0.035;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}
.stage {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 64px 120px;
}

/* ---- step header ---- */
.step-head { margin-bottom: 38px; }
.eyebrow {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--seal);
  margin-bottom: 16px;
}
.eyebrow .slash { color: var(--ink-faint); margin: 0 4px; }
.step-title {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 52px;
  line-height: 1.05;
  margin: 0;
  letter-spacing: -0.005em;
}
.step-sub {
  font-family: var(--serif);
  font-size: 15px;
  letter-spacing: 0.24em;
  color: var(--ink-soft);
  margin-top: 12px;
}

/* ---- content grid ---- */
.cols {
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 52px;
  align-items: start;
}

/* ---- photo placeholder ---- */
.photo {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border: 1px solid var(--hair);
  background-color: var(--paper-deep);
  background-image: repeating-linear-gradient(
    -45deg,
    transparent 0 9px,
    var(--hair-soft) 9px 10px
  );
  display: flex;
  align-items: flex-end;
  padding: 18px;
}
.photo .tag {
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
  background: var(--paper);
  border: 1px solid var(--hair);
  padding: 8px 11px;
  max-width: 92%;
}
.photo .tag b {
  display: block;
  color: var(--seal);
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 9.5px;
  margin-bottom: 4px;
}
.photo.has-img { padding: 0; background-image: none; overflow: hidden; }
.photo.has-img img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}

/* ---- photo carousel ---- */
.carousel {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border: 1px solid var(--hair);
  background: var(--paper-deep);
  overflow: hidden;
}
.carousel-track {
  display: flex;
  height: 100%;
  transition: transform .5s cubic-bezier(.65,.02,.18,1);
}
.carousel-slide {
  position: relative;
  flex: 0 0 100%;
  height: 100%;
}
.carousel-slide img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.carousel-cap {
  position: absolute;
  left: 14px; bottom: 14px;
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.4;
  letter-spacing: 0.04em;
  color: var(--ink);
  background: var(--paper);
  border: 1px solid var(--hair);
  padding: 8px 11px;
  max-width: calc(100% - 28px);
}
.carousel-cap b {
  color: var(--seal);
  font-weight: 500;
  letter-spacing: 0.14em;
}
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  background: var(--paper);
  border: 1px solid var(--hair);
  color: var(--ink);
  font-family: var(--mono);
  font-size: 15px;
  cursor: pointer;
  opacity: 0.92;
  transition: border-color .18s ease, background .18s ease;
}
.carousel-arrow:hover { border-color: var(--ink); background: var(--paper); }
.carousel-arrow.prev { left: 12px; }
.carousel-arrow.next { right: 12px; }
.carousel-dots {
  position: absolute;
  top: 14px; right: 14px;
  display: flex;
  gap: 7px;
  z-index: 2;
}
.carousel-dots button {
  width: 7px; height: 7px;
  border-radius: 50%;
  border: 1px solid var(--paper);
  background: rgba(0,0,0,0.18);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.12);
  padding: 0; cursor: pointer;
  transition: all .18s ease;
}
.carousel-dots button.on {
  background: var(--seal);
  border-color: var(--paper);
  transform: scale(1.25);
}

/* ---- moves ---- */
.moves { list-style: none; margin: 0; padding: 0; counter-reset: m; }
.move {
  display: grid;
  grid-template-columns: 26px 1fr;
  gap: 16px;
  padding: 0 0 22px;
  position: relative;
}
.move::before {
  counter-increment: m;
  content: counter(m, decimal-leading-zero);
  font-family: var(--mono);
  font-size: 11px;
  color: var(--seal);
  padding-top: 4px;
  letter-spacing: 0.04em;
}
.move:not(:last-child) .move-body::after {
  content: "";
  position: absolute;
  left: -42px;
}
.move-body {
  font-size: 16.5px;
  line-height: 1.62;
  color: var(--ink);
  font-weight: 300;
}
.move-body .em { color: var(--ink); font-weight: 500; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--seal-deep);
  border: 1px solid var(--seal);
  border-radius: 2px;
  padding: 2px 9px;
  margin-top: 10px;
}

/* ---- callout ---- */
.callout {
  margin-top: 30px;
  border-top: 1px solid var(--hair);
  padding-top: 22px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
}
.callout .seal {
  font-family: var(--serif);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--paper);
  background: var(--seal);
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 3px;
  align-self: start;
}
.callout.tip .seal { background: var(--ink); }
.callout .ctext { padding-top: 1px; }
.callout .ckind {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 6px;
}
.callout .cbody {
  font-size: 15px;
  line-height: 1.6;
  color: var(--ink-soft);
  font-weight: 300;
  max-width: 58ch;
}

/* ---- finale / plating ---- */
.finale .cols { grid-template-columns: 1fr 1fr; gap: 56px; }
.plate-photo { aspect-ratio: 1 / 1; }
.plating-list { list-style: none; margin: 0; padding: 0; }
.plating-list li {
  padding: 18px 0;
  border-bottom: 1px solid var(--hair);
}
.plating-list li:first-child { padding-top: 0; }
.plating-list .k {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--seal);
  margin-bottom: 7px;
}
.plating-list .v {
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
  font-weight: 300;
}
.plating-list .v-jp {
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--seal);
  font-weight: 300;
  font-style: italic;
}

/* ---- footer nav ---- */
.footer {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 40px;
  border-top: 1px solid var(--hair);
  background: var(--paper);
}
.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--ink);
  background: none;
  border: 1px solid var(--hair);
  padding: 11px 20px;
  cursor: pointer;
  transition: border-color .18s ease, color .18s ease;
}
.nav-btn:hover:not(:disabled) { border-color: var(--ink); }
.nav-btn:disabled { opacity: 0.32; cursor: default; }
.nav-btn.primary {
  background: var(--seal);
  color: var(--paper);
  border-color: var(--seal);
}
.nav-btn.primary:hover { background: var(--seal-deep); border-color: var(--seal-deep); }
.nav-btn .arr { font-family: var(--mono); }
.dots { display: flex; gap: 9px; align-items: center; }
.dots button {
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 1px solid var(--ink-faint);
  background: none;
  padding: 0; cursor: pointer;
  transition: all .18s ease;
}
.dots button.on { background: var(--seal); border-color: var(--seal); transform: scale(1.15); }
.dots button.past { background: var(--ink-faint); border-color: var(--ink-faint); }

@media (max-width: 920px) {
  .topbar { padding: 16px 22px; }
  .rail { display: none; }
  .stage { padding: 32px 26px 90px; }
  .cols, .finale .cols { grid-template-columns: 1fr; gap: 30px; }
  .step-title { font-size: 38px; }
  .ghost { font-size: 34vh; }
}
`;

/* ---------- step data ---------- */
const KANJI = ["一", "二", "三", "四", "五", "六", "七"];

const STEPS = [
  {
    en: "Filleting", jp: "三枚おろし", romaji: "SANMAI OROSHI",
    photo: { tag: "Three-piece fillet — skin up, rib bones intact", img: "img/20260602_111813844_iOS.jpg" },
    moves: [
      { t: "Work cold and work fast.", x: " Mackerel flesh is soft and tears at the slightest drag — keep the board, your hands, and the fish chilled throughout." },
      { t: "Remove the head and gut the fish,", x: " then wash the cavity and flesh thoroughly under cold running water.", chip: "cold running water" },
      { t: "Pat completely dry the moment it leaves the water.", x: " Standing moisture accelerates spoilage and skews the cure." },
      { t: "Fillet into three pieces with a light hand.", x: " Let the knife do the work — never press or saw." },
      { t: "Leave the rib bones attached", x: " at this stage; they protect the belly through salting and curing." },
    ],
    note: { kind: "caution", body: "Do not skip the dry-off. Any wash water left on the surface will throw off both the salt and the vinegar timing downstream." },
  },
  {
    en: "Salt Cure", jp: "塩締め", romaji: "SHIO-JIME",
    photo: { tag: "Fillets blanketed in salt on an angled draining tray", gallery: [
      { img: "img/20260530_083758875_iOS.jpg", n: "01", cap: "An even bed of salt across the tray" },
      { img: "img/20260530_083916930_iOS.jpg", n: "02", cap: "Fillets laid skin-down on the salt" },
      { img: "img/20260530_084057035_iOS.jpg", n: "03", cap: "Blanketed evenly — a full cover, no bare spots" },
    ] },
    moves: [
      { t: "Lay the fillets skin-down and cover evenly with salt", x: " — a full, even blanket, no bare spots." },
      { t: "Cure to the size of the fish.", x: " Thinner fillets toward 45 minutes; thick, fatty winter saba toward the full hour.", chip: "45–60 min" },
      { t: "Elevate on a rack or angled tray", x: " so drawn-out moisture runs off rather than pooling against the flesh." },
    ],
    note: { kind: "tip", body: "Salt firms the flesh, seasons it, and pulls excess water before the vinegar ever touches it. Under-salting leaves the fillet slack and watery; over-salting turns it tough." },
  },
  {
    en: "Rinse & Submerge", jp: "酢洗い", romaji: "SU-ARAI",
    photo: { tag: "Rinsed fillet entering the saba vinegar bath, skin up" },
    moves: [
      { t: "Rinse the salt away completely", x: " under running water — run your fingertips over the surface to confirm none remains." },
      { t: "Pat completely dry once more", x: " before the fillet meets the marinade." },
      { t: "Submerge the fillets fully", x: " in the saba vinegar marinade, skin-side up." },
    ],
    note: { kind: "caution", body: "Wet flesh dilutes the marinade and gives a pale, uneven cure. Dry thoroughly — this is the second non-negotiable dry-off." },
  },
  {
    en: "Vinegar Cure", jp: "酢締め", romaji: "SU-JIME",
    photo: { tag: "Fillets in the saba vinegar marinade", gallery: [
      { img: "img/20260530_105855153_iOS.jpg", n: "01", cap: "Submerged in the saba vinegar marinade" },
      { img: "img/20260530_110256078_iOS.jpg", n: "02", cap: "Lifted out and rested — silver skin set" },
    ] },
    moves: [
      { t: "Marinate 40 – 50 minutes.", x: " The cure should reach the flesh but stop short of the centre — a translucent core is the mark of well-made shime saba.", chip: "40–50 min" },
      { t: "Lift from the marinade and gently wipe", x: " off the excess vinegar." },
      { t: "Rest the fillets.", x: " The flesh continues to firm and set as it sits — do not rush to the knife." },
    ],
    note: { kind: "tip", body: "Curing is feel, not just the clock. Larger, fattier fish want the upper end of the range — read the thickness in front of you and adjust." },
  },
  {
    en: "Bone Removal", jp: "骨抜き", romaji: "HONE-NUKI",
    photo: { tag: "Drawing pin bones with fish tweezers", gallery: [
      { img: "img/20260530_093547708_iOS.jpg", n: "01", cap: "Take extra care at the head end — these bones are easy to miss" },
      { img: "img/20260530_145742804_iOS.jpg", n: "02", cap: "Keep a water bath beside you to clear bones off the tweezers" },
    ] },
    moves: [
      { t: "Scrape away the rib bones", x: " in one clean sweep, following the curve of the belly." },
      { t: "Draw each pin bone in the direction it lies,", x: " using fish tweezers — pull along the bone, never against the grain of the flesh." },
      { t: "Run a fingertip down the centre line", x: " to find any strays before moving on." },
    ],
    note: { kind: "caution", body: "Torn flesh shows in the final slice and cannot be hidden. Patience over speed — protect the surface at every pull." },
  },
  {
    en: "Finishing", jp: "仕上げ", romaji: "SHIAGE",
    photo: { tag: "Peeling, scoring, torching and slicing for service", gallery: [
      { img: "img/20260530_151921783_iOS.jpg", n: "01", cap: "Peel the thin outer membrane from the head end" },
      { img: "img/20260530_093258986_iOS.jpg", n: "02", cap: "After the membrane is peeled — silver pattern intact" },
      { img: "img/20260530_093302856_iOS.jpg", n: "03", cap: "Score the surface lightly — the skin only, never the flesh" },
      { img: "img/20260530_102224146_iOS.jpg", n: "04", cap: "Lightly torched (aburi) and sliced for service" },
    ] },
    moves: [
      { t: "Peel the thin outer membrane from the back / head end,", x: " drawing it away in one steady motion to leave the silver pattern intact." },
      { t: "Score the surface lightly — surface only.", x: " The blade marks the skin pattern; it never cuts into the flesh." },
      { t: "Lightly torch the skin side (aburi),", x: " a single quick pass for aroma and a softened surface — no charring." },
      { t: "Slice for service", x: " at roughly 10 – 12 g per portion — about two slices, each 5 – 6 g.", chip: "10–12 g / portion" },
    ],
    note: { kind: "tip", body: "Long, single-direction strokes with a clean blade. Short sawing motions bruise the cure-softened flesh and dull the cut face." },
  },
  {
    en: "Serving", jp: "盛り付け", romaji: "MORITSUKE", finale: true,
    photo: { tag: "Plated shime saba — silver skin up, scored pattern showing", img: "img/20260527_145023649_iOS.jpg" },
    plating: [
      { k: "Temperature", v: "Serve well chilled. The slice should be cold and firm — never let it warm at the pass." },
      { k: "Face", v: "Present silver-skin side up so the scored pattern and any aburi marks read on the plate." },
      { k: "Aromatics", v: "Charred & poached leek, salsa rafano (horseradish emulsion), agro dolce, and olive oil." },
      { k: "Bed & garnish (Japanese way)", v: "A shiso leaf and a small mound of shredded daikon (ken) lift the silver against the white." },
      { k: "Condiment (Japanese way)", v: "A few drops of ponzu, or soy with grated ginger; a touch of karashi for those who like the edge." },
    ],
    note: { kind: "tip", body: "Shime saba keeps a day or two refrigerated and is often better the next morning, once the cure has fully settled into the flesh." },
  },
];

/* ---------- placeholder photo ---------- */
function Photo({ tag, img, className }) {
  if (img) {
    return (
      <div className={"photo has-img " + (className || "")}>
        <img src={img} alt={tag} />
      </div>
    );
  }
  return (
    <div className={"photo " + (className || "")}>
      <div className="tag"><b>Photo</b>{tag}</div>
    </div>
  );
}

/* ---------- sliding photo carousel ---------- */
function PhotoCarousel({ slides }) {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  return (
    <div className="carousel">
      <div className="carousel-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, k) => (
          <div className="carousel-slide" key={k}>
            <img src={s.img} alt={s.cap} />
            <div className="carousel-cap"><b>{s.n}</b>{s.cap}</div>
          </div>
        ))}
      </div>
      <button className="carousel-arrow prev" onClick={() => go(-1)} aria-label="Previous photo">←</button>
      <button className="carousel-arrow next" onClick={() => go(1)} aria-label="Next photo">→</button>
      <div className="carousel-dots">
        {slides.map((s, k) => (
          <button key={k} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={s.cap} />
        ))}
      </div>
    </div>
  );
}

/* ---------- a single move line ---------- */
function Move({ m }) {
  return (
    <li className="move">
      <div className="move-body">
        <span className="em">{m.t}</span>{m.x}
        {m.chip && <span className="chip">◷ {m.chip}</span>}
      </div>
    </li>
  );
}

/* ---------- callout ---------- */
function Callout({ note }) {
  const isTip = note.kind === "tip";
  return (
    <div className={"callout " + (isTip ? "tip" : "")}>
      <div className="seal">{isTip ? "訣" : "注"}</div>
      <div className="ctext">
        <div className="ckind">{isTip ? "Pro tip" : "Common mistake"}</div>
        <div className="cbody">{note.body}</div>
      </div>
    </div>
  );
}

/* ---------- main app ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#b8472f",
  "showKanji": true,
  "ghost": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [active, setActive] = useState(() => {
    const s = parseInt(localStorage.getItem("ss_step") || "0", 10);
    return isNaN(s) ? 0 : Math.min(Math.max(s, 0), STEPS.length - 1);
  });

  useEffect(() => { localStorage.setItem("ss_step", String(active)); }, [active]);

  // apply accent tweak
  useEffect(() => {
    document.documentElement.style.setProperty("--seal", t.accent);
  }, [t.accent]);

  const go = useCallback((i) => {
    setActive(Math.min(Math.max(i, 0), STEPS.length - 1));
    const main = document.querySelector(".main");
    if (main) main.scrollTop = 0;
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  const step = STEPS[active];
  const isLast = active === STEPS.length - 1;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="jp">〆鯖</span>
          <span className="en">Shime Saba</span>
        </div>
        <div className="meta">
          Cured Mackerel · Professional Method<br />
          Step <b>{String(active + 1).padStart(2, "0")}</b> of {String(STEPS.length).padStart(2, "0")}
        </div>
      </header>

      <div className="body">
        <nav className="rail">
          <div className="rail-head">Method</div>
          {STEPS.map((s, i) => (
            <button
              key={i}
              className={"step-item" + (i === active ? " active" : "") + (i < active ? " done checked" : "")}
              onClick={() => go(i)}
            >
              <span className="num">{KANJI[i]}</span>
              <span className="label">
                <span className="en">{s.en}</span>
                {t.showKanji && <span className="jp">{s.jp} · {s.romaji}</span>}
              </span>
              <span className="check" />
            </button>
          ))}
        </nav>

        <main className="main">
          {t.ghost && <div className="ghost">{step.jp[0]}</div>}
          <div className={"stage" + (step.finale ? " finale" : "")}>
            <div className="step-head">
              <div className="eyebrow">
                STEP {String(active + 1).padStart(2, "0")}
                <span className="slash">/</span>
                {step.romaji}
              </div>
              <h1 className="step-title">{step.en}</h1>
              {t.showKanji && <div className="step-sub">{step.jp}</div>}
            </div>

            {step.finale ? (
              <div className="cols">
                <Photo tag={step.photo.tag} img={step.photo.img} className="plate-photo" />                <div>
                  <ul className="plating-list">
                    {step.plating.map((p, i) => (
                      <li key={i}>
                        <div className="k">{p.k}</div>
                        <div className="v">{p.v}</div>
                        {p.jp && <div className="v-jp">{p.jp}</div>}
                      </li>
                    ))}
                  </ul>
                  <Callout note={step.note} />
                </div>
              </div>
            ) : (
              <div className="cols">
                {step.photo.gallery
                  ? <PhotoCarousel slides={step.photo.gallery} />
                  : <Photo tag={step.photo.tag} img={step.photo.img} />}
                <div>
                  <ol className="moves">
                    {step.moves.map((m, i) => <Move key={i} m={m} />)}
                  </ol>
                  <Callout note={step.note} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="footer">
        <button className="nav-btn" disabled={active === 0} onClick={() => go(active - 1)}>
          <span className="arr">←</span> Previous
        </button>
        <div className="dots">
          {STEPS.map((s, i) => (
            <button
              key={i}
              className={i === active ? "on" : (i < active ? "past" : "")}
              onClick={() => go(i)}
              aria-label={s.en}
            />
          ))}
        </div>
        <button
          className={"nav-btn" + (isLast ? "" : " primary")}
          disabled={isLast}
          onClick={() => go(active + 1)}
        >
          Next <span className="arr">→</span>
        </button>
      </footer>

      <TweaksPanel>
        <TweakSection label="Accent" />
        <TweakColor label="Seal colour" value={t.accent}
          options={["#b8472f", "#1f3a5f", "#3d3a34", "#6b7a4a"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Display" />
        <TweakToggle label="Japanese labels" value={t.showKanji}
          onChange={(v) => setTweak("showKanji", v)} />
        <TweakToggle label="Ghost numeral" value={t.ghost}
          onChange={(v) => setTweak("ghost", v)} />
      </TweaksPanel>
    </div>
  );
}

/* inject CSS + mount */
const styleEl = document.createElement("style");
styleEl.textContent = CSS;
document.head.appendChild(styleEl);

/* expose for the print build */
window.SS = { STEPS, KANJI, Photo, Move, Callout, CSS };

if (!window.__SS_PRINT__) {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}
