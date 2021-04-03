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
  var playStop = '<h2 class="text-center pt-1.5 font-bold">PLAY / STOP</h2>';
  if (ready) {
  } else {
    document.getElementById('playStop').innerHTML = playStop;
  }
}

var boxStart = document.getElementById('playStop');
boxStart.onclick = () => {
  ready = !ready;
  return ready ? osc.start() : osc.stop();
};
// boxStart.onclick = () => {
//   if (!ready) {
//     osc.start();
//     ready = true;
//   } else {
//     osc.stop();
//     ready = false;
//   }
// };
