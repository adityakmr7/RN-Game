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
const pipeWidth = 104;
const pipeHeight = 640;
const FlappyBird = () => {
  const { width, height } = useWindowDimensions();
  const [score, setScore] = useState(0);
  const bg = useImage(require("./assets/sprites/background-day.png"));
  const bird = useImage(require("./assets/sprites/bluebird-midflap.png"));
  const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
  const pipesTop = useImage(require("./assets/sprites/pipe-green-up.png"));
  const base = useImage(require("./assets/sprites/base.png"));

  const gameOver = useSharedValue(false);
  const pipeX = useSharedValue(width);

  const birdY = useSharedValue(height / 3);
  const birdX = width / 4;
  const birdYVelocity = useSharedValue(0);

  const pipeOffset = useSharedValue(0);
  const topPipeY = useDerivedValue(() => pipeOffset.value - 320);
  const bottomPipeY = useDerivedValue(() => height - 320 + pipeOffset.value);

  const pipesSpeed = useDerivedValue(() => {
    return interpolate(score, [0, 20], [1, 2]);
  });

  const obstacles = useDerivedValue(() => [
    // bottom pipe
    {
      x: pipeX.value,
      y: bottomPipeY.value,
      h: pipeHeight,
      w: pipeWidth,
    },
    // top pipe
    {
      x: pipeX.value,
      y: topPipeY.value,
      h: pipeHeight,
      w: pipeWidth,
    },
  ]);

  useEffect(() => {
    moveTheMap();
  }, []);

  const moveTheMap = () => {
    pipeX.value = withSequence(
      withTiming(width, { duration: 0 }),
      withTiming(-150, {
        duration: 3000 / pipesSpeed.value,
        easing: Easing.linear,
      }),
      withTiming(width, { duration: 0 })
      // withTiming(-200,{duration:3000,easing:Easing.linear}),
    );

    // birdY.value = withTiming(height, {
    //     duration:1000,
    // })
  };

  useAnimatedReaction(
    () => {
      return pipeX.value;
    },
    (currentValue, previousValue) => {
      const middle = birdX;
      // change offset for the position of the next gap
      if (previousValue && currentValue < -100 && previousValue > -100) {
        pipeOffset.value = Math.random() * 400 - 200;
        cancelAnimation(pipeX);
        runOnJS(moveTheMap)();
      }
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

  // @ts-ignore
  const isPointCollidingWithRect = (point, rect) => {
    "worklet";
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.w &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.h
    );
  };

  // Collision detection
  useAnimatedReaction(
    () => {
      return birdY.value;
    },
    (currentValue, previousValue) => {
      const center = {
        x: birdX + 32,
        y: birdY.value + 24,
      };
      // GROUND COLLISION
      if (currentValue > height - 100 || currentValue < 0) {
        gameOver.value = true;
      }
      // // PIPE COLLISION
      // if (currentValue > height - 100 || currentValue < 0) {
      //   gameOver.value = true;
      // }
      const isColliding = obstacles.value.some((rect) => {
        isPointCollidingWithRect(center, rect);
      });
      if (isColliding) {
        gameOver.value = true;
      }
    }
  );

  useAnimatedReaction(
    () => {
      return gameOver.value;
    },
    (currentValue, previousValue) => {
      if (currentValue && !previousValue) {
        cancelAnimation(pipeX);
      }
    }
  );

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt || gameOver.value) {
      return;
    }
    birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
    birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
  });

  const restartGame = () => {
    "worklet";
    birdY.value = height / 3;
    birdYVelocity.value = 0;
    gameOver.value = false;
    pipeX.value = width;
    runOnJS(moveTheMap)();
    runOnJS(setScore)(0);
  };

  const gesture = Gesture.Tap().onStart(() => {
    if (gameOver.value) {
      // Restart
      restartGame();
    } else {
      birdYVelocity.value = JUMP_FORCE;
    }
  });

  //@ts-ignore
  const birdTransform = useDerivedValue(() => {
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
            width={pipeWidth}
            height={pipeHeight}
            x={pipeX}
            y={topPipeY}
          />

          {/*// BOTTOM PIPE*/}
          <Image
            image={pipeBottom}
            width={pipeWidth}
            height={pipeHeight}
            x={pipeX}
            y={bottomPipeY}
          />

          <Image
            fit={"cover"}
            image={base}
            width={width}
            height={height - 75}
            y={height - 50}
            x={0}
          />
          <Group transform={birdTransform} origin={birdOrigin}>
            <Image
              image={bird}
              y={birdY}
              x={birdX}
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
