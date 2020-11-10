import * as Tone from "tone";

let o = Object;

// Synth & Drum Selector
function tileInitSynth(e) {
  var t = new (window.AudioContext || window.webkitAudioContext)({
    latencyHint: "interactive",
    sampleRate: 22050,
  });

  function tileDrawSynth(e, t) {
    showActiveNode(t), drawWaveform(t);
  };