"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeWord, scramble, type VocabularyItem } from "./vocabulary";
import { WordHunt } from "./WordHunt";
import { SpellAndSpot } from "./SpellAndSpot";
import { SortWords } from "./SortWords";
import { SportsPicture } from "./SportsPicture";
import { playAnswerSound } from "./answer-sound";
import styles from "./sports.module.css";

const games = [
  { id: "match", name: "Picture Match", description: "Une cada dibujo con su palabra.", art: "🖼️ ⚽", color: "blue" },
  { id: "mystery", name: "Mystery Word", description: "Adivina la letra que falta.", art: "🔤 ✏️", color: "green" },
  { id: "phrase", name: "Build a Phrase", description: "Ordena las palabras de la frase.", art: "💬 🧩", color: "pink" },
  { id: "spell", name: "See It, Hear It, Spell It", description: "Mira o escucha y escribe.", art: "🎧 ⌨️", color: "sky" },
  { id: "scramble", name: "Letter Scramble", description: "Pon las letras en orden.", art: "🔠 🔀", color: "lime" },
  { id: "hunt", name: "Word Hunt", description: "Encuentra palabras en la cuadrícula.", art: "🔡 🔎", color: "lavender" },
  { id: "spot", name: "Look & Find", description: "Completa la palabra y toca el objeto.", art: "✏️ 👀", color: "peach" },
  { id: "sort", name: "Play, Go, Do, Wear?", description: "Clasifica deportes y objetos.", art: "⚽ 🧢", color: "mint" },
] as const;

type Game = Omit<(typeof games)[number], "name"> & { name: string };

export function UnitGames({ vocabulary, unit }: {
  vocabulary: VocabularyItem[];
  unit: "sports" | "seasons";
}) {
  const [game, setGame] = useState<Game | null>(null);
  const [selection, setSelection] = useState(0);
  const [stars, setStars] = useState(0);
  const [bestScores, setBestScores] = useState<Partial<Record<Game["id"], number>>>({});
  const [matchOrder, setMatchOrder] = useState<VocabularyItem[]>(() => [...vocabulary]);
  const audio = useRef<AudioContext | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (selection > 0) heading.current?.focus();
  }, [selection]);

  useEffect(() => () => {
    void audio.current?.close().catch(() => {});
    audio.current = null;
  }, []);

  function complete(id: Game["id"], score: number) {
    setBestScores((previous) => ({ ...previous, [id]: Math.max(previous[id] ?? 0, score) }));
    if (id === "match") {
      const seed = Math.floor(Math.random() * 0x100000000);
      setMatchOrder((previous) => {
        const next = scramble(previous, seed);
        if (next[0] === previous[0]) next.push(next.shift()!);
        return next;
      });
    }
  }

  function scoreMatch(correct: boolean) {
    if (typeof AudioContext === "undefined") return;
    try {
      audio.current ??= new AudioContext();
      void playAnswerSound(audio.current, correct).catch(() => {});
    } catch {
      // The counters and visual feedback still work when audio is unavailable.
    }
  }

  return (
    <>
      <section className={styles.catalog} aria-label="Juegos de inglés">
        {games.map((entry) => {
          const best = bestScores[entry.id];
          const questions = vocabulary.length;
          const seasonalSort = unit === "seasons" && entry.id === "sort";
          const name = seasonalSort ? "Weather, Season or Activity?" : entry.name;
          const description = seasonalSort ? "Clasifica el tiempo, las estaciones y las actividades." : entry.description;
          const art = unit === "seasons" && entry.id === "match" ? "🖼️ ☀️"
            : seasonalSort ? "☀️ 🍂" : entry.art;
          return (
            <button key={entry.id} type="button" className={styles.card} data-color={entry.color}
              aria-expanded={game?.id === entry.id} aria-controls="unit-game"
              onClick={() => {
                setGame({ ...entry, name });
                setSelection((previous) => previous + 1);
              }}>
              <span className={styles.cardArt} aria-hidden="true">{art}</span>
              <span className={styles.cardCopy}>
                <strong className={styles.cardTitle} lang="en">
                  {name}
                  {best !== undefined && (
                    <span className={styles.medal} role="img"
                      aria-label={`Best score: ${best} of ${questions} correct on the first try`}>
                      ★<span aria-hidden="true" style={{ width: `${best / questions * 100}%` }}>★</span>
                    </span>
                  )}
                </strong>
                <span>{description}</span>
              </span>
              <span className={styles.arrow} aria-hidden="true">›</span>
            </button>
          );
        })}
      </section>
      <div className={styles.starCounter} role="status">
        <span aria-hidden="true">⭐</span> Estrellas <strong>{stars}</strong>
      </div>
      <section id="unit-game" className={styles.play} hidden={!game} aria-labelledby="unit-game-title">
        {game && (
          <>
            <h2 id="unit-game-title" ref={heading} tabIndex={-1} lang="en">{game.name}</h2>
            <Activity key={selection} game={game} matchOrder={matchOrder} vocabulary={vocabulary} unit={unit}
              onComplete={(score) => complete(game.id, score)} onMatchAnswer={scoreMatch}
              onStar={() => setStars((count) => count + 1)} />
          </>
        )}
      </section>
    </>
  );
}

