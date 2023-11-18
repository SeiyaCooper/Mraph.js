// TODO
const commands = {
    v: (data, out) => {
        out.position.push(...data.map((str) => +str));
    },
    vt: (data, out) => {
        out.uv.push(...data.map((str) => +str));
    },
    vn: (data, out) => {
        out.normal.push(...data.map((str) => +str));
    },
    f: (data, out) => {
        data = data.map((index) => +index.split("/")[0]);

        for (let n = 0; n < data.length - 2; n++) {
            out.index.push(data[n] - 1, data[n + 1] - 1, data[n + 2] - 1);
        }
    },
};

export async function parseToObject(src) {
    const out = { position: [], normal: [], uv: [], index: [] };
    const text = await readFile(src);
    const reg = /(\w*)(?: )*(.*)/;

    for (let line of text.split("\n")) {
        if (line.startsWith("#") || line === "") continue;

        const [, command, data] = reg.exec(line);
        const handler = commands[command];

        if (!handler) continue;

        handler(data.split(" "), out);
    }

    return out;
}

async function readFile(src) {
    return (await fetch(src)).text();
}
