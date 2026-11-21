export async function playRetrySound(context: AudioContext) {
  if (context.state === "suspended") await context.resume();
  const notes = [329.63, 246.94];
  const start = context.currentTime;

  notes.forEach((frequency, index) => {
    const tone = context.createOscillator();
    const volume = context.createGain();
    const time = start + index * 0.085;
    const end = time + 0.15;
    tone.type = "triangle";
    tone.frequency.value = frequency;
    volume.gain.setValueAtTime(0, time);
    volume.gain.linearRampToValueAtTime(0.13, time + 0.016);
    volume.gain.exponentialRampToValueAtTime(0.001, end);
    tone.connect(volume).connect(context.destination);
    tone.start(time);
    tone.stop(end);
  });
}
