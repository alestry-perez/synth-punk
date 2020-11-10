const synth = new Tone.Synth().toDestination();
const now = Tone.now();

synth.triggerAttackRelease("C4", "8n", now);
synth.triggerAttackRelease("E4", "8n", now + 0.5);
synth.triggerAttackRelease("G4", "8n", now + 1);
synth.triggerAttackRelease("A4", "8n", now + 1.5);

// drums + synth
function tileInitSynth(e) {
  var t = new (window.AudioContext || window.webkitAudioContext)({
    latencyHint: "interactive",
    sampleRate: 22050,
  });
  (e.data = {
    context: t,
    notes: [
      "E3",
      "D3",
      "E3",
      "G3",
      "E4",
      "D4",
      "E4",
      "G4",
      "C4",
      "D4",
      "C4",
      "C5",
      "E4",
      "E5",
      "G4",
      "G3",
    ],
    notesActive: [
      !0,
      !1,
      !0,
      !1,
      !0,
      !0,
      !0,
      !0,
      !1,
      !1,
      !0,
      !1,
      !0,
      !1,
      !0,
      !0,
    ],
    drums: {
      B: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      S: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      H: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      C: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    },
    noteIndex: 15,
    bpm: 88,
    noteDivision: 4,
    nextTick: t.currentTime,
    counter: 0,
    sequencerPlaying: !1,
    started: !1,
  }),
    (e.data.drums = {
      B: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      S: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      H: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      C: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }),
    (e.data.tickInterval = 60 / e.data.bpm / e.data.noteDivision),
    initCanvasAndAppend(document.getElementById("waveform-canvas"), e, !0),
    (e.data.analyser = t.createAnalyser()),
    (e.data.analyser.fftSize = 1024),
    (e.data.bufferLength = e.data.analyser.frequencyBinCount),
    (e.data.dataArray = new Uint8Array(e.data.bufferLength)),
    createSynth(e.data),
    createDrums(e.data),
    synthLoad(e.data),
    initSynthInteractions(e.data, e);
}
function tileUpdateSynth(e, t, a) {
  t.sequencerPlaying
    ? (runSequencer(t, a), (e.drawRequired = !0), (e.updateRequired = !0))
    : (e.updateRequired = !1),
    calculateWaveform(t);
}
function tileDrawSynth(e, t) {
  showActiveNode(t), drawWaveform(t);
}
function runSequencer(e, t) {
  if (e.sequencerPlaying && e.nextTick < e.context.currentTime + 0.1) {
    e.noteIndex++, e.noteIndex >= e.notes.length && (e.noteIndex = 0);
    var a = getGroove(e);
    if (e.notesActive[e.noteIndex])
      playNote(e.notes[e.noteIndex], Math.max(0, e.nextTick + a), e);
    playDrums(e, Math.max(0, e.nextTick + a)),
      (e.nextTick += e.tickInterval),
      e.context.currentTime - e.nextTick > 4 * e.tickInterval &&
        (e.nextTick = e.context.currentTime);
  }
}
function playNote(e, t, a) {
  a.amp.gain.cancelScheduledValues(t),
    a.amp.gain.setTargetAtTime(1, t, a.ampEnv.attack),
    a.amp.gain.setTargetAtTime(
      a.ampEnv.sustain,
      t + a.ampEnv.attack,
      a.ampEnv.decay
    ),
    a.amp.gain.setTargetAtTime(
      1e-5,
      t + a.noteLength * a.tickInterval,
      a.ampEnv.release
    ),
    a.lowpass.frequency.setTargetAtTime(
      Math.min(12e3, Math.max(1, a.lowpassFreq + a.lowpassEnv)),
      t,
      a.voltEnv.attack
    ),
    a.lowpass.frequency.setTargetAtTime(
      Math.min(
        12e3,
        Math.max(1, a.lowpassFreq + a.lowpassEnv * a.voltEnv.sustain)
      ),
      t + a.voltEnv.attack,
      a.voltEnv.decay
    ),
    a.lowpass.frequency.setTargetAtTime(
      a.lowpassFreq,
      t + a.noteLength * a.tickInterval,
      a.voltEnv.release
    ),
    a.highpass.frequency.setTargetAtTime(
      Math.max(1, a.highpassFreq - a.highpassEnv),
      t,
      a.voltEnv.attack
    ),
    a.highpass.frequency.setTargetAtTime(
      Math.max(1, a.highpassFreq - a.highpassEnv * a.voltEnv.sustain),
      t + a.voltEnv.attack,
      a.voltEnv.decay
    ),
    a.highpass.frequency.setTargetAtTime(
      a.highpassFreq,
      t + a.noteLength * a.tickInterval,
      a.voltEnv.release
    ),
    (a.reverbOffGain.gain.value = 1 - 0.9 * a.reverbGain.gain.value),
    (a.distortionDry.gain.value = 1 - a.distortionWet.gain.value);
  var n = 1.05946274;
  (a.osc1Note = getNoteOffset(
    e,
    12 * Math.round(a.osc1Octave) + Math.round(a.osc1Semi)
  )),
    (a.osc1Freq =
      getNoteFrequency(a.osc1Note) *
      Math.pow(n, a.osc1Pitch) *
      Math.pow(n, a.oscPitch)),
    a.osc1.frequency.setTargetAtTime(a.osc1Freq, t, a.portamento),
    (a.osc2Note = getNoteOffset(
      e,
      12 * Math.round(a.osc2Octave) + Math.round(a.osc2Semi)
    )),
    (a.osc2Freq =
      getNoteFrequency(a.osc2Note) *
      Math.pow(n, a.osc2Pitch) *
      Math.pow(n, a.oscPitch)),
    a.osc2.frequency.setTargetAtTime(a.osc2Freq, t, a.portamento);
}
function playDrums(e, t) {
  1 == e.drums.B[e.noteIndex] && e.kick && e.kick.play(t),
    1 == e.drums.S[e.noteIndex] && e.snare && e.snare.play(t),
    1 == e.drums.H[e.noteIndex] && e.hihat && e.hihat.play(t),
    1 == e.drums.C[e.noteIndex] && e.cymbal && e.cymbal.play(t);
}
function createSynth(t) {
  var a;
  (t.osc1 = t.context.createOscillator()),
    (t.osc1.type = "sine"),
    (t.osc1.frequency.value = getNoteFrequency(t.notes[0])),
    (t.osc1Octave = 0),
    (t.osc1Semi = 0),
    (t.osc1Fine = 0),
    (t.osc1Pitch = 0),
    (t.osc1Level = t.context.createGain()),
    (t.osc2 = t.context.createOscillator()),
    (t.osc2.type = "square"),
    (t.osc2.frequency.value = getNoteFrequency(t.notes[0])),
    (t.osc2Octave = -1),
    (t.osc2Semi = 0),
    (t.osc2Fine = 0),
    (t.osc2Pitch = 0),
    (t.osc2Level = t.context.createGain()),
    (t.osc2Level.gain.value = 0.5),
    (t.distortion = t.context.createWaveShaper()),
    (t.distortion.curve = (function (e) {
      for (
        var t,
          a = "number" == typeof e ? e : 50,
          n = new Float32Array(44100),
          o = Math.PI / 180,
          i = 0;
        i < 44100;
        ++i
      ) {
        var s =
          ((3 + a) * (t = (2 * i) / 44100 - 1) * 20 * o) /
          (Math.PI + a * Math.abs(t));
        n[i] = s;
      }
      return n;
    })(400)),
    (t.distortion.oversample = "4x"),
    (t.distortionWet = t.context.createGain()),
    (t.distortionWet.gain.value = 0),
    (t.distortionDry = t.context.createGain()),
    (t.lowpass = t.context.createBiquadFilter()),
    (t.lowpass.type = "lowpass"),
    (t.lowpass.frequency.value = 1e4),
    (t.lowpass.Q.value = 1),
    (t.lowpassEnv = 1),
    (t.lowpassFreq = 1e4),
    (t.highpass = t.context.createBiquadFilter()),
    (t.highpass.type = "highpass"),
    (t.highpass.frequency.value = 1),
    (t.highpass.Q.value = 1),
    (t.highpassFreq = 1),
    (t.highpassEnv = 0),
    (t.reverb = t.context.createConvolver()),
    (t.reverbGain = t.context.createGain()),
    (t.reverbGain.gain.value = 0),
    (t.reverbOffGain = t.context.createGain()),
    (t.reverbOffGain.gain.value = 1);
  var e = new XMLHttpRequest();
  e.open("get", "/sounds/ir-synth-min.wav", !0),
    (e.responseType = "arraybuffer"),
    (e.onload = function () {
      t.context.decodeAudioData(e.response, function (e) {
        (a = e), (t.reverb.buffer = a);
      });
    }),
    e.send(),
    (t.delay = t.context.createDelay(2)),
    (t.delay.delayTime.value = 0.507),
    (t.delayFeedback = t.context.createGain()),
    (t.delayFeedback.gain.value = 0),
    (t.delayBus = t.context.createGain()),
    (t.amp = t.context.createGain()),
    (t.amp.gain.value = 1e-5),
    (t.master = t.context.createGain()),
    (t.master.gain.value = 0.5),
    (t.noteLength = 0.75),
    (t.grooveAmount = -0.105),
    (t.grooveTime = t.tickInterval),
    (t.portamento = 0.001),
    (t.oscLevel = t.context.createGain()),
    (t.oscLevel.gain.value = 0.35),
    (t.oscLevelInput = 1),
    (t.oscFine = 0),
    (t.oscPitch = 0),
    (t.ampEnv = {
      attack: 0.1,
      sustain: 1,
      decay: 0.1,
      release: 0.5,
    }),
    (t.voltEnv = {
      attack: 0.01,
      sustain: 0,
      decay: 0.02,
      release: 0.01,
    }),
    (t.compressor = t.context.createDynamicsCompressor()),
    (t.compressor.threshold.value = -30),
    (t.compressor.knee.value = 40),
    (t.compressor.ratio.value = 2),
    (t.compressor.attack.value = 0.1),
    (t.compressor.release.value = 0.25),
    t.osc1.connect(t.osc1Level),
    t.osc1Level.connect(t.oscLevel),
    t.osc2.connect(t.osc2Level),
    t.osc2Level.connect(t.oscLevel),
    t.oscLevel.connect(t.amp),
    t.amp.connect(t.lowpass),
    t.lowpass.connect(t.highpass),
    t.highpass.connect(t.distortionDry),
    t.highpass.connect(t.distortionWet),
    t.distortionDry.connect(t.delayBus),
    t.distortionDry.connect(t.delayFeedback),
    t.distortionWet.connect(t.distortion),
    t.distortion.connect(t.delayBus),
    t.distortion.connect(t.delayFeedback),
    t.delayFeedback.connect(t.delay),
    t.delay.connect(t.delayFeedback),
    t.delayFeedback.connect(t.delayBus),
    t.delayBus.connect(t.reverb),
    t.delayBus.connect(t.reverbOffGain),
    t.reverbOffGain.connect(t.compressor),
    t.reverb.connect(t.reverbGain),
    t.reverbGain.connect(t.compressor),
    t.compressor.connect(t.master),
    t.master.connect(t.context.destination),
    t.master.connect(t.analyser),
    t.analyser.connect(t.context.destination);
}
function createDrums(t) {
  var a;
  (t.drumReverb = t.context.createConvolver()),
    (t.drumReverbGain = t.context.createGain()),
    (t.drumReverbGain.gain.value = 0.2),
    (t.drumGain = t.context.createGain()),
    (t.drumGain.gain.value = 2.2),
    (t.drumMaster = t.context.createGain()),
    (t.drumMaster.gain.value = 0.5),
    t.drumGain.connect(t.drumMaster),
    t.drumReverbGain.connect(t.drumMaster),
    t.drumMaster.connect(t.compressor);
  var e = new XMLHttpRequest();
  e.open("get", "/sounds/ir-min.wav", !0),
    (e.responseType = "arraybuffer"),
    (e.onload = function () {
      t.context.decodeAudioData(e.response, function (e) {
        (a = e),
          (t.drumReverb.buffer = a),
          t.drumReverb.connect(t.drumReverbGain),
          (t.kick = audioFileLoader("/sounds/kick.wav", t)),
          (t.snare = audioFileLoader("/sounds/snare.wav", t)),
          (t.hihat = audioFileLoader("/sounds/hihat.wav", t)),
          (t.cymbal = audioFileLoader("/sounds/cymbal.wav", t));
      });
    }),
    e.send();
}
function audioFileLoader(e, t, a) {
  var n = void 0,
    o = {};
  o.fileDirectory = e;
  var i = new XMLHttpRequest();
  return (
    i.open("GET", o.fileDirectory, !0),
    (i.responseType = "arraybuffer"),
    (i.onload = function () {
      t.context.decodeAudioData(i.response, function (e) {
        o.soundToPlay = e;
      });
    }),
    i.send(),
    (o.play = function (e) {
      ((n = t.context.createBufferSource()).buffer = o.soundToPlay),
        n.connect(t.drumReverb),
        n.connect(t.drumGain),
        n.start(e);
    }),
    (o.stop = function (e) {
      n.stop(t.context.currentTime + e || t.context.currentTime);
    }),
    o
  );
}
function getNoteFrequency(e) {
  return noteValues[e];
}
function getOctaveOffset(e, t) {
  return (e =
    e.substring(0, e.length - 1) + Math.max(0, Number(e[e.length - 1]) + t));
}
function getNoteOffset(e, t) {
  var a = e.substring(0, e.length - 1),
    n = noteLetters.indexOf(a);
  n += t;
  var o = noteLetters[(100 * noteLetters.length + n) % noteLetters.length],
    i = Number(e[e.length - 1]);
  return o + Math.max(0, Math.min(7, i + Math.floor(n / noteLetters.length)));
}
function getGroove(e) {
  switch ((e.noteIndex * (4 / e.noteDivision)) % 2) {
    case 0:
      return 1 * e.grooveAmount * e.grooveTime;
    case 1:
      return -1 * e.grooveAmount * e.grooveTime;
  }
}
function initSynthInteractions(o, e) {
  (o.playButton = document.getElementById("synth-play")),
    (o.bpmInput = document.getElementById("synth-bpm")),
    (o.swingInput = document.getElementById("synth-swing")),
    (o.synthSequencerNodes = document.getElementById("synth-nodes").children),
    (o.synthDrumNodes = document.getElementsByClassName("sequencer__drum")),
    (o.synthKnobs = document.getElementsByClassName("synth__knobOuter")),
    (o.synthButtons = document.getElementsByClassName(
      "synth__buttonInputInner"
    )),
    (o.synthSelects = document.getElementsByClassName("synth__select")),
    (o.holdingKnob = null),
    (o.knobInput = 0),
    (o.knobInner = 0),
    (o.knobValue = 0),
    (o.knobMin = 0),
    (o.knobMax = 0),
    (o.knobIncrement = 1),
    (o.knobParam = ""),
    (o.startX = 0),
    (o.startY = 0),
    (o.holdingNode = null),
    (o.nodeIndex = 0),
    (o.nodeStart = null),
    (o.nodeFinal = null),
    (o.noteChanged = !1),
    (o.activeNodes = document.getElementById("synth-nodes")),
    window.addEventListener("mousemove", function (e) {
      if (o.holdingKnob) {
        var t = e.clientX - o.startX - (e.clientY - o.startY);
        (o.knobValue = Math.max(
          o.knobMin,
          Math.min(o.knobMax, o.knobValue + t * o.knobIncrement)
        )),
          (o.startX = e.clientX),
          (o.startY = e.clientY),
          updateParam(o.knobParam, o.knobValue, o),
          (o.knobInput.value = String(o.knobValue).substring(0, 5)),
          (o.knobInner.style.transform =
            "rotate(" +
            (((o.knobValue - o.knobMin) / o.knobIncrement) * 1.5 - 150) +
            "deg)");
      }
      if (o.holdingNode) {
        var a = absFloor(
          (t = e.clientX - o.startX - (e.clientY - o.startY)) / 10
        );
        (o.nodeFinal = getNoteOffset(o.nodeStart, a)),
          o.nodeFinal != o.nodeStart && (o.noteChanged = !0),
          (o.notes[o.nodeIndex] = o.nodeFinal),
          (o.holdingNode.children[1].value = o.nodeFinal);
      }
    }),
    window.addEventListener("mouseup", function () {
      o.holdingKnob && (o.holdingKnob = null),
        o.holdingNode &&
          (o.noteChanged ||
            ((o.notesActive[o.nodeIndex] = !o.notesActive[o.nodeIndex]),
            (o.holdingNode.children[0].checked = !o.holdingNode.children[0]
              .checked)),
          (o.holdingNode = null)),
        synthSave(o);
    }),
    forEach(o.synthKnobs, function (a, e) {
      a.addEventListener("mousedown", function (e) {
        var t = (o.holdingKnob = a).getElementsByTagName("input")[0];
        (o.knobInput = t),
          (o.knobInner = a.children[0]),
          (o.knobValue = Number(t.value)),
          (o.knobMin = Number(t.getAttribute("data-min"))),
          (o.knobMax = Number(t.getAttribute("data-max"))),
          (o.knobIncrement = (o.knobMax - o.knobMin) / 200),
          (o.knobParam = t.getAttribute("data-param")),
          e && ((o.startX = e.clientX), (o.startY = e.clientY));
      }),
        initKnob(a, o);
    }),
    forEach(o.synthButtons, function (e, t) {
      e.addEventListener("change", function (e) {
        var t = this.value;
        updateParam(this.getAttribute("data-param"), t, o), synthSave(o);
      }),
        e.value == getParam(e.getAttribute("data-param"), o) &&
          (e.checked = !0);
    }),
    o.playButton.addEventListener("click", function () {
      toggleSequencerPlaying(o);
    }),
    document
      .getElementById("show-synth")
      .addEventListener("change", function () {
        this.checked &&
          ((o.activeNodes = document.getElementById("synth-nodes")),
          (document.getElementById("synth-nodes").style.display = "flex"),
          (document.getElementById("drum-nodes").style.display = "none"));
      }),
    document
      .getElementById("show-drums")
      .addEventListener("change", function () {
        this.checked &&
          ((o.activeNodes = document.getElementById("drum-nodes")),
          (document.getElementById("drum-nodes").style.display = "flex"),
          (document.getElementById("synth-nodes").style.display = "none"));
      }),
    (o.bpmInput.value = o.bpm),
    o.bpmInput.addEventListener("change", function () {
      isNaN(this.value) ||
        ((o.bpm = Math.max(1, Math.min(300, this.value))),
        (o.tickInterval = 60 / o.bpm / o.noteDivision)),
        (this.value = o.bpm);
    }),
    forEach(o.synthSequencerNodes, function (e, t) {
      (e.children[1].value = o.notes[t]),
        (e.children[0].checked = o.notesActive[t]),
        e.addEventListener("mousedown", function (e) {
          (o.holdingNode = this),
            (o.nodeStart = this.children[1].value),
            (o.nodeIndex = this.getAttribute("data-index")),
            (o.noteChanged = !1),
            e && ((o.startX = e.clientX), (o.startY = e.clientY));
        });
    }),
    forEach(o.synthDrumNodes, function (t, e) {
      var a = t.parentNode.getAttribute("data-index"),
        n = t.getAttribute("data-drum");
      (t.children[0].checked = 1 == o.drums[n][a]),
        t.addEventListener("click", function (e) {
          (t.children[0].checked = !t.children[0].checked),
            (o.drums[n][a] = t.children[0].checked ? 1 : 0);
        });
    });
}
function initKnob(e, t) {
  var a = e.getElementsByTagName("input")[0],
    n = e.children[0],
    o = Number(a.getAttribute("data-min")),
    i = (Number(a.getAttribute("data-max")) - o) / 200,
    s = getParam(a.getAttribute("data-param"), t);
  (a.value = String(s).substring(0, 5)),
    (n.style.transform = "rotate(" + (((s - o) / i) * 1.5 - 150) + "deg)");
}
function updateParam(e, t, a) {
  for (var n = e.split("."), o = 0, i = n.length, s = a; s && o < i; )
    o == i - 1 ? (s[n[o]] = t) : (s = s[n[o]]), o++;
}
function getParam(e, t) {
  for (var a = e.split("."), n = 0, o = a.length, i = t; i && n < o; ) {
    if (n == o - 1) return i[a[n]];
    (i = i[a[n]]), n++;
  }
}
function toggleSequencerPlaying(e) {
  (e.sequencerPlaying = !e.sequencerPlaying),
    e.sequencerPlaying
      ? ((e.nextTick = e.context.currentTime),
        (e.noteIndex = 15),
        e.started || (e.osc1.start(), e.osc2.start(), (e.started = !0)),
        runSequencer(e),
        (e.playButton.innerHTML = "Stop"))
      : ((e.playButton.innerHTML = "Play"),
        e.amp.gain.cancelScheduledValues(e.context.currentTime),
        e.amp.gain.linearRampToValueAtTime(1e-5, e.context.currentTime + 0.1),
        showActiveNode(e));
}
function showActiveNode(a) {
  a.sequencerPlaying
    ? forEach(a.activeNodes.children, function (e, t) {
        boolClass(e, "is-playing", a.noteIndex == t);
      })
    : forEach(a.activeNodes.children, function (e, t) {
        boolClass(e, "is-playing", !1);
      });
}
function synthSave(e) {
  (e.osc1Type = e.osc1.type), (e.osc2Type = e.osc2.type);
  var t = JSON.stringify(e);
  window.localStorage.setItem("synth", t);
}
(color.khaki = "#B4B17C"),
  (color.yellow = "#F4ECA4"),
  (color.red = "#B65B7F"),
  (color.green = "#5B8B6C"),
  (color.purple = "#7F519D"),
  (color.grey = "#E0DED1"),
  (color.black = "#1F0539"),
  (color.white = "#F5F4F0");
