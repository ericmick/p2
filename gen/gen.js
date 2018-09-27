const sqrt5 = Math.sqrt(5);
const phi = (1 + sqrt5) / 2;
const oneOver2Phi = 1 / (2 * phi);
const sqrtOf5PlusSqrt5Over8 = Math.sqrt((5 + sqrt5) / 8);

function mod(dividend, divisor) {
  if (dividend < 0) {
    return (divisor + dividend % divisor) % divisor;
  } else {
    return dividend % divisor;
  }
}

/*
 * vertices are listed clockwise
 * +y is down
 * +x is to the right
 * the "first edge" is between the first and second vertices
 * if the tile is rotated by `firstEdgeAngle` degrees, the inner angle of the first vertex will run clockwise from directly to the right
 * `a` is the inner angle in degrees
 * `c` is the "color" white: 1, black: 0
 */
const dart = {
  name: 'dart',
  vertices: [{
    x: 0, y: 0, a: 216, c: 1 // 0
  }, {
    x: -oneOver2Phi, y: -sqrtOf5PlusSqrt5Over8, a: 36, c: 0 // 1
  }, {
    x: 1, y: 0, a: 72, c: 1 // 2
  }, {
    x: -oneOver2Phi, y: sqrtOf5PlusSqrt5Over8, a: 36, c: 0 // 3
  }],
  firstEdgeAngle: 252,
};

const kite = {
  name: 'kite',
  vertices: [{
    x: 0, y: 0, a: 144, c: 0// 0
  }, {
    x: -oneOver2Phi, y: sqrtOf5PlusSqrt5Over8, a: 72, c: 1 // 1
  }, {
    x: -phi, y: 0, a: 72, c: 0 // 2
  }, {
    x: -oneOver2Phi, y: -sqrtOf5PlusSqrt5Over8, a: 72, c: 1 // 3
  }],
  firstEdgeAngle: 108,
};

const TILES = {kite, dart};

const star = {
  name: "star",
  tileVertices: [
    {
      name: "dart",
      vertexIndex: 2,
    },
    {
      name: "dart",
      vertexIndex: 2,
    },
    {
      name: "dart",
      vertexIndex: 2,
    },
    {
      name: "dart",
      vertexIndex: 2,
    },
    {
      name: "dart",
      vertexIndex: 2,
    },
  ],
};

const ace = {
  name: "ace",
  tileVertices: [
    {
      name: "dart",
      vertexIndex: 0,
    },
    {
      name: "kite",
      vertexIndex: 3,
    },
    {
      name: "kite",
      vertexIndex: 1,
    }
  ],
};

const sun = {
  name: "sun",
  tileVertices: [
    {
      name: "kite",
      vertexIndex: 2,
    },
    {
      name: "kite",
      vertexIndex: 2,
    },
    {
      name: "kite",
      vertexIndex: 2,
    },
    {
      name: "kite",
      vertexIndex: 2,
    },
    {
      name: "kite",
      vertexIndex: 2,
    },
  ],
};

const king = {
  name: "king",
  tileVertices: [
    {
      name: "dart",
      vertexIndex: 2,
    },
    {
      name: "dart",
      vertexIndex: 2,
    },
    {
      name: "kite",
      vertexIndex: 1,
    },
    {
      name: "kite",
      vertexIndex: 3,
    },
    {
      name: "dart",
      vertexIndex: 2,
    },
  ],
};

const jack = {
  name: "jack",
  tileVertices: [
    {
      name: "kite",
      vertexIndex: 0,
    },
    {
      name: "dart",
      vertexIndex: 3,
    },
    {
      name: "kite",
      vertexIndex: 2,
    },
    {
      name: "kite",
      vertexIndex: 2,
    },
    {
      name: "dart",
      vertexIndex: 1,
    },
  ],
};

const queen = {
  name: "queen",
  tileVertices: [
    {
      name: "dart",
      vertexIndex: 2,
    },
    {
      name: "kite",
      vertexIndex: 1,
    },
    {
      name: "kite",
      vertexIndex: 3,
    },
    {
      name: "kite",
      vertexIndex: 1,
    },
    {
      name: "kite",
      vertexIndex: 3,
    },
  ],
};

const deuce = {
  name: "deuce",
  tileVertices: [
    {
      name: "dart",
      vertexIndex: 1,
    },
    {
      name: "kite",
      vertexIndex: 0,
    },
    {
      name: "kite",
      vertexIndex: 0,
    },
    {
      name: "dart",
      vertexIndex: 3,
    },
  ],
};

const FIGURES = {star, ace, sun, king, jack, queen, deuce};

function copyTile(tile) {
  const vertices = [];
  for (const v of tile.vertices) {
    vertices.push({x: v.x, y: v.y, a: v.a, c: v.c});
  }
  return {
    firstEdgeAngle: tile.firstEdgeAngle,
    name: tile.name,
    vertices,
  };
}

function translate(vertices, x, y) {
  for (const v of vertices) {
    v.x += x;
    v.y += y;
  }
}

/*
 * Rotates `vertices` around [`x`, `y`] clockwise by `a` degrees
 */
