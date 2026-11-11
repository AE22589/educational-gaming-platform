export async function playAnswerSound(context: AudioContext, correct: boolean) {
  if (context.state === "suspended") await context.resume();
  const notes = correct ? [659.25, 880, 1318.51] : [329.63, 246.94];
  const start = context.currentTime;

  notes.forEach((frequency, index) => {
    const tone = context.createOscillator();
    const volume = context.createGain();
    const time = start + index * 0.085;
    const end = time + (correct ? 0.24 : 0.15);
    tone.type = correct ? "sine" : "triangle";
    tone.frequency.value = frequency;
    volume.gain.setValueAtTime(0, time);
    volume.gain.linearRampToValueAtTime(0.13, time + 0.016);
    volume.gain.exponentialRampToValueAtTime(0.001, end);
    tone.connect(volume).connect(context.destination);
    tone.start(time);
    tone.stop(end);
  });
}
