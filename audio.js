//"use strict";
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var volume = audioContext.createGain();
var volumeControl = document.querySelector("#volume");
var play, oscillator, changefreq, changetype;

var oscProp = {
  type: "sine",
  frequency: 440,
  playing: false,
};

volume.connect(audioContext.destination);

volumeControl.addEventListener(
  "input",
  function () {
    volume.gain.value = this.value;
  },
  false
);

window.onload = function () {
  play = function () {
    if (oscProp.playing) {
      oscillator.stop();
      oscProp.playing = false;
    } else {
      oscillator = audioContext.createOscillator();
      oscillator.type = oscProp.type;
      oscillator.frequency.setValueAtTime(
        oscProp.frequency,
        audioContext.currentTime
      );
      oscillator.connect(volume);
      oscillator.start();
      oscProp.playing = true;
    }
  };

  changefreq = function () {
    oscProp.frequency = document.getElementById("freqslider").value * 30;
    // console.log(oscProp.type);
    play();
    play();
  };

  changetype = function () {
    oscProp.type = document.querySelector(
      "input[name = 'waveform']:checked"
    ).value;
    //console.log(oscProp.type);
    play();
    play();
  };
};
