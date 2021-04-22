import * as Tone from 'tone';

let ready = false;
let osc;

osc = new Tone.Oscillator({
  type: 'sine',
  frequency: 440,
  volume: -16,
});
osc.toDestination();

const waveform = new Tone.Waveform();
osc.connect(waveform);

function draw() {
  const canvas = document.getElementById('waveDisplay');

  if (!canvas.getContext) {
    return;
  }
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = 'red';
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.moveTo(0, 75);
  ctx.lineTo(293, 75);
  ctx.stroke();

  if (ready) {
    let buffer = wave.getValue(0);
    for (let i = 0; i < buffer.length; i++) {}
    return;
  }
}
draw();

// waveform({
//   tone: toneWaveform,
//   parent: document.getElementById('waveDisplay'),
// });

// Play Button
const playButton = document.getElementById('playStop');
const playStop = document.getElementById('playStatus');
playButton.onclick = () => {
  ready = !ready;
  ready ? osc.start() : osc.stop();
  playStop.textContent = ready ? 'STOP' : 'PLAY';
};
