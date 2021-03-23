import * as Tone from 'tone';

let ready = false;
let osc;

setup();
windowResized();
draw();

function setup() {
  osc = new Tone.Oscillator({
    type: 'sine',
    frequency: 440,
    volume: -16,
  }).toDestination();
}
function windowResized() {}
function draw() {
  var waveDisplay = 'Click To Start';
  if (ready) {
    // do the audio stuff
  } else {
    // code here
    document.getElementById('waveDisplay').innerHTML = waveDisplay;
  }
}
var boxStart = document.getElementById('waveDisplay');
boxStart.onclick = function () {
  if (!ready) {
    // start audio objects here
    osc.start();
    ready = true;
  }
};
