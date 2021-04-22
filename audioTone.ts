import * as Tone from 'tone';

let ready = false;
let osc;

osc = new Tone.Oscillator({
  type: 'sine',
  frequency: 440,
  volume: -16,
}).toDestination();

//bind the GUI Waveform
// const toneWaveform = new Tone.Waveform();
// osc.connect(toneWaveform);

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
