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
 * `a` is the inner angle in degrees
 * `c` is the "color" white: 1, black: 0
 * the "first edge" is between the first and second vertices
 * if the tile is rotated by `firstEdgeAngle` degrees, the inner angle of the first vertex will run clockwise from directly to the right
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

function instanceTile(tile) {
  const vertices = [];
  for (const v of tile.vertices) {
    vertices.push({x: v.x, y: v.y, a: v.a, c: v.c});
  }
  return {
    firstEdgeAngle: tile.firstEdgeAngle,
    name: tile.name,
    vertices,
    x: 0, // x translation,
    y: 0, // y translation,
    a: 0, // and angle, relative to the prototype
  };
}

function translate(tile, x, y) {
  const {vertices} = tile;
  tile.x += x;
  tile.y += y;
  for (const v of vertices) {
    v.x += x;
    v.y += y;
  }
}

/*
 * Rotates `vertices` around [`x`, `y`] clockwise by `a` degrees
 */
function rotate(tile, x, y, a) {
  const {vertices} = tile;
  const r = 2 * Math.PI * a / 360;
  translate(tile, -x, -y);
  for (const v of vertices) {
    const vx = v.x * Math.cos(r) - v.y * Math.sin(r);
    const vy = v.x * Math.sin(r) + v.y * Math.cos(r);
    v.x = vx;
    v.y = vy;
  }
  translate(tile, x, y);
  tile.a = mod(tile.a + a, 360);
}

/* The value of an angle may be subject to increasing inaccuracy at large distances from the origin of the tessellation's construction, due to compounding imprecision.
 * Therefore, the difference is required to be less than 1 degree, which should support very large tessellations, but not infinite.
 */
function closeEnough(a, b) {
  const difference = mod(b - a, 360);
  return difference < 1 || difference > 359;
}

function matchFigure(plane, vertex, figure, angle) {
  for (const tile of vertex.tiles) {
    let isMatch = false;
    for (let tileIndex = 0; tileIndex < figure.tiles.length; tileIndex++) {
      const figureTile = figure.tiles[tileIndex]
      const expectedAngle = mod(figureTile.a + angle, 360);
      isMatch = tile.name === figureTile.name
        && closeEnough(expectedAngle, tile.a)
        && tile.vertices[figure.tileVertices[tileIndex].vertexIndex] === vertex;
      if (isMatch) break;
    }
    // Any detection of a unmatched tile means the figure/angle is not a match
    if (!isMatch) return false;
  }
  // Failing to find any unmatch tiles means the vertex may turn out to be the given figure with the given angle
  return true;
}

/*
 * Returns [{figure, angle}]
 * A zero-length array indicates degeneracy of the tessellation
 */
function identifyPossibleFigures(plane, vertex) {
  const results = [];
  
  // Iterate over figures
  for (const figure of Object.values(FIGURES)) {
    // Iterate over existing tiles (are they in any particular order?)
    for (const tile of vertex.tiles) {
      // Try to match the existing tile to a figure tile
      for (const figureTile of figure.tiles) {
        // Must be same type of tile
        if (tile.name === figureTile.name) {
          // How much do we rotate the figure to match the orientation of the existing tile?
          const angle = mod(tile.a - figureTile.a, 360);
          // Make sure this figure/angle isn't already confirmed
          if (!results.find((result) => {
            return result.figure.name === figure.name && closeEnough(result.angle, angle);
          })) {
            // Now, all existing tiles must each match a figure tile at this angle
            if (matchFigure(plane, vertex, figure, angle)) {
              results.push({figure, angle});
            }
          }
        }
      }
    }
  }
  
  return results;
}

findEdge = function findEdge(plane, v1, v2) {
  for (const e of plane.edges) {
    if ((e[0] === v1 && e[1] === v2) || (e[0] === v2 && e[1] === v1)) {
      return e;
    }
  }
};

