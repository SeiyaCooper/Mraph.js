import Matrix from "../math/Matrix.js";

export default class Graph {
    attributes = {
        position: [],
        color: [],
    };
    uniforms = {
        modelMat: Matrix.identity(4),
    };
    mode = "TRIANGLES";
    indices = { type: "UNSIGNED_SHORT", data: [] };
}
