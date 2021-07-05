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

// * Oscillator Wave Selection
document.querySelectorAll('button[data-waveform]').forEach((button) => {
  button.addEventListener('click', ({ target }) => {
    const { osc, waveform } = target.dataset;

    if (osc in oscillators) {
      oscillators[osc].type = waveform;
    }
  });
});