function generateFigure(plane, vertex, figure, angle = 0) {
  /* plane: {
   *   edges: [{vertices: [{}(2)]}]
   *   tiles: [{vertices: [{}(4)]}]
   *   vertices: [{tiles: [(1-5)], x: number, y: number}]
   * }
   */
  const {edges, tiles, vertices} = plane;
  
  // TODO match existing tiles against figure
  
  let previousTile = null;
  
  for (const tileIndex in figure.tileVertices) {
    const tv = figure.tileVertices[tileIndex];
    
    // Determine tile position
    let sumOfOuterAngles = 0;
    for (let i = 1; i <= tv.vertexIndex; i++) {
      sumOfOuterAngles += 180 - TILES[tv.name].vertices[i].a;
    }
    const tileAngle = mod(angle - sumOfOuterAngles - TILES[tv.name].firstEdgeAngle, 360);
    
    let tile = null;
    let figureVertex = null
    
    // Find existing tile
    for (const vertexTile of vertex.tiles) {
      if (vertexTile.name === tv.name
          && closeEnough(vertexTile.a, tileAngle)
          && vertexTile.vertices[tv.vertexIndex] === vertex) {
        tile = vertexTile;
        figureVertex = tile.vertices[tv.vertexIndex];
        break;
      }
    }
    
    if (!tile) {
      // New tile
      tile = instanceTile(TILES[tv.name]);
      vertex.tiles.push(tile);
      tiles.push(tile);
      
      // Move tile into position
      figureVertex = tile.vertices[tv.vertexIndex];
      rotate(tile, figureVertex.x, figureVertex.y, tileAngle);
      translate(tile, vertex.x - figureVertex.x, vertex.y - figureVertex.y);
    
      // Merge tile's vertices with existing vertices
      for (let i = 0; i < tile.vertices.length; i++) {
        /*if (i === mod(tv.vertexIndex + 1, tile.vertices.length) && tileIndex > 0) {
          // Previous tiles' shared vertex
          tile.vertices[i] = previousTile.vertices[mod(figure.tileVertices[tileIndex - 1].vertexIndex - 1, previousTile.vertices.length)];
          tile.vertices[i].tiles.push(tile);
        } else if (i === mod(tv.vertexIndex - 1, tile.vertices.length) && tileIndex == figure.tileVertices.length - 1) {
          // Last tiles' vertex shared with the first tile
          tile.vertices[i] = vertex.tiles[0].vertices[mod(figure.tileVertices[0].vertexIndex + 1, vertex.tiles[0].vertices.length)];
          tile.vertices[i].tiles.push(tile);
        } else if (i === tv.vertexIndex) {
          // The figure vertex
          const c = tile.vertices[i].c;
          tile.vertices[i] = vertex;
          tile.vertices[i].c = c;
          tile.vertices[i].tiles.push(tile);
        } else {*/
          // join other existing vertices
          const v = plane.vertices.find((v) => {
            // No vertices should be closer to each other than 1
            return Math.abs(v.x - tile.vertices[i].x) < 0.1
              && Math.abs(v.y - tile.vertices[i].y) < 0.1;
          });
          if (v) {
            tile.vertices[i] = v;
            v.tiles.push(tile);
          } else {
            // New vertex
            tile.vertices[i] = {
              ...tile.vertices[i],
              edges: [],
              tiles: [tile],
            };
            vertices.push(tile.vertices[i]);
          }
        /*}*/
      }
      
      // Add any new edges
      for (let i = 0; i < tile.vertices.length; i++) {
        const j = (i + 1) % tile.vertices.length;
        let e = findEdge(plane, tile.vertices[i], tile.vertices[j]);
        if (!e) {
          e = [
            tile.vertices[i],
            tile.vertices[j],
          ];
          edges.push(e);
          tile.vertices[i].edges.push(e);
        }
      }
    }
    
    // Continue clockwise
    angle = mod(angle + TILES[tv.name].vertices[tv.vertexIndex].a, 360);
    previousTile = tile;
  }
  
  return {
    edges,
    tiles,
    vertices,
  };
}

function generateFigures() {
  for (const figure of Object.values(FIGURES)) {
    const vertex = {
      edges: [],
      tiles: [],
      x: 0,
      y: 0,
    };

    let plane = {
      edges: [],
      tiles: [],
      vertices: [vertex],
    };
    
    const {edges, tiles, vertices} = generateFigure(plane, vertex, figure);
    
    Object.assign(figure, {edges, tiles, vertices});
  }
  console.log(FIGURES);
}

generateFigures();

function generate() {
  const vertex = {
    edges: [],
    tiles: [],
    x: 0,
    y: 0,
    c: 1,
  };

  let plane = {
    edges: [],
    tiles: [],
    vertices: [vertex],
  };
  
  plane = generateFigure(plane, vertex, queen);
  for (let i = 1; i < 43; i++) {
    const possibleFigures = identifyPossibleFigures(plane, plane.vertices[i]);
    console.log({possibleFigures});
    if (possibleFigures.length < 1) {
      break;
    }
    plane = generateFigure(plane, plane.vertices[i], possibleFigures[0].figure, possibleFigures[0].angle);
  }
  console.log(plane);
  const {edges, vertices} = plane;
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
             stroke-width="3"
             stroke="#00AAFF66" />`;
  }
  for (let i = vertices.length - 1; i >= 0; i--) {
    const v = vertices[i];
    output += 
      `<circle cx = "${v.x * scale + offset.x}"
               cy = "${v.y * scale + offset.y}"
               r = "4"
               fill = "${v.c ? '#FF000066' : '#00FF0066'}"
               stroke-width="2"
               stroke="#00000066" />`;
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