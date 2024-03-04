import React,{JSX} from "react";
import {StyleSheet, View} from "react-native";
import {Coordinates} from "../types/types";
import {COLORS} from "../styles/colors";

interface SnakeProps {
    snake: Coordinates[]

}
export default function Snake({snake}:SnakeProps): JSX.Element {

    return (
        <>
            {snake.map((segment:Coordinates,index:number) => (
                <View key={index} style={[styles.snake,{left:segment.x*10,top:segment.y*10}]}/>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    snake: {
        width:10,
        height:10,
        borderRadius:7,
        backgroundColor:COLORS.primary,
        position:'absolute'
    }
})
