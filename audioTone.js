import * as Tone from 'tone';

let ready = false;
let osc1;
let osc2;

const merge = new Tone.Merge().toDestination();

// * Oscillators
osc1 = new Tone.Oscillator().connect(merge, 0, 0);
osc2 = new Tone.Oscillator().connect(merge, 0, 1);

// * Play Button
const playButton = document.getElementById('playStop');
const playStop = document.getElementById('playStatus');
playButton.onclick = () => {
  ready = !ready;
  ready ? osc1.start() : osc1.stop();
  ready ? osc2.start() : osc2.stop();
  playStop.textContent = ready ? 'STOP' : 'PLAY';
};

// * Synth Selection
// ! look into "event delegation js"
const changeWave = document.querySelectorAll('button.changeWaveType');
const changeWave2 = document.querySelectorAll('button.changeWaveType2');
for (let waveButton of changeWave) {
  waveButton.addEventListener('click', (e) => {
    osc1.type = e.target.id.toLowerCase();
  });
}
for (let waveButton2 of changeWave2) {
  waveButton2.addEventListener('click', (e) => {
    osc2.type = e.target.id.toLowerCase();
  });
}
