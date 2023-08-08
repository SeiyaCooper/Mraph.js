import Matrix from "../math/Matrix.js";

export default class Graph {
    size = 7;
    dash = [];
    alpha = 1;
    fillColor = "white";
    strokeColor = "black";
    strokeWidth = 5;

    matrix = Matrix.identity(3);
}
