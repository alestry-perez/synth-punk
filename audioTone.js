import * as Tone from 'tone';

let ready = false;
let osc;
let osc2;
let merge;

// Sound Bus
merge = new Tone.Merge().toDestination();

// Oscillators
osc = new Tone.Oscillator({
  frequency: 440,
  volume: -16,
}).connect(merge, 0, 0);
osc2 = new Tone.Oscillator({
  frequency: 440,
  volume: -16,
}).connect(merge, 0, 1);

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
for (let waveButton of changeWave) {
  waveButton.addEventListener('click', (e) => {
    osc.type = e.target.id.toLowerCase();
  });
}
