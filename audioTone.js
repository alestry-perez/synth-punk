import * as Tone from 'tone';

let ready = false;
let synth;

setup();
windowResized();
draw();
mousePressed();

//create a synth and connect it to the main output (your speakers)
synth = new Tone.Synth().toDestination();
//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease('C4', '8n');

function setup() {}
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
function mousePressed() {
  if (!ready) {
    // start audio objects here
    ready = true;
  }
}
