import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Game from "./components/Game";
export default function SnakeGame() {
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
