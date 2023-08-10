import Matrix from "../math/Matrix.js";

export default class Graph {
    size = 7;
    dash = [];
    alpha = 1;
    visible = true;
    fillColor = "rgba(0, 0, 0, 0)";
    strokeColor = "black";
    strokeWidth = 5;

    matrix = Matrix.identity(4);
}
