import React, { useEffect, useState } from 'react';
import { Box, Select, MenuItem, Button } from '@mui/joy';
import * as Tone from 'tone';

const App = () => {
  const [selectedMidiDevice, setSelectedMidiDevice] = useState(null);
  const [midiDevices, setMidiDevices] = useState([]);
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    const newSynth = new Tone.PolySynth().toDestination();
    setSynth(newSynth);
  }, []);

  useEffect(() => {
    const getMIDIMessage = (message) => {
      console.log('MIDIMessageEvent data', message.data);
      let command = message.data[0];
      let note = message.data[1];
      let velocity = (message.data.length > 2) ? message.data[2] / 127 : 1;
    
      if (synth) { // check if synth is not null
        switch (command) {
          case 145: // noteOn
            if (velocity > 0) {
              synth.triggerAttack(Tone.Frequency(note, "midi").toFrequency(), Tone.now(), velocity);
            } else {
              synth.triggerRelease(Tone.Frequency(note, "midi").toFrequency(), Tone.now());
            }
            break;
          case 129: // noteOff
            synth.triggerRelease(Tone.Frequency(note, "midi").toFrequency(), Tone.now());
            break;
          default:
            break;
        }
      }
    };
    

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(midiAccess => {
          let inputs = Array.from(midiAccess.inputs.values());
          setMidiDevices(inputs);
          inputs.forEach(input => {
            input.onmidimessage = getMIDIMessage;
          });
        }, () => {
          console.warn("Could not access your MIDI devices.");
        });
    } else {
      console.warn("No MIDI support in your browser.");
    }
  }, [synth]);

  const handleMidiDeviceChange = (event) => {
    setSelectedMidiDevice(event.target.value);
  };

  const handleStart = async () => {
    await Tone.start();
  };

  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
        <Select value={selectedMidiDevice} onChange={handleMidiDeviceChange}>
          {midiDevices.map((device, index) => (
            <MenuItem key={index} value={device}>{device.name}</MenuItem>
          ))}
        </Select>
        <Button onClick={handleStart}>Start</Button>
      </Box>
    </div>
  );
};

export default App;
