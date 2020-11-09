import * as Tone from "tone";

// //attach a click listener to a play button
// document.getElementById("play-button").addEventListener("click", async () => {
//   await Tone.start();
//   console.log("audio is ready");
// });

let o = Object;

// const synth = new Tone.Synth().toDestination();
// const now = Tone.now();

// synth.triggerAttackRelease("C4", "8n", now);
// synth.triggerAttackRelease("E4", "8n", now + 0.5);
// synth.triggerAttackRelease("G4", "8n", now + 1);
// synth.triggerAttackRelease("A4", "8n", now + 1.5);

function tileInitSynth(e) {
  var t = new (window.AudioContext || window.webkitAudioContext)({
      latencyHint: "interactive",
      sampleRate: 22050
  });

// Synth & Drum Selector
  o.playButton.addEventListener("click", function () {
    toggleSequencerPlaying(o);
  });

document.getElementById("show-synth").addEventListener("change", function () {
  this.checked &&
    ((o.activeNodes = document.getElementById("synth-nodes")),
    (document.getElementById("synth-nodes").style.display = "flex"),
    (document.getElementById("drum-nodes").style.display = "none"));
});

  document.getElementById("show-drums").addEventListener("change", function () {
    this.checked &&
      ((o.activeNodes = document.getElementById("drum-nodes")),
        (document.getElementById("drum-nodes").style.display = "flex"),
        (document.getElementById("synth-nodes").style.display = "none"));
  });