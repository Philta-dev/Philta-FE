import React, {useEffect} from 'react';
import AppInner from './AppInner';
import {Provider} from 'react-redux';
import store from './src/store';
import {LogBox, Platform, StyleSheet, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function App() {
  return (
    <Provider store={store}>
      {Platform.OS === 'ios' ? (
        <>
          <AppInner />
        </>
      ) : (
        <SafeAreaProvider>
          <AppInner />
        </SafeAreaProvider>
      )}
    </Provider>
  );
}

export default App;

const styles = StyleSheet.create({});
