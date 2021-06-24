import * as Tone from 'tone';

let ready = false;
let osc1;
let osc2;
let oscillators;

// * Oscillators
osc1 = new Tone.Oscillator().toDestination();
osc2 = new Tone.Oscillator().toDestination();

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

const options = {
  passive: true,
};

oscillators = { osc1, osc2 };

const onClick = ({ target }) => {
  const id = target.closest('.osc').id;

  oscillators[id].type = target.id.toLowerCase();
};

on('.osc button.changeWave', (element) => {
  listen('click', element, onClick, options);
});

/*for (let waveButton of changeWave) {
  waveButton.addEventListener('click', (e) => {
    osc1.type = e.target.id.toLowerCase();
  });
}
for (let waveButton2 of changeWave2) {
  waveButton2.addEventListener('click', (e) => {
    osc2.type = e.target.id.toLowerCase();
  });
}*/
