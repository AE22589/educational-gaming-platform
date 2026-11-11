import { useEffect, useRef, useState } from "react";
import { SportsPicture } from "./SportsPicture";
import { sportsVocabulary, type VocabularyItem } from "./vocabulary";
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

export function SpellAndSpot({ round, onAnswer, onNext }: {
  round: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}) {
  const item = sportsVocabulary[round]!;
  const [letters, setLetters] = useState("");
  const [step, setStep] = useState<"spell" | "spot" | "found">("spell");
  const [feedback, setFeedback] = useState("");
  const prompt = useRef<HTMLParagraphElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const vowels = item.word.match(/[aeiou]/g) ?? [];
  const missing = vowels.slice(0, 2).join("");
  let hidden = 0;
  const pattern = item.word.replace(/[aeiou]/g, (letter) => hidden++ < missing.length ? "_" : letter);

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
            Find the <strong>{sceneNames[item.word] ?? item.word}</strong>!
          </p>
          {sceneNames[item.word] && sceneNames[item.word] !== item.word && <p lang="en">{item.word}</p>}
        </>
      )}
      <div className={styles.scene} role="group" aria-label="Escena deportiva"
        style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_BASE_PATH}/englishworld/sports-equipment/park.webp")` }}
        onClick={(event) => { if (event.target === event.currentTarget) spot(); }}>
        <span className={styles.sceneCamera} aria-hidden="true">📷</span>
        {sportsVocabulary.map((object) => {
          const [left, top, painted] = locations[object.word]!;
          return (
            <button type="button" className={styles.sceneObject} key={object.word}
              style={{ left: `${left}%`, top: `${top}%` }}
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
