import React from 'react';
import { View } from 'react-native';

export default function RecaptchaContainer() {
  return (
    <View 
      id="recaptcha-container" 
      style={{ 
        position: 'absolute', 
        top: -1000, 
        left: -1000,
        width: 1,
        height: 1,
        opacity: 0
      }} 
    />
  );
}
