export interface GestureEventType {
    nativeEvent: {translationX:number,translationY:number}
}
export interface Coordinates {
    x:number,
    y:number
}
export enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}
