import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";

import {Ionicons as Icon} from '@expo/vector-icons';
import {COLORS} from "../styles/colors";
interface HeaderProps {
    reloadGame: () => void
    pauseGame: () => void
    children: JSX.Element
    isPaused: boolean
}
export default function Header({children,reloadGame,pauseGame,isPaused}:HeaderProps):JSX.Element{
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={reloadGame}>
                <Icon name={"reload-circle"} size={35} color={COLORS.primary}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={pauseGame}>
                <Icon name={isPaused ? "play-circle":"pause-circle"} size={35} color={COLORS.primary}/>
            </TouchableOpacity>
            {children}
        </View>
    )
}

const styles =StyleSheet.create( {
    container: {
      flex:0.05,
      flexDirection:'row',
      alignItems:'center',
        justifyContent:'space-between',
        borderColor:COLORS.primary,
        borderWidth:12,
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
        padding:15,
        backgroundColor:COLORS.background
    },
    header: {
        height:50,
        backgroundColor:'#f2f2f2',
        justifyContent:'center',
        alignItems:'center'
    },
    title: {
        fontSize:20,
        fontWeight:'bold'
    }
});
