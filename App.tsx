import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Game from "./src/components/Game";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function App() {
  return (
      <GestureHandlerRootView style={{flex:1}}>
        <Game/>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
