import {Text, useWindowDimensions, View} from "react-native";
import {Canvas, Circle, Group, Image, useImage} from "@shopify/react-native-skia";
import {
    Easing, useFrameCallback,
    useSharedValue,
    withReanimatedTimer,
    withRepeat,
    withSequence,
    withTiming
} from "react-native-reanimated";
import {useEffect} from "react";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
import {Gestures} from "react-native-gesture-handler/lib/typescript/RNGestureHandlerModule.web";

const BIRD_WIDTH = 50;
const GRAVITY = 9.8;

const FlappyBird = () => {
    const{width,height}= useWindowDimensions();
    const bg = useImage(require('./assets/sprites/background-day.png'));
    const bird = useImage(require('./assets/sprites/bluebird-midflap.png'));
    const pipeBottom  = useImage(require('./assets/sprites/pipe-green.png'));
    const pipesTop  = useImage(require('./assets/sprites/pipe-green-up.png'));
    const base = useImage(require('./assets/sprites/base.png'));
    const x = useSharedValue(width -50);
    const birdY = useSharedValue(height/2);
    const birdYVelocity = useSharedValue( 100);
    const pipeOffset = 0;

    useFrameCallback(({timeSincePreviousFrame:dt}) => {
        if(!dt) {
            return ;
        }
        birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
        birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
    });

    useEffect(() => {
        x.value = withRepeat( withSequence(
            withTiming(-200,{duration:3000,easing:Easing.linear}),
            withTiming(width,{duration:0}),
            // withTiming(-200,{duration:3000,easing:Easing.linear}),
        ),-1);
        // birdY.value = withTiming(height, {
        //     duration:1000,
        // })
    },[]);
    const gesture = Gesture.Tap().onStart(( ) => {
        birdYVelocity.value = -300;

    })

    return (
        <GestureHandlerRootView style={{flex:1}}>
<GestureDetector gesture={gesture}>

    <Canvas style={{width,height}} >
        <Image fit={'cover'} image={bg} width={width} height={height}/>

        {/*//TOP PIPE*/}
        <Image image={pipesTop} width={103} height={640} x={x} y = {pipeOffset -320} />

        {/*// BOTTOM PIPE*/}
        <Image image={pipeBottom} width={103} height={640} x={x} y = {height-320 +pipeOffset}  />


        <Image fit={'cover'} image={base} width={width} height={height-75} y = {height -50} x={0}/>

        <Image image={bird} y={birdY} width={BIRD_WIDTH} height={BIRD_WIDTH} x={width/2 - BIRD_WIDTH /2}/>
    </Canvas>

</GestureDetector>

        </GestureHandlerRootView>
    )
}

export default FlappyBird;