function Activity({ game, matchOrder, vocabulary, unit, onComplete, onMatchAnswer, onStar }: {
  game: Game;
  matchOrder: VocabularyItem[];
  vocabulary: VocabularyItem[];
  unit: "sports" | "seasons";
  onComplete: (score: number) => void;
  onMatchAnswer: (correct: boolean) => void;
  onStar: () => void;
}) {
  const [round, setRound] = useState(0);
  const [words, setWords] = useState(matchOrder);
  const [mistakes, setMistakes] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const run = useRef({ solved: 0, firstTry: 0, missed: false });
  const progress = useRef<HTMLParagraphElement>(null);
  const questions = vocabulary.length;
  const total = game.id === "hunt" ? Math.ceil(questions / 4) : questions;

  function recordAnswer(correct: boolean) {
    const score = run.current;
    if (correct) {
      if (!score.missed) {
        score.firstTry += 1;
        onStar();
      }
      score.missed = false;
      score.solved += 1;
      setCorrectCount(score.solved);
      if (score.solved === questions) onComplete(score.firstTry);
    } else {
      score.missed = true;
      setMistakes((count) => count + 1);
    }
    if (game.id === "match") onMatchAnswer(correct);
  }

  function replay() {
    run.current = { solved: 0, firstTry: 0, missed: false };
    setCorrectCount(0);
    setMistakes(0);
    setWords(matchOrder);
    advance(0);
  }

  function advance(next: number) {
    setRound(next);
    progress.current?.focus();
  }

  const roundProps = { round, onAnswer: recordAnswer, onNext: () => advance(round + 1) };

  return (
    <>
      <p className={styles.progress} tabIndex={-1} ref={progress}>
        {round === total ? "Juego completado" : `Ronda ${round + 1} de ${total}`}
      </p>
      {round === total ? (
        <div className={styles.finished}>
          <span aria-hidden="true">🏆</span>
          <p>¡Muy bien! Has completado todas las rondas.</p>
          <button className={styles.primary} onClick={replay}>Volver a jugar</button>
        </div>
      ) : game.id === "hunt" ? (
        <WordHunt key={round} vocabulary={vocabulary} {...roundProps} />
      ) : game.id === "spot" ? (
        <SpellAndSpot key={round} vocabulary={vocabulary} unit={unit} {...roundProps} />
      ) : game.id === "sort" ? (
        <SortWords key={round} item={vocabulary[round]!} unit={unit} {...roundProps} />
      ) : (
        <VocabularyRound key={round} id={game.id}
          vocabulary={vocabulary} item={(game.id === "match" ? words : vocabulary)[round]!} {...roundProps} />
      )}
      <div className={styles.results} role="status">
        <span lang="en">✓ Correct <strong>{correctCount}</strong></span>
        <span lang="en">✕ Mistakes <strong>{mistakes}</strong></span>
      </div>
    </>
  );
}

