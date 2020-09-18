//-- Audio Contex--

// var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

// oscillator.connect(audioCtx.destination);

// -- Tutorial --



var audioContext = new AudioContext();
// var ctx = new AudioContext();

var oscillator = audioContext.createOscillator();
var filter = audioContext.createBiquadFilter();

//oscillator.connect(audioContext.destination);

oscillator.connect(filter);
filter.connect(audioContext.destination);


filter.type = "highpass";
filter.frequency.setTargetAtTime(2000, audioContext.currentTime, 1);


oscillator.start();
setTimeout(function () {
    oscillator.stop();
}, 2000);