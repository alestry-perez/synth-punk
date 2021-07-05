import * as Tone from 'tone';

// ! implement TailwindCSS JIT

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
  playStop.textContent = ready ? 'PLAY' : 'STOP';

  ready = !ready;
  Object.values(oscillators).forEach((osc) => {
    ready ? osc.start() : osc.stop();
  });
};

// * Synth Selection
// This selector will only match buttons that change the waveform, so we
// don't mess with other buttons on the page!
document.querySelectorAll('button[data-waveform]').forEach((button) => {
  button.addEventListener('click', ({ target }) => {
    // `dataset` is a handy property that gives us object-style access
    // to any data- attributes on an element. Here we use destructuring
    // to pull out `osc` and `waveform`.
    const { osc, waveform } = target.dataset;

    // Maybe you have a typo and you write `data-osc="osc11"`. This check
    // sees if the osc actually exists in your `oscillators` object so we
    // don't error out and break your code in those cases.
    if (osc in oscillators) {
      oscillators[osc].type = waveform;
    }
  });
});
