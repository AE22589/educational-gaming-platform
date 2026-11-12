import { useEffect, useRef, useState } from "react";
import { SportsPicture } from "./SportsPicture";
import { scramble, type VocabularyItem } from "./vocabulary";
import styles from "./sports.module.css";

const sceneNames: Record<string, string> = {
  hockey: "hockey stick",
  football: "football",
  basketball: "basketball",
  tennis: "tennis ball",
  "table tennis": "table tennis paddle",
  badminton: "shuttlecock",
  baseball: "baseball",
  swimming: "swimmer",
  cycling: "cyclist",
  skateboarding: "skateboard",
};

// Painted objects use the same hit areas as the vocabulary props laid over the picture.
const locations: Record<string, [left: number, top: number, painted?: true]> = {
  hockey: [43, 39],
  football: [66, 34, true],
  basketball: [29, 49, true],
  tennis: [43, 53],
  "table tennis": [73, 71],
  badminton: [36, 41],
  baseball: [82, 50],
  swimming: [81, 23],
  cycling: [88, 40, true],
  skateboarding: [66, 66],
  bat: [72, 95],
  racket: [13, 49, true],
  helmet: [89, 25, true],
  gloves: [6, 57],
  "knee pads": [93, 52],
  "elbow pads": [65, 75],
};

export function SpellAndSpot({ round, vocabulary, unit, onAnswer, onNext }: {
  round: number;
  vocabulary: VocabularyItem[];
  unit: "sports" | "seasons";
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}) {
  const item = vocabulary[round]!;
  const park = unit === "sports" && vocabulary.every(({ word }) => locations[word]);
  const start = Math.floor(round / 8) * 8;
  const objects = park ? vocabulary : scramble(vocabulary.slice(start, start + 8), start + 17);
  const sceneName = park ? sceneNames[item.word] : undefined;
  const [letters, setLetters] = useState("");
  const [step, setStep] = useState<"spell" | "spot" | "found">("spell");
  const [feedback, setFeedback] = useState("");
  const prompt = useRef<HTMLParagraphElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const hide = /[aeiou]/.test(item.word) ? /[aeiou]/g : /[a-z]/g;
  const blanks = Array.from(item.word.matchAll(hide)).slice(0, 2);
  const missing = blanks.map(([letter]) => letter).join("");
  const pattern = item.word.split("").map((letter, index) =>
    blanks.some((blank) => blank.index === index) ? "_" : letter).join("");

  useEffect(() => {
    if (step === "spot") prompt.current?.focus();
    if (step === "found") next.current?.focus();
  }, [step]);

  function spot(candidate?: VocabularyItem) {
    if (step !== "spot") return;
    const correct = candidate === item;
    onAnswer(correct);
    if (correct) {
      setStep("found");
      setFeedback("¡Lo encontraste!");
    } else {
      setFeedback("Sigue buscando. ¡Puedes intentarlo otra vez!");
    }
  }

  return (
    <>
      {step === "spell" ? (
        <>
          <p className={styles.prompt}>Escribe las letras que faltan.</p>
          <p className={styles.missing} lang="en"
            aria-label={pattern.replaceAll("_", " blank ")}>{pattern}</p>
          <p>{item.translation}</p>
          <form className={styles.choices} onSubmit={(event) => {
            event.preventDefault();
            if (letters.length !== missing.length) return;
            if (letters.toLowerCase() === missing) {
              setFeedback("");
              setStep("spot");
            } else {
              onAnswer(false);
              setFeedback("Casi. Prueba con otras letras.");
            }
          }}>
            <input className={styles.input} aria-label="Letras que faltan"
              autoComplete="off" autoCapitalize="none" spellCheck={false}
              value={letters} onChange={(event) => {
                setLetters(event.target.value.replace(/[^a-z]/gi, "").slice(0, missing.length));
                setFeedback("");
              }} />
            <button className={styles.primary} disabled={letters.length !== missing.length} lang="en">Check</button>
          </form>
        </>
      ) : (
        <>
          <p className={styles.prompt} ref={prompt} tabIndex={-1} lang="en">
            Find: <strong>{sceneName ?? item.word}</strong>
          </p>
          {sceneName && sceneName !== item.word && <p lang="en">{item.word}</p>}
        </>
      )}
      <div className={`${styles.scene} ${park ? "" : styles.iconScene}`} role="group"
        aria-label={park ? "Escena deportiva" : "Busca el dibujo"}
        style={park ? { backgroundImage: `url("${process.env.NEXT_PUBLIC_BASE_PATH}/englishworld/sports-equipment/park.webp")` } : undefined}
        onClick={(event) => { if (event.target === event.currentTarget) spot(); }}>
        {park && <span className={styles.sceneCamera} aria-hidden="true">📷</span>}
        {objects.map((object) => {
          const [left, top, painted] = park ? locations[object.word]! : [];
          return (
            <button type="button" className={park ? styles.sceneObject : styles.iconObject} key={object.word}
              style={park ? { left: `${left}%`, top: `${top}%` } : undefined}
              aria-label={object.translation} data-painted={painted}
              disabled={step !== "spot"} data-found={step === "found" && object === item}
              onClick={() => spot(object)}>
              {!painted && <SportsPicture item={object} />}
            </button>
          );
        })}
      </div>
      <p className={styles.feedback} role="status">{feedback}</p>
      {step === "found" && <button ref={next} className={styles.primary} onClick={onNext} lang="en">Next →</button>}
    </>
  );
}
