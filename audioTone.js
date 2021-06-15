import * as Tone from 'tone';

let ready = false;
let osc;

osc = new Tone.Oscillator({
  frequency: 440,
  volume: -16,
});
osc.toDestination();

const waveform = new Tone.Waveform();
Tone.Destination.connect(waveform);

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

console.log(changeWave);
