/* ============================================================
   Chalk Stream Trout — tataki prep, interactive guide
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
.photo.has-img .tag { position: relative; z-index: 1; margin: auto 0 0 0; }

/* ---- stacked photos (two-up) ---- */
.photo-stack { display: flex; flex-direction: column; gap: 14px; }
.photo.stacked { aspect-ratio: 3 / 2; }

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

/* ---- ratio block (marinade) ---- */
.ratio {
  margin-top: 28px;
  border: 1px solid var(--hair);
  background: var(--paper-deep);
  padding: 22px 24px;
}
.ratio .rk {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 16px;
}
.ratio .rrow {
  display: flex;
  align-items: baseline;
  gap: 14px;
}
.ratio .ing {
  flex: 1;
  text-align: center;
}
.ratio .ing .name {
  font-family: var(--serif);
  font-size: 19px;
  color: var(--ink);
}
.ratio .ing .sub {
  display: block;
  font-family: var(--serif);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--ink-faint);
  margin-top: 4px;
}
.ratio .ing .part {
  display: block;
  font-family: var(--mono);
  font-size: 24px;
  color: var(--seal);
  margin-top: 10px;
}
.ratio .colon {
  font-family: var(--mono);
  font-size: 22px;
  color: var(--ink-faint);
  align-self: center;
  padding-bottom: 4px;
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
  .cols { grid-template-columns: 1fr; gap: 30px; }
  .step-title { font-size: 38px; }
  .ghost { font-size: 34vh; }
}
`;

/* ---------- step data ---------- */
const KANJI = ["一", "二", "三", "四", "五", "六", "七", "八"];

const STEPS = [
  {
    en: "Pin Bone Removal", jp: "骨抜き", romaji: "HONE-NUKI",
    photo: { tag: "Drawing a pin bone from the trout fillet with fish tweezers" },
    moves: [
      { t: "Draw every pin bone before anything else.", x: " Run a fingertip down the centre line to feel them out, then pull each one clear with fish tweezers." },
      { t: "Pull in the direction the bone lies,", x: " following the grain — never tug against it, or the soft trout flesh will tear." },
      { t: "Make a second pass to confirm the fillet is clean", x: " before you portion. A missed bone shows up at service." },
    ],
    note: { kind: "caution", body: "Torn flesh shows in the final slice and cannot be hidden. Work patiently and protect the surface at every pull." },
  },
  {
    en: "Portioning", jp: "節取り", romaji: "FUSHI-DORI",
    photo: { tag: "Fillet cut into even blocks, skin removed, centre line set aside", img: "img/20260530_090347668_iOS.jpg" },
    moves: [
      { t: "Cut the fillet into smaller blocks", x: " — roughly four pieces per fillet — to make the flesh easier to handle.", chip: "≈ 4 blocks / fillet" },
      { t: "Remove the skin", x: " from each block." },
      { t: "Set aside the section along the centre bone line.", x: " It runs too firm and tough — keep it out of the tataki." },
    ],
    note: { kind: "tip", body: "Even blocks sear and slice evenly. Trim to a uniform thickness now and every later step gets easier." },
  },
  {
    en: "Light Salt Cure", jp: "塩締め", romaji: "SHIO-JIME",
    photo: { tag: "From above — blocks salted evenly and resting in the tray", img: "img/20260530_090933587_iOS.jpg" },
    moves: [
      { t: "Salt the blocks lightly and evenly on all sides.", x: " A light dusting — this is a gentle cure, not a heavy salt." },
      { t: "Lay them out with space between", x: " so every face takes salt and none sit wet against another." },
    ],
    note: { kind: "tip", body: "A light hand here firms and seasons the flesh and tightens the surface — let the marinade do the flavouring. Over-salt now and the finished tataki turns tough and dry." },
  },
  {
    en: "Cure — Rest & Wipe", jp: "塩締め", romaji: "SHIO-JIME",
    photo: { tag: "Close — a fine, even dusting of salt across the surface", img: "img/20260530_090941466_iOS.jpg" },
    moves: [
      { t: "Rest about 20–30 minutes", x: " to firm the flesh and draw off a little surface moisture.", chip: "≈ 20-30 min" },
      { t: "Wipe away the beaded moisture", x: " and pat dry before the blocks go into the marinade." },
    ],
    note: { kind: "caution", body: "Don’t rinse the blocks — a quick wipe is enough. Soaking them washes off the cure you just set and waterlogs the surface before it sears." },
  },
  {
    en: "Marinating", jp: "漬け", romaji: "ZUKE",
    photo: { tag: "Trout blocks submerged in the soy / sake / mirin marinade" },
    ratio: [
      { name: "Soy", sub: "醤油", part: "1" },
      { name: "Sake", sub: "酒", part: "1" },
      { name: "Mirin", sub: "みりん", part: "1" },
    ],
    moves: [
      { t: "Marinate in equal parts soy, sake and mirin", x: " — a clean 1 : 1 : 1 ratio.", chip: "1 : 1 : 1" },
      { t: "Hold for 20 – 30 minutes,", x: " just long enough to season the surface without curing through.", chip: "20–30 min" },
    ],
    note: { kind: "tip", body: "Equal parts keep the marinade balanced — salt from the soy, sweetness from the mirin, depth from the sake. Don't push past the half hour or the seasoning dominates the fish." },
  },
  {
    en: "After Marinating", jp: "休ませ", romaji: "YASUMASE",
    photo: { tag: "Blocks lifted from marinade, patted dry, resting on a tray" },
    moves: [
      { t: "Lift the blocks from the marinade and pat them completely dry.", x: " Surface moisture will steam rather than sear in the next step." },
      { t: "Let the flesh rest a while", x: " so it settles and firms up before it meets the pan." },
    ],
    note: { kind: "caution", body: "Don't rush from marinade to heat. A wet, slack block sears poorly and falls apart on the board." },
  },
  {
    en: "Tataki", jp: "たたき", romaji: "TATAKI",
    photo: { tag: "Searing a block in a very hot pan — surface only, core left raw" },
    moves: [
      { t: "Sear in a very hot pan", x: " to make the tataki — a quick, hard kiss of heat on the surface, the centre left raw." },
      { t: "Do not slice while still hot.", x: " The seared surface is fragile and will break apart under the knife." },
      { t: "Let it cool completely before slicing.", x: " A fully cooled block holds its seared edge and cuts clean.", chip: "cool fully" },
    ],
    note: { kind: "caution", body: "Heat sets the surface, not the core. Pull the block the moment the outside colours — any longer and you cook the flesh you want raw." },
  },
  {
    en: "For Service", jp: "切り付け", romaji: "KIRI-TSUKE",
    photo: { tag: "Slicing the cooled tataki block to portion for the plate" },
    moves: [
      { t: "Slice the cooled block for service", x: " at roughly 15 – 20 g per portion.", chip: "15–20 g / portion" },
      { t: "Use long, single-direction strokes", x: " with a clean blade — short sawing motions bruise the seared edge and dull the cut face." },
    ],
    note: { kind: "tip", body: "Slice only what you're plating. The seared surface is at its best the moment it's cut — cold, firm, and clean-edged." },
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

/* ---------- marinade ratio block ---------- */
function Ratio({ items }) {
  return (
    <div className="ratio">
      <div className="rk">Marinade ratio</div>
      <div className="rrow">
        {items.map((it, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="colon">:</span>}
            <div className="ing">
              <span className="name">{it.name}</span>
              <span className="sub">{it.sub}</span>
              <span className="part">{it.part}</span>
            </div>
          </React.Fragment>
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
    const s = parseInt(localStorage.getItem("cst_step") || "0", 10);
    return isNaN(s) ? 0 : Math.min(Math.max(s, 0), STEPS.length - 1);
  });

  useEffect(() => { localStorage.setItem("cst_step", String(active)); }, [active]);

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
          <span className="jp">鱒たたき</span>
          <span className="en">Chalk Stream Trout</span>
        </div>
        <div className="meta">
          Trout Tataki · Kitchen Prep<br />
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
          <div className="stage">
            <div className="step-head">
              <div className="eyebrow">
                STEP {String(active + 1).padStart(2, "0")}
                <span className="slash">/</span>
                {step.romaji}
              </div>
              <h1 className="step-title">{step.en}</h1>
              {t.showKanji && <div className="step-sub">{step.jp}</div>}
            </div>

            <div className="cols">
              {step.photos ? (
                <div className="photo-stack">
                  {step.photos.map((p, i) => (
                    <Photo key={i} tag={p.tag} img={p.img} className="stacked" />
                  ))}
                </div>
              ) : (
                <Photo tag={step.photo.tag} img={step.photo.img} />
              )}
              <div>
                <ol className="moves">
                  {step.moves.map((m, i) => <Move key={i} m={m} />)}
                </ol>
                {step.ratio && <Ratio items={step.ratio} />}
                <Callout note={step.note} />
              </div>
            </div>
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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
