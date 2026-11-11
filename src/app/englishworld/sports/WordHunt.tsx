import { useState, type CSSProperties } from "react";
import { scramble, sportsVocabulary } from "./vocabulary";
import styles from "./sports.module.css";

const rows = 8;

function createBoard(round: number, words: string[]) {
  const vertical = words.find((word) => word.length <= rows)!;
  const horizontal = words.filter((word) => word !== vertical);
  const columns = Math.max(...horizontal.map((word) => word.length)) + 1;
  const board = Array.from({ length: rows * columns }, (_, index) =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[((index * 71) ^ (index * 13 + round * 37)) % 26]!);
  const verticalColumn = round % 2 === 0 ? 0 : columns - 1;
  const top = (rows - vertical.length) % 3;
  Array.from(vertical).forEach((letter, index) => {
    board[(top + index) * columns + verticalColumn] = letter;
  });
  const wordRows = scramble(Array.from({ length: rows }, (_, index) => index), round + 41);
  horizontal.forEach((word, index) => {
    const margin = columns - 1 - word.length;
    const start = (verticalColumn === 0 ? 1 : 0) + (round + index) % (margin + 1);
    const letters = Array.from(word);
    if (round > 0 && index === 1) letters.reverse();
    letters.forEach((letter, offset) => {
      board[wordRows[index]! * columns + start + offset] = letter;
    });
  });
  return { board, columns };
}

function lineBetween(start: number, end: number, columns: number) {
  if (Math.floor(start / columns) === Math.floor(end / columns)) {
    return Array.from({ length: Math.abs(end - start) + 1 }, (_, index) =>
      start + index * Math.sign(end - start));
  }
  if (start % columns === end % columns) {
    return Array.from({ length: Math.abs(end - start) / columns + 1 }, (_, index) =>
      start + index * columns * Math.sign(end - start));
  }
  return [];
}

export function WordHunt({ round, onAnswer, onNext }: {
  round: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}) {
  const targets = sportsVocabulary.slice(round * 4, round * 4 + 4).map(({ word }) => ({
    word,
    compact: word.replaceAll(" ", "").toUpperCase(),
  }));
  const { board, columns } = createBoard(round, targets.map(({ compact }) => compact));
  const [start, setStart] = useState<number | null>(null);
  const [found, setFound] = useState<Record<string, number[]>>({});
  const [feedback, setFeedback] = useState("");
  const highlighted = new Set(Object.values(found).flat());
  const complete = Object.keys(found).length === targets.length;

  function select(index: number) {
    if (start === null || start === index) {
      setStart(start === index ? null : index);
      setFeedback("");
      return;
    }
    const line = lineBetween(start, index, columns);
    const forward = line.map((cell) => board[cell]).join("");
    const backward = Array.from(forward).reverse().join("");
    const target = targets.find(({ compact }) => compact === forward || compact === backward);
    setStart(null);
    if (target) {
      if (found[target.word]) {
        setFeedback("Ya encontraste esa palabra.");
      } else {
        setFound({ ...found, [target.word]: line });
        setFeedback("¡Palabra encontrada!");
        onAnswer(true);
      }
    } else {
      setFeedback("Prueba otra vez.");
      onAnswer(false);
    }
  }

  return (
    <>
      <p className={styles.prompt}>Toca la primera y la última letra de cada palabra. En la cuadrícula, las palabras van juntas.</p>
      <ul className={styles.targets} lang="en">
        {targets.map(({ word }) => (
          <li key={word} data-found={Boolean(found[word])}>
            {found[word] && <span aria-label="encontrada" lang="es">✓ </span>}{word}
          </li>
        ))}
      </ul>
      <div className={styles.wordGrid} role="group" aria-label="Cuadrícula de letras"
        style={{ "--columns": columns } as CSSProperties}>
        {board.map((letter, index) => (
          <button type="button" key={index} lang="en"
            aria-label={`${letter}, ${Math.floor(index / columns) + 1}, ${index % columns + 1}`}
            aria-pressed={start === index} data-found={highlighted.has(index)}
            disabled={complete} onClick={() => select(index)}>{letter}</button>
        ))}
      </div>
      <p className={styles.feedback} role="status">{complete ? "¡Encontraste todas las palabras!" : feedback}</p>
      {complete && <button className={styles.primary} onClick={onNext}>Continuar →</button>}
    </>
  );
}
