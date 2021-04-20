import * as Tone from 'tone';

let ready = false;
let osc;

osc = new Tone.Oscillator({
  type: 'sine',
  frequency: 440,
  volume: -16,
}).toDestination();

const toneMeter = new Tone.Meter();
osc.connect(toneMeter);

const toneWaveform = new Tone.Waveform();
osc.connect(toneWaveform);

//bind the GUI Waveform
/*
drawer().add({
  tone: osc,
  title: 'OSC',
});
meter({
  tone: toneMeter,
  parent: document.getElementById('waveDisplay'),
});
fft({
  tone: toneFFT,
  parent: document.getElementById('waveDisplay'),
});
waveform({
  tone: toneWaveform,
  parent: document.getElementById('waveDisplay'),
});
*/

// Play Button
var boxStart = document.getElementById('playStop');
const playStop = document.getElementById('playStatus');
boxStart.onclick = () => {
  ready = !ready;
  ready ? osc.start() : osc.stop();
  playStop.textContent = ready ? 'STOP' : 'PLAY';
};
