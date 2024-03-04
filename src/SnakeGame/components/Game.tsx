import React, {JSX, useEffect} from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {COLORS} from "../styles/colors";
import {PanGestureHandler} from "react-native-gesture-handler";
import {Coordinates, Direction, GestureEventType} from "../types/types";
import Snake from "./Snake";
import {checkGameOver} from "../utils/checkGameOver";
import Food from "./Food";
import {checkEatsFood} from "../utils/checkEatsFood";
import Header from "./Header";

const SNAKE_INITIAL_POSITION = [{x:0,y:0},{x:1,y:0},{x:2,y:0}]
const FOOD_INITIAL_POSITION = {x:8,y:8}
const GAME_BOUNDS = {xMin:0,xMax:35,yMin:0,yMax:63}
const MOVE_INTERNAL = 50;
const SCORE_INCREASE = 10;
export default function Game():JSX.Element {
    const [direction,setDirection] = React.useState<Direction>(Direction.RIGHT)
    const [snake,setSnake] = React.useState<Coordinates[]>(SNAKE_INITIAL_POSITION);
    const [food,setFood] = React.useState<Coordinates>(FOOD_INITIAL_POSITION);
    const [isGameOver,setIsGameOver] = React.useState<boolean>(false);
    const [isPaused,setIsPaused] = React.useState<boolean>(false);
    const [score,setScore] = React.useState<number>(0);
    useEffect(() => {
        if(!isGameOver) {
            const interval = setInterval(() => {
               !isPaused && moveSnake()
            },MOVE_INTERNAL)
            return () => clearInterval(interval)
        }
    },[isGameOver,isPaused,snake])
    const moveSnake = () => {
        const snakeHead = snake[0];
        const newHead = {...snakeHead}; // copy the head
        if(checkGameOver(newHead,GAME_BOUNDS)) {
            setIsGameOver(true)
            return;
        }
        switch (direction) {
            case Direction.UP:
                newHead.y -= 1;
                break;
            case Direction.DOWN:
                newHead.y += 1;
                break;
            case Direction.LEFT:
                newHead.x -= 1;
                break;
            case Direction.RIGHT:
                newHead.x += 1;
                break;
        }
        if(checkEatsFood(newHead,food,2)) {
            setFood({
                x:Math.floor(Math.random()*GAME_BOUNDS.xMax),
                y:Math.floor(Math.random()*GAME_BOUNDS.yMax)
            })
            setSnake([newHead,...snake])
            setScore(score+SCORE_INCREASE);
        }else{

            setSnake([newHead,...snake.slice(0,-1)])
        }

    }
    const handleGesture = (event:GestureEventType) => {
        const {translationX,translationY} = event.nativeEvent;
        console.log(translationX,translationY)
        if(Math.abs(translationX) > Math.abs(translationY)) {
            if(translationX > 0) {
                setDirection(Direction.RIGHT)
                console.log('right')
            } else {
                setDirection(Direction.LEFT)
                console.log('left')
            }
        }else {
            if(translationY > 0) {
                setDirection(Direction.DOWN)
                console.log('down')
            } else {
                setDirection(Direction.UP)
                console.log('up')
            }

        }
    }

    const reloadGame = () => {
        setSnake(SNAKE_INITIAL_POSITION)
        setFood(FOOD_INITIAL_POSITION)
        setDirection(Direction.RIGHT)
        setScore(0)
        setIsGameOver(false)
    }
    const pauseGame = () => {
        setIsPaused(!isPaused)
    }
    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
        <SafeAreaView style={styles.container}>
            <Header reloadGame={reloadGame} pauseGame={pauseGame} isPaused={isPaused}>

                <Text>{score}</Text>
            </Header>
            <View style={styles.boundaries}>
                <Food x={food.x} y={food.y}/>
                <Snake snake={snake}/>
            </View>

        </SafeAreaView>
        </PanGestureHandler>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:COLORS.primary,
        flex:1
    },
    boundaries: {
        flex:1,
        borderColor:COLORS.secondary,
        borderWidth:12,
        borderBottomRightRadius:30,
        borderBottomLeftRadius:30,
        position:'relative',
        width:'100%',
        height:'100%',
        backgroundColor:COLORS.background
    }
})
