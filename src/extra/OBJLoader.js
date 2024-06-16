import Geometry from "../geometry/Geometry.js";

let sourceData, parsedData;

let configs = {
    parseGroup: true,
};

let parsingGroup = false;

function addVertex(data, i) {
    parsedData.position.push(...sourceData.position[data[i][0]]);
    parsedData.uv.push(...sourceData.uv[data[i][1]]);
    parsedData.normal.push(...sourceData.normal[data[i][2]]);
}

const commands = {
    v: (data) => {
        sourceData.position.push(data.map(parseFloat));
    },
    vt: (data) => {
        sourceData.uv.push(data.map(parseFloat));
    },
    vn: (data) => {
        sourceData.normal.push(data.map(parseFloat));
    },
    f: (data) => {
        data = data.map((index) => index.split("/").map((val) => +val));

        for (let i = 2; i < data.length; i++) {
            addVertex(data, 0);
            addVertex(data, i - 1);
            addVertex(data, i);
        }
    },
    g: (name, geometry) => {
        if (!configs.parseGroup) return;

        if (parsingGroup) {
            const group = new Geometry();
            group.setAttribute("position", parsedData.position, 3);
            group.setAttribute("normal", parsedData.normal, 3);
            group.setAttribute("uv", parsedData.uv, 2);
            group.setIndex(parsedData.position.length / 3);
            group.name = parsedData.name;

            parsedData = { position: [], normal: [], uv: [], name: "" };
            geometry.add(group);
        } else {
            parsingGroup = true;
        }

        parsedData.name = name;
    },
};

export async function parseToGeometry(src, { parseGroup = true } = {}) {
    const geometry = new Geometry();
    const text = await readFile(src);
    const reg = /(\w*)(?: )*(.*)/;

    sourceData = { normal: [[]], uv: [[]], position: [[]] };
    parsedData = { position: [], normal: [], uv: [], name: "" };
    configs.parseGroup = parseGroup;

    for (let line of text.split("\n")) {
        if (line.startsWith("#") || line === "") continue;

        const [, command, data] = reg.exec(line);
        const handler = commands[command];

        if (!handler) continue;

        if (command === "g") {
            handler(data.split(" ")[0], geometry);
        } else {
            handler(data.split(" "));
        }
    }

    if (!configs.parseGroup || !parsingGroup) {
        geometry.setAttribute("position", parsedData.position, 3);
        geometry.setAttribute("normal", parsedData.normal, 3);
        geometry.setAttribute("uv", parsedData.uv, 2);
        geometry.setIndex(parsedData.position.length / 3);
    } else {
        const group = new Geometry();
        group.setAttribute("position", parsedData.position, 3);
        group.setAttribute("normal", parsedData.normal, 3);
        group.setAttribute("uv", parsedData.uv, 2);
        group.setIndex(parsedData.position.length / 3);
        group.name = parsedData.name;
        geometry.add(group);
    }

    return geometry;
}

async function readFile(src) {
    return (await fetch(src)).text();
}
