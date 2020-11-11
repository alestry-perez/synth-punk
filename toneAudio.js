console.clear();
import * as Tone from "tone";

const synth = [new Tone.Synth(), new Tone.Synth(), new Tone.Synth()];

synths[0].oscillator.type = "triangle";
synths[1].oscillator.type = "sine";
synths[2].oscillator.type = "square";

synths.forEach((synth) => synth.toMaster());
