import {Coordinates} from "../types/types";
import {Text,StyleSheet} from "react-native";
import React,{JSX} from "react";
export default function Food({x,y}:Coordinates):JSX.Element{
    return <Text style={[styles.food,{top:y*10,left:x*10}]}>
        🍎
    </Text>
}


const styles = StyleSheet.create({
    food: {
        width:20,
        height:20,
        borderRadius:7,
        position:'absolute'
    }
})
