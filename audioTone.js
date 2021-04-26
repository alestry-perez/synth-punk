import * as Tone from 'tone';

let ready = false;
let osc;

let sketch = Sketch.create({
  container: document.getElementById('waveDisplay'),
  retina: 'auto',
});

sketch.setup = function () {
  //sketch.createCanvas(canvas.width, canvas.height);
  osc = new Tone.Oscillator({
    type: 'sine',
    frequency: 440,
    volume: -16,
  });
  osc.toDestination();

  const waveform = new Tone.Waveform();
  Tone.Destination.connect(waveform);
};

sketch.draw = function () {
  if (ready) {
    // do the audio stuff
    //osc.frequency.value = map(mouseX, 0, width, 110, 880);

    sketch.stroke(255);
    let buffer = waveform.getValue(0);
    console.log(stroke);
    // look a trigger point where the samples are going from
    // negative to positive
    let start = 0;
    for (let i = 1; i < buffer.length; i++) {
      if (buffer[i - 1] < 0 && buffer[i] >= 0) {
        start = i;
        break; // interrupts a for loop
      }
    }

    // calculate a new end point such that we always
    // draw the same number of samples in each frame
    let end = start + buffer.length / 2;

    // drawing the waveform
    for (let i = start; i < end; i++) {
      let x1 = map(i - 1, start, end, 0, width);
      let y1 = map(buffer[i - 1], -1, 1, 0, height);
      let x2 = map(i, start, end, 0, width);
      let y2 = map(buffer[i], -1, 1, 0, height);
      line(x1, y1, x2, y2);
    }
  }
};

// Play Button
const playButton = document.getElementById('playStop');
const playStop = document.getElementById('playStatus');
playButton.onclick = () => {
  ready = !ready;
  ready ? osc.start() : osc.stop();
  playStop.textContent = ready ? 'STOP' : 'PLAY';
};
