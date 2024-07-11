import Layer from "./core/Layer.js";
import Camera from "./core/Camera.js";
import Texture from "./core/Texture.js";

import Event from "./animation/Event.js";
import Timeline from "./animation/Timeline.js";

import OrbitControl from "./extra/OrbitControl.js";
import Recorder from "./extra/Recorder.js";

import WebGLRenderer from "./core/WebGL/WebGLRenderer.js";
import WebGLProgram from "./core/WebGL/WebGLProgram.js";

export * as SlotParser from "./material/SlotParser.js";
import CustomMaterial from "./material/CustomMaterial.js";
import BasicMaterial from "./material/BasicMaterial.js";
import DepthMaterial from "./material/DepthMaterial.js";
import LambertMaterial from "./material/LambertMaterial.js";
import Mobject2DMaterial from "./material/Mobject2DMaterial.js";

import Color from "./math/Color.js";
import Matrix from "./math/Matrix.js";
import Vector from "./math/Vector.js";
import Quat from "./math/Quat.js";
import Complex from "./math/Complex.js";

import Geometry from "./geometry/Geometry.js";
import Plane from "./geometry/Plane.js";
import Box from "./geometry/Box.js";
import Segment from "./geometry/Segment.js";
import Sphere from "./geometry/Sphere.js";
import Cylinder from "./geometry/Cylinder.js";

import DirectionalLight from "./light/DirectionalLight.js";
import PointLight from "./light/PointLight.js";

import Mobject2D from "./mobjects/2D/Mobject2D.js";
import Point from "./mobjects/2D/Point.js";
import Tail from "./mobjects/2D/Tail.js";
import Line from "./mobjects/2D/Line.js";
import Polygon from "./mobjects/2D/Polygon.js";
import RegularPolygon from "./mobjects/2D/RegularPolygon.js";
import Square from "./mobjects/2D/Square.js";
import Arc from "./mobjects/2D/Arc.js";
import Arrow from "./mobjects/2D/Arrow.js";
import Axis from "./mobjects/2D/Axis.js";
import Axes2D from "./mobjects/2D/Axes2D.js";
import VectorField2D from "./mobjects/2D/VectorField2D.js";
import FunctionGraph2D from "./mobjects/2D/FunctionGraph2D.js";

import Mobject3D from "./mobjects/3D/Mobject3D.js";
import FunctionGraph3D from "./mobjects/3D/FunctionGraph3D.js";
import Point3D from "./mobjects/3D/Point3D.js";
import Arrow3D from "./mobjects/3D/Arrow3D.js";
import VectorField3D from "./mobjects/3D/VectorField3D.js";

import Mobject from "./mobjects/Mobject.js";
import ImageMobject from "./mobjects/ImageMobject.js";
import CanvasText from "./mobjects/CanvasText.js";

export * as MathFunc from "./math/math_func.js";

export * as OBJLoader from "./extra/OBJLoader.js";

export * as COLORS from "./constants/colors.js";
export * as VECTORS from "./constants/vectors.js";
export * as GLENUM from "./constants/glenum.js";
export * as DrawModes from "./constants/draw_modes.js";

export {
    // Math
    Color,
    Matrix,
    Vector,
    Quat,
    Complex,

    // Geometries
    Geometry,
    Plane,
    Box,
    Segment,
    Sphere,
    Cylinder,

    // Lights
    DirectionalLight,
    PointLight,

    // Mobjects
    Mobject,
    ImageMobject,
    CanvasText,

    // Mobjects - 2D
    Mobject2D,
    Point,
    Tail,
    Line,
    Polygon,
    RegularPolygon,
    Square,
    Arc,
    Arrow,
    Axis,
    Axes2D,
    VectorField2D,
    FunctionGraph2D,

    // Mobjects - 3D
    Mobject3D,
    FunctionGraph3D,
    Point3D,
    Arrow3D,
    VectorField3D,

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
    Mobject2DMaterial,

    // Animation
    Event,
    Timeline,

    // Extra
    OrbitControl,
    Recorder,
};
