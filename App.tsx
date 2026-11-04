import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'settings'>('home');

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#090D16" />
        {currentScreen === 'home' ? (
          <HomeScreen onOpenSettings={() => setCurrentScreen('settings')} />
        ) : (
          <SettingsScreen onBack={() => setCurrentScreen('home')} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
});