var synthLoadParams = [
  "ampEnv",
  "bpm",
  "tickInterval",
  "delayFeedbackInput",
  "delayTimeInput",
  "distortionInput",
  "drums",
  "grooveAmount",
  "grooveTime",
  "highpassEnv",
  "highpassFreq",
  "highpassFreqInput",
  "highpassResInput",
  "lowpassEnv",
  "lowpassFreq",
  "lowpassFreqInput",
  "lowpassResInput",
  "noteLength",
  "notes",
  "notesActive",
  "osc1Fine",
  "osc1Octave",
  "osc1Pitch",
  "osc1Semi",
  "osc1LevelInput",
  "osc2Fine",
  "osc2Octave",
  "osc2Pitch",
  "osc2Semi",
  "osc2LevelInput",
  "oscLevelInput",
  "oscPitch",
  "portamento",
  "portamentoInput",
  "reverbInput",
  "voltEnv",
];
function synthLoad(t) {
  var a = window.localStorage.getItem("synth");
  a &&
    ((a = JSON.parse(a)),
    forEach(synthLoadParams, function (e) {
      a[e] && (t[e] = a[e]);
    }),
    (t.osc1.type = a.osc1Type),
    (t.osc2.type = a.osc2Type));
}
function calculateWaveform(e) {
  e.analyser.getByteTimeDomainData(e.dataArray);
}
function drawWaveform(e) {
  (e.ctx.strokeStyle = color.white),
    (e.ctx.lineJoin = "round"),
    (e.ctx.lineWidth = 2 / e.dpi),
    e.ctx.clearRect(0, 0, e.cw, e.ch),
    e.ctx.beginPath();
  for (var t = e.cw / e.bufferLength, a = 0, n = 0; n < e.bufferLength; n++) {
    var o = ((e.dataArray[n] / 128) * e.ch) / 2;
    0 === n ? e.ctx.moveTo(a, o) : e.ctx.lineTo(a, o), (a += t);
  }
  e.ctx.stroke();
}
var typeInput,
  typeList,
  noteLetters = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ],
  sharpLetters = ["C#", "D#", "F#", "G#", "A#"],
  noteValues = {
    C0: 16.35,
    "C#0": 17.32,
    Db0: 17.32,
    D0: 18.35,
    "D#0": 19.45,
    Eb0: 19.45,
    E0: 20.6,
    F0: 21.83,
    "F#0": 23.12,
    Gb0: 23.12,
    G0: 24.5,
    "G#0": 25.96,
    Ab0: 25.96,
    A0: 27.5,
    "A#0": 29.14,
    Bb0: 29.14,
    B0: 30.87,
    C1: 32.7,
    "C#1": 34.65,
    Db1: 34.65,
    D1: 36.71,
    "D#1": 38.89,
    Eb1: 38.89,
    E1: 41.2,
    F1: 43.65,
    "F#1": 46.25,
    Gb1: 46.25,
    G1: 49,
    "G#1": 51.91,
    Ab1: 51.91,
    A1: 55,
    "A#1": 58.27,
    Bb1: 58.27,
    B1: 61.74,
    C2: 65.41,
    "C#2": 69.3,
    Db2: 69.3,
    D2: 73.42,
    "D#2": 77.78,
    Eb2: 77.78,
    E2: 82.41,
    F2: 87.31,
    "F#2": 92.5,
    Gb2: 92.5,
    G2: 98,
    "G#2": 103.83,
    Ab2: 103.83,
    A2: 110,
    "A#2": 116.54,
    Bb2: 116.54,
    B2: 123.47,
    C3: 130.81,
    "C#3": 138.59,
    Db3: 138.59,
    D3: 146.83,
    "D#3": 155.56,
    Eb3: 155.56,
    E3: 164.81,
    F3: 174.61,
    "F#3": 185,
    Gb3: 185,
    G3: 196,
    "G#3": 207.65,
    Ab3: 207.65,
    A3: 220,
    "A#3": 233.08,
    Bb3: 233.08,
    B3: 246.94,
    C4: 261.63,
    "C#4": 277.18,
    Db4: 277.18,
    D4: 293.66,
    "D#4": 311.13,
    Eb4: 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    Gb4: 369.99,
    G4: 392,
    "G#4": 415.3,
    Ab4: 415.3,
    A4: 440,
    "A#4": 466.16,
    Bb4: 466.16,
    B4: 493.88,
    C5: 523.25,
    "C#5": 554.37,
    Db5: 554.37,
    D5: 587.33,
    "D#5": 622.25,
    Eb5: 622.25,
    E5: 659.26,
    F5: 698.46,
    "F#5": 739.99,
    Gb5: 739.99,
    G5: 783.99,
    "G#5": 830.61,
    Ab5: 830.61,
    A5: 880,
    "A#5": 932.33,
    Bb5: 932.33,
    B5: 987.77,
    C6: 1046.5,
    "C#6": 1108.73,
    Db6: 1108.73,
    D6: 1174.66,
    "D#6": 1244.51,
    Eb6: 1244.51,
    E6: 1318.51,
    F6: 1396.91,
    "F#6": 1479.98,
    Gb6: 1479.98,
    G6: 1567.98,
    "G#6": 1661.22,
    Ab6: 1661.22,
    A6: 1760,
    "A#6": 1864.66,
    Bb6: 1864.66,
    B6: 1975.53,
    C7: 2093,
    "C#7": 2217.46,
    Db7: 2217.46,
    D7: 2349.32,
    "D#7": 2489.02,
    Eb7: 2489.02,
    E7: 2637.02,
    F7: 2793.83,
    "F#7": 2959.96,
    Gb7: 2959.96,
    G7: 3135.96,
    "G#7": 3322.44,
    Ab7: 3322.44,
    A7: 3520,
    "A#7": 3729.31,
    Bb7: 3729.31,
    B7: 3951.07,
    C8: 4186.01,
  };