function VocabularyRound({ id, round, item, vocabulary, onAnswer, onNext }: {
  id: Exclude<Game["id"], "hunt" | "spot" | "sort">;
  round: number;
  item: VocabularyItem;
  vocabulary: VocabularyItem[];
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}) {
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const answered = useRef(false);
  const [answer, setAnswer] = useState("");
  const [audioMessage, setAudioMessage] = useState("");
  const correct = feedback === "correct";
  const letters = Array.from(item.word);
  const letterPositions = letters.flatMap((letter, index) => /\p{L}/u.test(letter) ? [index] : []);
  const missing = letterPositions[(round + 1) % letterPositions.length]!;
  const letter = letters[missing]!;
  const options = scramble([letter, ...Array.from("aeiotrsl").filter((option) => option !== letter)
    .slice(round % 4, round % 4 + 2)], round + 9);
  const matchDistractors = scramble(vocabulary.filter((entry) => entry !== item), round + 5).slice(0, 3);
  const matchOptions = scramble([item, ...matchDistractors], round + 11);

  useEffect(() => {
    if (id === "spell") return () => window.speechSynthesis?.cancel();
  }, [id]);

  function check(value: string, expected: string) {
    if (answered.current) return;
    const matches = normalizeWord(value) === normalizeWord(expected);
    answered.current = matches;
    setFeedback(matches ? "correct" : "retry");
    onAnswer(matches);
  }

  function speak() {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") {
      setAudioMessage("Puedes usar el dibujo como pista.");
      return;
    }
    window.speechSynthesis.cancel();
    setAudioMessage("");
    const speech = new SpeechSynthesisUtterance(item.word);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((voice) => voice.lang === "en-GB" && voice.localService)
      ?? voices.find((voice) => voice.lang.startsWith("en") && voice.localService);
    if (!englishVoice) {
      setAudioMessage("No hay una voz en inglés disponible. Usa el dibujo como pista.");
      return;
    }
    speech.voice = englishVoice;
    speech.lang = englishVoice.lang;
    speech.rate = 0.8;
    speech.onerror = () => setAudioMessage("No se pudo reproducir el audio. Usa el dibujo como pista.");
    window.speechSynthesis.speak(speech);
  }

  return (
    <>
      <p className={styles.prompt}>{{
        match: "¿Qué palabra va con el dibujo?",
        mystery: "Elige la letra que falta.",
        phrase: "Arrastra o toca las palabras y pulsa Check.",
        spell: "Mira el dibujo o escucha la palabra. Escríbela en inglés.",
        scramble: "Toca las letras en el orden correcto. Junta las palabras si hay más de una.",
      }[id]}</p>
      <SportsPicture item={item} />
      {id === "match" && (
        <div className={styles.choices} lang="en">
          {matchOptions.map(({ word }) => (
            <button className={styles.tile} key={word} disabled={correct}
              onClick={() => check(word, item.word)}>{word}</button>
          ))}
        </div>
      )}
      {id === "mystery" && (
        <>
          <p className={styles.missing} lang="en" aria-label={letters.map((value, index) =>
            index === missing ? "blank" : value).join(" ")}>
            {letters.map((value, index) => index === missing ? "_" : value).join("")}
          </p>
          <div className={styles.choices} lang="en">
            {options.map((option) => (
              <button className={styles.tile} key={option} disabled={correct}
                onClick={() => check(option, letter)}>{option}</button>
            ))}
          </div>
        </>
      )}
      {id === "spell" && (
        <>
          <button className={styles.tile} onClick={speak}>🔊 Escuchar</button>
          <p role="status" className={styles.audioMessage}>{audioMessage}</p>
          <form className={styles.choices} onSubmit={(event) => {
            event.preventDefault();
            check(answer, item.word);
          }}>
            <input className={styles.input} aria-label="Escribe la palabra en inglés" lang="en"
              value={answer} readOnly={correct} autoComplete="off" autoCorrect="off"
              spellCheck={false} autoCapitalize="none" onChange={(event) => {
                setAnswer(event.target.value);
                setFeedback(null);
              }} />
            <button className={styles.primary} disabled={correct || !answer.trim()}>Comprobar</button>
          </form>
        </>
      )}
      {(id === "phrase" || id === "scramble") && (
        <OrderTiles tokens={id === "phrase" ? item.phrase.split(" ") : item.word.replaceAll(" ", "").split("")}
          isPhrase={id === "phrase"} seed={round + 2} correct={correct}
          onEdit={() => setFeedback(null)} onCheck={check} />
      )}
      <p className={styles.feedback} role="status">
        {correct ? <>¡Muy bien! <strong lang="en">{id === "phrase" ? item.phrase : item.word}</strong></>
          : feedback === "retry" ? "Casi. ¡Inténtalo otra vez!" : ""}
      </p>
      {correct && <button className={styles.primary} onClick={onNext}>Continuar →</button>}
    </>
  );
}

