import * as Tone from 'tone';

let ready = false;
let osc;
let osc2;

// Mixer

// Oscillators
osc = new Tone.Oscillator().toDestination();
//osc2 = new Tone.Oscillator();
console.log(osc.numberOfInputs);

// Play Button
const playButton = document.getElementById('playStop');
const playStop = document.getElementById('playStatus');
playButton.onclick = () => {
  ready = !ready;
  ready ? osc.start() : osc.stop();
  playStop.textContent = ready ? 'STOP' : 'PLAY';
};

// Synth Selection
const changeWave = document.querySelectorAll('button.changeWaveType');
const changeWave2 = document.querySelectorAll('button.changeWaveType2');
for (let waveButton of changeWave) {
  waveButton.addEventListener('click', (e) => {
    osc.type = e.target.id.toLowerCase();
  });
}
for (let waveButton2 of changeWave2) {
  waveButton2.addEventListener('click', (e) => {
    osc2.type = e.target.id.toLowerCase();
  });
}
