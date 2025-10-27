import React from 'react';
import { CartaoProvider } from './CartaoContext';
import { Stack } from 'expo-router';

export default function App() {
  return (
    <CartaoProvider>
      <Stack />
    </CartaoProvider>
  );
}