function OrderTiles({ tokens, isPhrase, seed, correct, onEdit, onCheck }: {
  tokens: string[];
  isPhrase: boolean;
  seed: number;
  correct: boolean;
  onEdit: () => void;
  onCheck: (value: string, expected: string) => void;
}) {
  const [ordered, setOrdered] = useState<number[]>([]);
  const dragged = useRef<number | null>(null);
  const tileButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const separator = isPhrase ? " " : "";
  const available = scramble(tokens.map((_, index) => index), seed)
    .filter((index) => !ordered.includes(index));

  function place(index: number, before?: number) {
    const remaining = ordered.filter((entry) => entry !== index);
    const position = before === undefined ? remaining.length : remaining.indexOf(before);
    if (correct || position < 0) return;
    remaining.splice(position, 0, index);
    setOrdered(remaining);
    onEdit();
  }

  function tile(index: number, placed: boolean) {
    return (
      <button key={index} className={styles.tile} type="button" lang="en"
        ref={(button) => { tileButtons.current[index] = button; }}
        disabled={correct} draggable={isPhrase && !correct}
        onDragStart={(event) => {
          dragged.current = index;
          event.dataTransfer.setData("text/plain", tokens[index]!);
          event.dataTransfer.effectAllowed = "move";
        }}
        onDragEnd={() => { dragged.current = null; }}
        onDragOver={(event) => {
          if (placed && dragged.current !== null) event.preventDefault();
        }}
        onDrop={(event) => {
          if (!placed || dragged.current === null) return;
          event.stopPropagation();
          event.preventDefault();
          place(dragged.current, index);
        }}
        onClick={(event) => {
          if (placed) {
            setOrdered(ordered.filter((entry) => entry !== index));
            onEdit();
          } else place(index);
          if (event.detail === 0) requestAnimationFrame(() => tileButtons.current[index]?.focus());
        }}>{tokens[index]}</button>
    );
  }

  return (
    <>
      <div className={styles.answerTray} role="group" aria-label="Tu respuesta"
        onDragOver={(event) => {
          if (dragged.current !== null) event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (dragged.current !== null) place(dragged.current);
        }}>
        {ordered.length ? ordered.map((index) => tile(index, true)) : <span>Tu respuesta va aquí</span>}
      </div>
      <div className={styles.choices} role="group" aria-label={isPhrase ? "Palabras disponibles" : "Letras disponibles"}>
        {available.map((index) => tile(index, false))}
      </div>
      <div className={styles.actions}>
        <button className={isPhrase ? styles.eraser : styles.tile}
          aria-label={isPhrase ? "Borrar la frase" : undefined}
          disabled={correct || !ordered.length} onClick={() => {
          setOrdered([]);
          onEdit();
        }}>{isPhrase ? <span className={styles.eraserIcon} aria-hidden="true" /> : "Borrar"}</button>
        <button className={styles.primary} lang={isPhrase ? "en" : undefined}
          disabled={correct || ordered.length !== tokens.length}
          onClick={() => onCheck(ordered.map((index) => tokens[index]).join(separator), tokens.join(separator))}>
          {isPhrase ? "Check" : "Comprobar"}
        </button>
      </div>
    </>
  );
}
