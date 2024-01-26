import Geometry from "../geometry/Geometry.js";

let oriData, parsedData;

function addVertex(data, i) {
    parsedData.position.push(...oriData.position[data[i][0]]);
    parsedData.uv.push(...oriData.uv[data[i][1]]);
    parsedData.normal.push(...oriData.normal[data[i][2]]);
}

const commands = {
    v: (data) => {
        oriData.position.push(data.map(parseFloat));
    },
    vt: (data) => {
        oriData.uv.push(data.map(parseFloat));
    },
    vn: (data) => {
        oriData.normal.push(data.map(parseFloat));
    },
    f: (data) => {
        data = data.map((index) => index.split("/").map((val) => +val));

        for (let i = 2; i < data.length; i++) {
            addVertex(data, 0);
            addVertex(data, i - 1);
            addVertex(data, i);
        }
    },
};

export async function parseToGeometry(src) {
    const data = await parseToObject(src);
    const out = new Geometry();

    out.setAttribute("position", data.position, 3);
    out.setAttribute("normal", data.normal, 3);
    out.setAttribute("uv", data.uv, 2);
    out.setIndex(data.position.length / 3);

    return out;
}

export async function parseToObject(src) {
    const text = await readFile(src);
    const reg = /(\w*)(?: )*(.*)/;
    oriData = { normal: [[]], uv: [[]], position: [[]] };
    parsedData = { position: [], normal: [], uv: [] };

    for (let line of text.split("\n")) {
        if (line.startsWith("#") || line === "") continue;

        const [, command, data] = reg.exec(line);
        const handler = commands[command];

        if (!handler) continue;

        handler(data.split(" "));
    }

    return parsedData;
}

async function readFile(src) {
    return (await fetch(src)).text();
}
