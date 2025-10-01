import React from 'react';
import { View, Platform } from 'react-native';

export default function RecaptchaContainer() {
  // Only render reCAPTCHA container for web platform
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <div
      id="recaptcha-container"
      style={{
        position: 'absolute',
        top: '-1000px',
        left: '-1000px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
