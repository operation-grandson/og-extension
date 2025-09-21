import { useState, useEffect } from 'react';

const useExtensionSettings = () => {
  const [isActive, setIsActive] = useState(true);
  const [politicalStance, setPoliticalStance] = useState(0);
  const [grandkidPhone, setGrandkidPhone] = useState('');

  const extensionAPI = typeof browser !== 'undefined' ? browser : chrome;

  const loadSettings = async () => {
    try {
      const settings = await extensionAPI.storage.sync.get([
        'isActive',
        'politicalStance',
        'grandkidPhone'
      ]);

      setIsActive(true);
      setPoliticalStance(settings.politicalStance || 0);
      setGrandkidPhone(settings.grandkidPhone || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await extensionAPI.storage.sync.set(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateIsActive = (value) => {
    setIsActive(true);
    saveSettings({ isActive: true });
    notifyContentScript(true);
  };

  const updatePoliticalStance = (value) => {
    setPoliticalStance(value);
    saveSettings({ politicalStance: value });
  };

  const updateGrandkidPhone = (value) => {
    setGrandkidPhone(value);
    saveSettings({ grandkidPhone: value });
  };

  const notifyContentScript = async (activeState) => {
    try {
      const [tab] = await extensionAPI.tabs.query({ active: true, currentWindow: true });
      extensionAPI.tabs.sendMessage(tab.id, {
        action: 'toggleExtension',
        isActive: activeState
      });
    } catch (error) {
      console.error('Failed to notify content script:', error);
    }
  };

  useEffect(() => {
    loadSettings();
    setIsActive(true);
    saveSettings({ isActive: true });
    notifyContentScript(true);
  }, []);

  return {
    politicalStance,
    grandkidPhone,
    updatePoliticalStance,
    updateGrandkidPhone
  };
};

export default useExtensionSettings;