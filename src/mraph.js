import Layer from "./core/Layer.js";
import Camera from "./core/Camera.js";
import Texture from "./core/Texture.js";

import Event from "./animation/Event.js";
import Timeline from "./animation/Timeline.js";
import Subscriber from "./animation/Subscriber.js";

import OrbitControl from "./extra/OrbitControl.js";

import WebGLRenderer from "./core/WebGL/WebGLRenderer.js";
import WebGLProgram from "./core/WebGL/WebGLProgram.js";

export * as SlotParser from "./material/SlotParser.js";
import CustomMaterial from "./material/CustomMaterial.js";
import BasicMaterial from "./material/BasicMaterial.js";
import DepthMaterial from "./material/DepthMaterial.js";
import LambertMaterial from "./material/LambertMaterial.js";

import Color from "./math/Color.js";
import Matrix from "./math/Matrix.js";
import Vector from "./math/Vector.js";
import Quat from "./math/Quat.js";

import Geometry from "./geometry/Geometry.js";
import Plane from "./geometry/Plane.js";
import Box from "./geometry/Box.js";
import Segment from "./geometry/Segment.js";
import Sphere from "./geometry/Sphere.js";

import DirectionalLight from "./light/DirectionalLight.js";
import PointLight from "./light/PointLight.js";

import Graph2D from "./mobjects/Graph2D.js";
import Point from "./mobjects/Point.js";
import Line from "./mobjects/Line.js";
import Arc from "./mobjects/Arc.js";
import Arrow from "./mobjects/Arrow.js";
import Axis from "./mobjects/Axis.js";
import Axes from "./mobjects/Axes.js";
import VectorField2D from "./mobjects/VectorField2D.js";
import FunctionGraph2D from "./mobjects/FunctionGraph2D.js";

export * as MathFunc from "./math/math_func.js";

export * as OBJLoader from "./extra/OBJLoader.js";

export * as COLORS from "./constants/colors.js";
export * as VECTORS from "./constants/vectors.js";
export * as GLENUM from "./constants/glenum.js";

export {
    // Math
    Color,
    Matrix,
    Vector,
    Quat,

    // Geometries
    Geometry,
    Plane,
    Box,
    Segment,
    Sphere,

    //Lights
    DirectionalLight,
    PointLight,

    // Mobjects
    Graph2D,
    Point,
    Line,
    Arc,
    Arrow,
    Axis,
    Axes,
    VectorField2D,
    FunctionGraph2D,

    // Core
    Layer,
    Camera,
    Texture,

    // Materials
    WebGLRenderer,
    WebGLProgram,
    CustomMaterial,
    BasicMaterial,
    DepthMaterial,
    LambertMaterial,

    // Animation
    Event,
    Timeline,
    Subscriber,
    OrbitControl,
};
