import { useEffect } from 'react';
import * as Tone from 'tone';

const PolySynth = ({ selectedMidiDevice }) => {
  const synth = new Tone.PolySynth().toDestination();

  useEffect(() => {
    if (selectedMidiDevice) {
      selectedMidiDevice.onmidimessage = getMIDIMessage;
    }

    function getMIDIMessage(message) {
      console.log(message);
      let command = message.data[0];
      let note = message.data[1];
      let velocity = (message.data.length > 2) ? message.data[2] / 127 : 1; // a velocity value. 

      switch (command) {
        case 144: // noteOn
          if (velocity > 0) {
            synth.triggerAttack(Tone.Frequency(note, "midi").toFrequency(), Tone.now(), velocity);
          } else {
            synth.triggerRelease(Tone.Frequency(note, "midi").toFrequency(), Tone.now());
          }
          break;
        case 128: // noteOff
          synth.triggerRelease(Tone.Frequency(note, "midi").toFrequency(), Tone.now());
          break;
        default:
          break;
      }
    }
  }, [selectedMidiDevice, synth]);

  return null;
};

export default PolySynth;
