import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SnakeGame from "./src/SnakeGame";
import FlappyBird from "./src/FlappyBird";

export default function App() {
  return (
      <FlappyBird/>
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
