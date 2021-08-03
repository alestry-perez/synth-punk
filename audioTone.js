import * as Tone from 'tone';

// ! TO DO:
// ! 1. implement TailwindCSS JIT
// ! 2. add wave display
// ! 3. add volume level control
// ! 4. add octave control
// ! 5. add semi tone control
// ! 6. add fine tune control
// ! 7. add working controller knobs

let ready = false;

// * OSC Params
let oscParams = {
  vol1: new Tone.Volume().toDestination(),
  vol2: new Tone.Volume().toDestination(),
};

// * Oscillators
let oscillators = {
  osc1: new Tone.Oscillator().connect(oscParams.vol1),
  osc2: new Tone.Oscillator().connect(oscParams.vol2),
};

// * Oscillator Wave Selection
document.querySelectorAll('button[data-waveform]').forEach((button) => {
  button.addEventListener('click', ({ target }) => {
    const { osc, waveform } = target.dataset;

    if (osc in oscillators) {
      oscillators[osc].type = waveform;
    }
  });
});

// * Knobs
document.querySelectorAll('input[type="range"]').forEach((knob) => {
  knob.addEventListener('change', ({ target }) => {
    const { osc, property } = target.dataset;

    if (osc in oscillators) {
      oscillators[osc][property] = target.value;
    }
  });
});

// * Play Button
const playButton = document.getElementById('playStop');
const playStop = document.getElementById('playStatus');
playButton.onclick = () => {
  playStop.textContent = ready ? 'PLAY' : 'STOP';

  ready = !ready;
  Object.values(oscillators).forEach((osc) => {
    ready ? osc.start() : osc.stop();
  });
};