function rotate(vertices, x, y, a) {
  const r = 2 * Math.PI * a / 360;
  translate(vertices, -x, -y);
  for (const v of vertices) {
    const vx = v.x * Math.cos(r) - v.y * Math.sin(r);
    const vy = v.x * Math.sin(r) + v.y * Math.cos(r);
    v.x = vx;
    v.y = vy;
  }
  translate(vertices, x, y);
}

function generateFigure(vertex, figure) {
  /*
   * edges [{vertices: [{}(2)]}]
   * vertices [{tiles: [(3-5)], x: number, y: number}]
   */
  const edges = [];
  const vertices = [vertex];
  const tiles = [];
  
  const findEdge = function findEdge(v1, v2) {
    for (const e of edges) {
      if ((e[0] === v1 && e[1] === v2) || (e[0] === v2 && e[1] === v1)) {
        return e;
      }
    }
  };
  
  // TODO match existing tiles against figure
  
  // TODO orient to existing tiles
  let angle = 0;
  let previousTile = null;
  
  for (const tileIndex in figure.tileVertices) {
    const tv = figure.tileVertices[tileIndex];
    const tile = copyTile(TILES[tv.name]);
    console.log(figure.tileVertices);
    vertex.tiles.push(tile);
    const figureVertex = tile.vertices[tv.vertexIndex];
    let sumOfOuterAngles = 0;
    for (let i = 1; i <= tv.vertexIndex; i++) {
      sumOfOuterAngles += 180 - tile.vertices[i].a;
    }
    rotate(tile.vertices, figureVertex.x, figureVertex.y, angle - sumOfOuterAngles - tile.firstEdgeAngle);
    translate(tile.vertices, vertex.x - figureVertex.x, vertex.y - figureVertex.y);
    for (let i = 0; i < tile.vertices.length; i++) {
      // TODO join other existing vertices
      if (i === mod(tv.vertexIndex + 1, tile.vertices.length) && tileIndex > 0) {
        console.log('previous tile vertex');
        // joining previous tiles' shared vertices
        tile.vertices[i] = previousTile.vertices[mod(figure.tileVertices[tileIndex - 1].vertexIndex - 1, previousTile.vertices.length)];
        tile.vertices[i].tiles.push(tile);
      } else if (i === mod(tv.vertexIndex - 1, tile.vertices.length) && tileIndex == figure.tileVertices.length - 1) {
        console.log('first/last vertex');
        // joining last tiles' shared vertices with the first tile
        tile.vertices[i] = vertex.tiles[0].vertices[mod(figure.tileVertices[0].vertexIndex + 1, vertex.tiles[0].vertices.length)];
        tile.vertices[i].tiles.push(tile);
      } else if (i === tv.vertexIndex) {
        console.log('figure vertex');
        tile.vertices[i] = vertex;
        tile.vertices[i].c = tile.vertices[i].c;
        tile.vertices[i].tiles.push(tile);
      } else {
        console.log('new vertex');
        tile.vertices[i] = {
          edges: [],
          tiles: [tile],
          x: tile.vertices[i].x,
          y: tile.vertices[i].y,
          c: tile.vertices[i].c,
        };
        vertices.push(tile.vertices[i]);
      }
    }
    for (let i = 0; i < tile.vertices.length; i++) {
      const j = (i + 1) % tile.vertices.length;
      let e = findEdge(tile.vertices[i], tile.vertices[j]);
      if (!e) {
        e = [
          tile.vertices[i],
          tile.vertices[j],
        ];
        edges.push(e);
      }
      tile.vertices[i].edges.push(e);
    }
    angle += figureVertex.a;
    previousTile = tile;
  }
  
  return {
    edges,
    tiles,
    vertices,
  };
}

function generate() {
  const vertex = {
    edges: [],
    tiles: [],
    x: 0,
    y: 0,
  };
  
  const {edges, vertices} = generateFigure(vertex, king);
  console.log({edges, vertices});
  return draw(edges, vertices);
}

const ppi = 72;
const width = 8.5 /*inches*/ * ppi;
const height = 11 /*inches*/ * ppi;
const output = `
 <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}">
  <rect x="0" y="0" width="${width}" height="${height}" stroke-width="2" stroke="pink" fill="none" />
  ${generate()}
 </svg>
`;

function draw(edges, vertices) {
  const scale = 50;
  const offset = {x: width / 2, y: height / 2};
  let output = '';
  for (let i = edges.length - 1; i >= 0; i--) {
    const e = edges[i];
    output += 
      `<line x1="${e[0].x * scale + offset.x}"
             y1="${e[0].y * scale + offset.y}"
             x2="${e[1].x * scale + offset.x}"
             y2="${e[1].y * scale + offset.y}"
             stroke-width="2"
             stroke="#00AAFF" />`;
  }
  for (let i = vertices.length - 1; i >= 0; i--) {
    const v = vertices[i];
    output += 
      `<circle cx = "${v.x * scale + offset.x}"
               cy = "${v.y * scale + offset.y}"
               r = "3"
               fill = "${v.c ? 'white' : 'black'}"
               stroke-width="1"
               stroke="black" />`;
  }
  return output;
}

function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16))
  }))
}

const $download = document.getElementById('download');
const $preview = document.getElementById('preview');
const declaration = `<?xml version="1.0" encoding="UTF-8" ?>`;
let dataUri = `data:image/svg+xml;base64,${b64EncodeUnicode(declaration+output)}`;
$download.href = dataUri;
$preview.innerHTML = output;