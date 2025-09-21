import React from 'react';
import Slider from './components/Slider';
import PhoneInput from './components/PhoneInput';
import useExtensionSettings from './hooks/useExtensionSettings';
import './styles.css';

const App = () => {
  const {
    politicalStance,
    grandkidPhone,
    updatePoliticalStance,
    updateGrandkidPhone
  } = useExtensionSettings();

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <div className="logo"></div>
        </div>
        <div className="title">Operation Grandson</div>
        <div className="subtitle">Building bridges through better conversations</div>
      </div>

      <div className="controls">
        <div className="control-group">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Extension Active - Connected to local server</span>
          </div>
        </div>

        <div className="control-group">
          <Slider
            value={politicalStance}
            onChange={updatePoliticalStance}
            min={-50}
            max={50}
            label="Political Perspective"
            leftLabel="LEFT"
            rightLabel="RIGHT"
          />
        </div>

        <div className="control-group">
          <PhoneInput
            value={grandkidPhone}
            onChange={updateGrandkidPhone}
            label="Family Member Phone"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="footer">
        Helping families stay connected ❤️
      </div>
    </div>
  );
};

export default App;