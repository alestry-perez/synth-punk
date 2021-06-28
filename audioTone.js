import * as Tone from 'tone';

let ready = false;

// * Oscillators
let oscillators = {
  osc1: new Tone.Oscillator().toDestination(),
  osc2: new Tone.Oscillator().toDestination(),
};

// * Play Button
const playButton = document.getElementById('playStop');
const playStop = document.getElementById('playStatus');

playButton.onclick = () => {
  playStop.textContent = ready ? 'STOP' : 'PLAY';

  ready = !ready;
  Object.values(oscillators).forEach((osc) => {
    ready ? osc.start() : osc.stop();
  });
};

// * Synth Selection
// ! look into "event delegation js"
const changeWaveRow1 = document.querySelectorAll('button.changeWaveRow1');
const changeWaveRow2 = document.querySelectorAll('button.changeWaveRow2');

for (let waveButton of changeWaveRow1) {
  waveButton.addEventListener('click', (e) => {
    oscillators.osc1.type = e.target.id.toLowerCase();
  });
}
for (let waveButton of changeWaveRow2) {
  waveButton.addEventListener('click', (e) => {
    oscillators.osc2.type = e.target.id.toLowerCase();
  });
}
