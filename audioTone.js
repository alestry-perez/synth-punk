import * as Tone from 'tone';

// ! implement TailwindCSS JIT

let ready = false;

// * Channel Bus
let channel = new Tone.Channel().toDestination();

// * Oscillators
let oscillators = {
  osc1: new Tone.Oscillator().connect(channel),
  osc2: new Tone.Oscillator().connect(channel),
};

// * Play Button
const playButton = () => {
  const playButton = document.getElementById('playStop');
  const playStop = document.getElementById('playStatus');

  playButton.onclick = () => {
    playStop.textContent = ready ? 'PLAY' : 'STOP';

    ready = !ready;
    Object.values(oscillators).forEach((osc) => {
      ready ? osc.start() : osc.stop();
    });
  };
};
playButton();

// * Synth Selection
// ! look into "event delegation js"
// const changeWaveRow1 = document.querySelectorAll('button.changeWaveRow1');
// const changeWaveRow2 = document.querySelectorAll('button.changeWaveRow2');

const waveTypeButtons = document.querySelectorAll('button');
waveTypeButtons.forEach((buttons) => {
  buttons.addEventListener('click', (e) => {
    oscillators.osc1.type = e.target.id.toLowerCase();
    console.log('Button Clicked!');
  });
});

/*for (let waveButton of changeWaveRow1) {
  waveButton.addEventListener('click', (e) => {
    oscillators.osc1.type = e.target.id.toLowerCase();
  });
}
for (let waveButton of changeWaveRow2) {
  waveButton.addEventListener('click', (e) => {
    oscillators.osc2.type = e.target.id.toLowerCase();
  });
}*/
