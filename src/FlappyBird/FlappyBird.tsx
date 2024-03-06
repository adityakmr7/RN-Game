import { Platform, useWindowDimensions } from "react-native";
import {
  Canvas,
  Group,
  Image,
  matchFont,
  Text,
  useImage,
} from "@shopify/react-native-skia";
import {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const BIRD_WIDTH = 50;
const GRAVITY = 900;
const JUMP_FORCE = -500;

const FlappyBird = () => {
  const { width, height } = useWindowDimensions();
  const [score, setScore] = useState(0);
  const bg = useImage(require("./assets/sprites/background-day.png"));
  const bird = useImage(require("./assets/sprites/bluebird-midflap.png"));
  const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
  const pipesTop = useImage(require("./assets/sprites/pipe-green-up.png"));
  const base = useImage(require("./assets/sprites/base.png"));
  const gameOver = useSharedValue(false);
  const x = useSharedValue(width);
  const birdY = useSharedValue(height / 3);
  const birdYVelocity = useSharedValue(0);
  const birdPos = {
    x: width / 4,
  };
  const birdRotation = useDerivedValue(() => {
    return [
      {
        rotate: interpolate(
          birdYVelocity.value,
          [-500, 500],
          [-0.5, 0.5],
          Extrapolation.CLAMP
        ),
      },
    ];
  });
  const birdOrigin = useDerivedValue(() => {
    return { x: width / 4 + 32, y: birdY.value + 24 };
  });
  const pipeOffset = 0;

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt || gameOver.value) {
      return;
    }
    birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
    birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
  });

  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(-150, { duration: 3000, easing: Easing.linear }),
        withTiming(width, { duration: 0 })
        // withTiming(-200,{duration:3000,easing:Easing.linear}),
      ),
      -1
    );
    // birdY.value = withTiming(height, {
    //     duration:1000,
    // })
  }, []);
  const gesture = Gesture.Tap().onStart(() => {
    birdYVelocity.value = JUMP_FORCE;
  });

  useAnimatedReaction(
    () => {
      return x.value;
    },
    (currentValue, previousValue) => {
      const middle = birdPos.x;
      if (
        currentValue !== previousValue &&
        previousValue &&
        currentValue <= middle &&
        previousValue > middle
      ) {
        runOnJS(setScore)(score + 1);
      }
    }
  );

  // Collision detection
  useAnimatedReaction(
    () => {
      return birdY.value;
    },
    (currentValue, previousValue) => {
      if (currentValue > height - 150) {
        console.log("Game Over");
        gameOver.value = true;
        cancelAnimation(x);
      }
    }
  );
  useAnimatedReaction(
    () => {
      return gameOver.value;
    },
    (currentValue, previousValue) => {
      if (currentValue && !previousValue) {
        cancelAnimation(x);
      }
    }
  );

  const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
  const fontStyle = {
    fontFamily,
    fontSize: 28,
    fontStyle: "bold",
    fontWeight: "bold",
  };
  // @ts-ignore
  const font = matchFont(fontStyle);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width, height }}>
          <Image fit={"cover"} image={bg} width={width} height={height} />

          {/*//TOP PIPE*/}
          <Image
            image={pipesTop}
            width={103}
            height={640}
            x={x}
            y={pipeOffset - 320}
          />

          {/*// BOTTOM PIPE*/}
          <Image
            image={pipeBottom}
            width={103}
            height={640}
            x={x}
            y={height - 320 + pipeOffset}
          />

          <Image
            fit={"cover"}
            image={base}
            width={width}
            height={height - 75}
            y={height - 50}
            x={0}
          />
          <Group transform={birdRotation} origin={birdOrigin}>
            <Image
              image={bird}
              y={birdY}
              x={birdPos.x}
              width={BIRD_WIDTH}
              height={BIRD_WIDTH}
            />
          </Group>
          {/*// SCORE*/}
          <Text font={font} text={score.toString()} x={width / 2} y={100} />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default FlappyBird;
