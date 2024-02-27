// Calculates the distance between two points in 2D space
export const  calculateDistance = (pointA, pointB) =>{
    const dx = pointA[0] - pointB[0];
    const dy = pointA[1] - pointB[1];
    return Math.sqrt(dx * dx + dy * dy);
}// calculateDistance