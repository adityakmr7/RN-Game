import {Coordinates} from "../types/types";

export const checkEatsFood = (
    head:Coordinates,
    food:Coordinates,
    area:number
) :boolean=> {
    const distanceBetweenFoodAndSnakeX:number = Math.abs(head.x - food.x);
    const distanceBetweenFoodAndSnakeY:number = Math.abs(head.y - food.y);
    return (
        distanceBetweenFoodAndSnakeX < area &&
        distanceBetweenFoodAndSnakeY < area
    )
}
