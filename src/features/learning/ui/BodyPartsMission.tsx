"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { useProfile } from "@/features/profile/ui/ProfileProvider";
import { BODY_PARTS_TEXT, BODY_PARTS_WORDS, completedAdventureStations, roundWords, type BodyWord } from "../body-parts-mission";

type Target = { id: string; x: number; y: number };
const FACE_TARGETS: Target[] = [
  { id: "eye-left", x: 43, y: 41 }, { id: "eye-right", x: 68, y: 32 },
  { id: "ear-left", x: 27, y: 56 }, { id: "ear-right", x: 81, y: 54 },
  { id: "nose", x: 61, y: 47 }, { id: "mouth", x: 56, y: 65 },
];
const BODY_TARGETS: Target[] = [
  { id: "head", x: 50, y: 20 },
  { id: "arm-left", x: 34, y: 42 }, { id: "arm-right", x: 66, y: 42 },
  { id: "hand-left", x: 10, y: 42 }, { id: "hand-right", x: 90, y: 42 },
  { id: "leg-left", x: 40, y: 75 }, { id: "leg-right", x: 60, y: 75 },
  { id: "foot-left", x: 39, y: 94 }, { id: "foot-right", x: 61, y: 94 },
];
const shuffled = <T,>(items: T[], seed: number) => {
  const result = [...items];
  let value = seed || 11;
  for (let i = result.length - 1; i > 0; i--) { value = (value * 9301 + 49297) % 233280; const j = Math.floor(value / 233280 * (i + 1)); [result[i], result[j]] = [result[j]!, result[i]!]; }
  return result;
};
const wordText = (word: BodyWord) => <span lang="en">{word.term}</span>;
const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const GAME_PATH_POINTS = [[9, 77], [20, 82], [29.5, 85.4], [39, 86.6], [53.6, 83.4], [63.5, 80], [72.3, 77], [80.6, 74]] as const;
const CALLOUTS: Record<string, [number, number]> = {
  eye: [80, 35], ear: [5, 52], nose: [81, 47], mouth: [80, 60],
  head: [76, 16], arm: [80, 41], hand: [2, 65], leg: [78, 75], foot: [72, 90],
};
const EMPTY_PLACED: readonly string[] = [];

function Figure({ round }: { round: 1 | 2 }) {
  return round === 1 ? (
    <div className="body-face-crop"><Image src={`${assetBase}/homepage/avatar-girl.webp`} alt={BODY_PARTS_TEXT.faceFigureAlt} fill sizes="(max-width: 620px) 100vw, 420px" className="body-face-art" unoptimized /></div>
  ) : (
    <div className="body-full-figure-crop"><Image src={`${assetBase}/learning/body-parts-girl.webp`} alt={BODY_PARTS_TEXT.bodyFigureAlt} fill sizes="(max-width: 620px) 200px, 240px" className="body-full-figure-art" unoptimized /></div>
  );
}

function DragonMarker() {
  return <svg viewBox="0 0 64 64" aria-hidden="true" className="body-dragon-vector">
    <path d="M13 39 4 25q13 0 21 9M51 39l9-14q-13 0-21 9" fill="#46d6e4" stroke="#4b2a9a" strokeWidth="3" strokeLinejoin="round"/>
    <path d="m20 19-1-11 10 8m16 3 3-11-11 8" fill="#ffd33e" stroke="#4b2a9a" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M10 37q0-20 22-22 22 2 22 22v10q-5 9-22 9T10 47Z" fill="#ae70eb" stroke="#4b2a9a" strokeWidth="3"/>
    <path d="M25 53q7-5 14 0l-1 6H26Z" fill="#ffe66b"/><ellipse cx="24" cy="34" rx="4" ry="6" fill="#fff"/><ellipse cx="40" cy="34" rx="4" ry="6" fill="#fff"/><circle cx="25" cy="35" r="2" fill="#273774"/><circle cx="39" cy="35" r="2" fill="#273774"/>
    <path d="M27 44q5 5 10 0" fill="none" stroke="#4b2a9a" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>;
}

