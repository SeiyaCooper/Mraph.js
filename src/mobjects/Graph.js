import Matrix from "../math/Matrix.js";

export default class Graph {
    indices = [];
    colors = [];
    mode = "TRIANGLES";

    // TODO
    get matrix() {
        return Matrix.identity(4);
    }
}
