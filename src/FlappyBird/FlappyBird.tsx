import {Text, useWindowDimensions, View} from "react-native";
import {Canvas, Circle, Group, Image, useImage} from "@shopify/react-native-skia";

const BIRD_WIDTH = 50;
const FlappyBird = () => {
    const{width,height}= useWindowDimensions();
    const bg = useImage(require('./assets/sprites/background-day.png'));
    const bird = useImage(require('./assets/sprites/bluebird-midflap.png'));
    const pipeBottom  = useImage(require('./assets/sprites/pipe-green.png'));
    const pipesTop  = useImage(require('./assets/sprites/pipe-green-up.png'));
    const base = useImage(require('./assets/sprites/base.png'));

    const pipeOffset = 100;

    return (
    <Canvas style={{width,height}}>
        <Image fit={'cover'} image={bg} width={width} height={height}/>

        {/*//TOP PIPE*/}
        <Image image={pipesTop} width={103} height={640} x={width/2} y = {pipeOffset -320} />

        {/*// BOTTOM PIPE*/}
        <Image image={pipeBottom} width={103} height={640} x={width/2} y = {height-320 +pipeOffset}  />

        
        <Image fit={'cover'} image={base} width={width} height={height-75} y = {height -50} x={0}/>

        <Image image={bird} y={height/2} width={BIRD_WIDTH} height={BIRD_WIDTH} x={width/2 - BIRD_WIDTH /2}/>
    </Canvas>
    )
}

export default FlappyBird;