export function BodyPartsMission() {
  const { service, state } = useProfile();
  const progress = state.status === "ready" ? state.snapshot.bodyMissionProgress : null;
  const canStartRun = state.status === "ready" && state.ownership === "exclusive";
  const [selected, setSelected] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [demoDismissedForRun, setDemoDismissedForRun] = useState(false);
  const [phase, setPhase] = useState<"intro" | "playing" | "round-complete" | "complete">("intro");
  const [message, setMessage] = useState("");
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [recentWord, setRecentWord] = useState<string | null>(null);
  const [hinted, setHinted] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [seed, setSeed] = useState(1);
  const [demoStep, setDemoStep] = useState(0);
  const pointerId = useRef<number | null>(null);
  const startRequested = useRef(false);
  const suppressClick = useRef(false);
  const didMove = useRef(false);
  const dragOrigin = useRef<[number, number]>([0, 0]);
  const [dragPreview, setDragPreview] = useState<{ word: BodyWord; x: number; y: number } | null>(null);
  const round = progress?.round ?? 1;
  const placed = progress?.placedWordIds ?? EMPTY_PLACED;
  const words = useMemo(() => shuffled(roundWords(round).filter((word) => !placed.includes(word.id)), seed), [round, placed, seed]);
  const targets = round === 1 ? FACE_TARGETS : BODY_TARGETS;
  const figureRef = useRef<HTMLDivElement>(null);
  const rewards = state.status === "ready" ? state.snapshot.rewardLedger : [];
  const gamesCompleted = completedAdventureStations(progress, rewards);
  const dragonPoint = GAME_PATH_POINTS[gamesCompleted]!;
  const activePhase = progress?.status === "completed" ? "complete" : progress && phase === "intro" ? "playing" : phase;
  const showDemo = demo || (!demoDismissedForRun && Boolean(progress?.status === "active" && !progress.demoSeen));
  const isPlaying = activePhase === "playing" && !showDemo;

  useEffect(() => {
    if (!demo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setDemoStep((step) => (step + 1) % 3), 650);
    return () => window.clearInterval(timer);
  }, [demo]);

  useEffect(() => {
    if (!service || !canStartRun || progress || startRequested.current) return;
    startRequested.current = true;
    setBusy(true);
    void service.startBodyMission().then((result) => {
      setBusy(false);
      if (result.status === "started") {
        setPhase("playing");
        setSeed((value) => value + 1);
        setMessage("");
      } else {
        startRequested.current = false;
        setMessage(BODY_PARTS_TEXT.saveError);
      }
    }).catch(() => {
      startRequested.current = false;
      setBusy(false);
      setMessage(BODY_PARTS_TEXT.saveError);
    });
  }, [service, canStartRun, progress]);

  useEffect(() => {
    const cancelDrag = () => { pointerId.current = null; setDragPreview(null); setSelected(null); suppressClick.current = false; };
    window.addEventListener("blur", cancelDrag);
    window.addEventListener("orientationchange", cancelDrag);
    return () => { window.removeEventListener("blur", cancelDrag); window.removeEventListener("orientationchange", cancelDrag); };
  }, []);

  const place = useCallback(async (wordId: string, targetId: string) => {
    if (busy || !progress || placed.includes(wordId) || demo || !isPlaying) return;
    const word = BODY_PARTS_WORDS.find((item) => item.id === wordId);
    if (!word) return;
    if (!word.targets.includes(targetId)) {
      setMistakes((current) => ({ ...current, [wordId]: (current[wordId] ?? 0) + 1 })); setMessage(BODY_PARTS_TEXT.retry); setSelected(null); return;
    }
    setBusy(true); setSelected(null); setMessage(BODY_PARTS_TEXT.correct);
    const result = await service?.placeBodyMissionWord(wordId, round, Boolean(hinted === wordId));
    setBusy(false);
      if (!result || result.status === "rejected" || result.status === "unsaved") { setMessage(BODY_PARTS_TEXT.saveRetry); return; }
    if (result.status === "round-complete") { setPhase("round-complete"); setMessage(BODY_PARTS_TEXT.roundOne); }
    if (result.status === "mission-complete") { setPhase("complete"); setMessage(BODY_PARTS_TEXT.complete); }
    if (result.status === "placed" || result.status === "round-complete" || result.status === "mission-complete") {
      setRecentWord(wordId); window.setTimeout(() => setRecentWord(null), 560);
      window.setTimeout(() => document.querySelector<HTMLButtonElement>(".body-word-card:not([disabled])")?.focus(), 50);
    }
  }, [busy, progress, placed, demo, isPlaying, service, round, hinted]);

  const finishDemo = async () => {
    setDemo(false); setDemoDismissedForRun(true); setMessage(""); await service?.setBodyMissionDemoSeen();
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>, wordId: string) => {
    if (pointerId.current !== null) { event.preventDefault(); return; }
    suppressClick.current = true;
    didMove.current = false;
    dragOrigin.current = [event.clientX, event.clientY];
    pointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelected(wordId);
    const word = BODY_PARTS_WORDS.find((item) => item.id === wordId);
    if (word) setDragPreview({ word, x: event.clientX, y: event.clientY });
  };
  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== event.pointerId) return;
    if (Math.hypot(event.clientX - dragOrigin.current[0], event.clientY - dragOrigin.current[1]) > 8) didMove.current = true;
    setDragPreview((current) => current ? { ...current, x: event.clientX, y: event.clientY } : current);
  };
  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>, wordId: string) => {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    setDragPreview(null);
    window.setTimeout(() => { suppressClick.current = false; }, 0);
    if (!didMove.current) return;
    const figure = figureRef.current;
    if (figure) {
      const rect = figure.getBoundingClientRect();
      const x = event.clientX, y = event.clientY;
      const candidates = [...figure.querySelectorAll<HTMLButtonElement>("[data-target-id]")].filter((element) => !element.disabled).map((element) => {
        const box = element.getBoundingClientRect(); return { element, distance: Math.hypot(x - (box.left + box.width / 2), y - (box.top + box.height / 2)) };
      }).sort((a, b) => a.distance - b.distance);
      const radius = Math.max(48, Math.min(rect.width, rect.height) * .105);
      if (candidates[0] && candidates[0].distance <= radius) { void place(wordId, candidates[0].element.dataset.targetId!); return; }
    }
    setSelected(null);
  };

  const nextRound = async () => {
    if (busy || !service) return;
    setBusy(true); const ok = await service.continueBodyMission(); setBusy(false);
    if (ok) { setPhase("playing"); setSeed((value) => value + 1); setMessage(""); }
  };
  const replay = async () => { setBusy(true); await service?.startBodyMission(); setBusy(false); setPhase("playing"); setSeed((value) => value + 1); setMistakes({}); setHinted(null); setMessage(""); };

  if (state.status === "loading") return <section className="body-mission-card"><p>{BODY_PARTS_TEXT.loading}</p></section>;
  if (state.status === "recovery") return <section className="body-mission-card"><h1>{BODY_PARTS_TEXT.title}</h1><p>{BODY_PARTS_TEXT.unavailable}</p></section>;
  if (state.status === "ready" && state.ownership === "read-only") return <section className="body-mission-card"><h1>{BODY_PARTS_TEXT.title}</h1><p>{BODY_PARTS_TEXT.readOnly}</p></section>;

  return <section className="body-mission" aria-labelledby="body-mission-title">
    <header className="body-mission-heading"><div><div className="body-heading-topline"><Link className="body-back-link" href="/scienceworld">{BODY_PARTS_TEXT.backToScienceWorld}</Link><p className="body-mission-kicker">{BODY_PARTS_TEXT.eyebrow}</p></div><h1 id="body-mission-title">{BODY_PARTS_TEXT.title}</h1><p>{BODY_PARTS_TEXT.instructions} {BODY_PARTS_TEXT.alternative}</p></div><button type="button" className="body-help-button" aria-label={BODY_PARTS_TEXT.helpLabel} onClick={() => { setDemo(true); setDemoStep(0); }}>?</button></header>
    <div className="body-progress-wrap">
      <div className="body-progress-path" style={{ backgroundImage: `url("${assetBase}/learning/adventure-progress-path.webp")` }} role="progressbar" aria-label="Camino de juegos" aria-valuemin={0} aria-valuemax={7} aria-valuenow={gamesCompleted}>
        <span className="body-path-dragon" style={{ left: `${dragonPoint[0]}%`, top: `${dragonPoint[1]}%` }} aria-hidden="true"><Image className="body-dragon-gif" src={`${assetBase}/learning/dragon-progress.webp`} alt="" width={64} height={64} unoptimized/><span className="body-dragon-still"><DragonMarker/></span></span>
      </div>
    </div>
    <p className="body-round-label">{BODY_PARTS_TEXT.roundLabel(round)}</p>
    <div className="body-game-area">
      <div className={`body-figure-area ${round === 2 ? "is-full-body" : ""}`} ref={figureRef}>
        <Figure round={round}/>
        {targets.map((target) => {
          const word = BODY_PARTS_WORDS.find((item) => item.targets.includes(target.id));
          const alreadyPlaced = Boolean(word && placed.includes(word.id));
          return <button key={target.id} type="button" className={`body-target is-quiet-target ${selected && word?.id === selected ? "is-selected" : ""} ${hinted && word?.id === hinted ? "is-hinted" : ""} ${word?.id === recentWord ? "is-recent" : ""}`} data-target-id={target.id} style={{ left: `${target.x}%`, top: `${target.y}%` }} disabled={alreadyPlaced || !isPlaying || busy} aria-label={word?.meaning ?? target.id} aria-pressed={Boolean(word && selected === word.id)} onClick={() => { if (selected) void place(selected, target.id); }} onKeyDown={(event) => { if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); const buttons = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[data-target-id]:not(:disabled)") ?? []); const step = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1; buttons[(buttons.indexOf(event.currentTarget) + step + buttons.length) % (buttons.length || 1)]?.focus(); } if (event.key === "Escape") setSelected(null); }}>
            <span aria-hidden="true">{alreadyPlaced ? "✓" : ""}</span>
          </button>;
        })}
        {roundWords(round).filter((word) => placed.includes(word.id)).map((word) => <span key={word.id} lang="en" className={`body-placement-label body-label-${word.id}`} style={{ left: `${CALLOUTS[word.id]![0]}%`, top: `${CALLOUTS[word.id]![1]}%` }}>{word.term}</span>)}
      </div>
      <div className="body-card-area" aria-label={BODY_PARTS_TEXT.cardsLabel}>
        {words.map((word) => <button key={word.id} type="button" style={dragPreview?.word.id === word.id ? { opacity: 0 } : undefined} className={`body-word-card ${selected === word.id ? "is-selected" : ""}`} aria-pressed={selected === word.id} disabled={!isPlaying || busy} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } const next = selected === word.id ? null : word.id; setSelected(next); if (next) window.setTimeout(() => document.querySelector<HTMLButtonElement>("[data-target-id]:not(:disabled)")?.focus(), 0); }} onKeyDown={(event) => { if (event.key === "Escape") setSelected(null); }} onPointerDown={(event) => handlePointerDown(event, word.id)} onPointerMove={handlePointerMove} onPointerUp={(event) => handlePointerUp(event, word.id)} onPointerCancel={() => { pointerId.current = null; setDragPreview(null); setSelected(null); suppressClick.current = false; }}>{wordText(word)}</button>)}
      </div>
    </div>
    {dragPreview && <span className="body-drag-preview" style={{ left: dragPreview.x, top: dragPreview.y }} aria-hidden="true">{wordText(dragPreview.word)}</span>}
    {(isPlaying || message) && <div className="body-feedback" aria-live="polite" aria-atomic="true">{message}{selected && <span> · {BODY_PARTS_TEXT.chooseTarget}</span>}</div>}
    {isPlaying && Object.entries(mistakes).filter(([, count]) => count >= 3).map(([wordId]) => <button type="button" className="body-hint-button" key={wordId} onClick={() => { setHinted(wordId); setMessage(BODY_PARTS_TEXT.hintFor(wordId)); }} aria-label={`${BODY_PARTS_TEXT.hint} para ${wordId}`}>💡 {BODY_PARTS_TEXT.hint}: {wordId}</button>)}
    {activePhase === "round-complete" && <div className="body-end-panel" aria-live="polite"><h2>{BODY_PARTS_TEXT.roundOne}</h2><button className="action" type="button" onClick={() => void nextRound()} disabled={busy}>{BODY_PARTS_TEXT.continue}</button></div>}
    {activePhase === "complete" && <div className="body-end-panel" aria-live="polite"><h2>{BODY_PARTS_TEXT.complete}</h2><div className="body-word-summary">{BODY_PARTS_WORDS.map((word) => <span key={word.id}><span className="body-word-icon" role="img" aria-label={word.meaning}>{word.image}</span>{wordText(word)}</span>)}</div><button className="action" type="button" onClick={() => void replay()} disabled={busy}>{BODY_PARTS_TEXT.replay}</button><Link className="action body-friend-link" href="/avatar">{BODY_PARTS_TEXT.friend}</Link></div>}
    {showDemo && <div className="body-demo-scrim" role="dialog" aria-modal="true" aria-labelledby="body-demo-title"><section className="body-demo-card"><h2 id="body-demo-title">{BODY_PARTS_TEXT.demoTitle}</h2><p>{BODY_PARTS_TEXT.demoInstructions}</p><div className="body-demo-example"><span className={demoStep === 0 ? "is-demo-highlight" : ""} lang="en">eye</span><b aria-hidden="true">➜</b><span className={demoStep > 0 ? "is-demo-highlight" : ""} aria-hidden="true">👁️</span></div><div><button className="action" type="button" onClick={() => void finishDemo()}>{BODY_PARTS_TEXT.beginAfterDemo}</button></div></section></div>}
  </section>;
}
