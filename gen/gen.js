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
 * Handles cloning deep, plain objects and arrays with circular references
 * We need this for cloning plains as vertices have a circular relationship with both edges and tiles [e<->v<->t] in a plane.
 */
function clone(input, map = new WeakMap()) {
  const innerClone = (obj) => {
    // Do not try to clone primitives or functions
    if (Object(obj) !== obj || obj instanceof Function) {
      return obj;
    }
    if (map.has(obj)) {
      // Cyclic reference
      return map.get(obj);
    }
    // Works for plain objects and arrays, but not other other types of javascript objects
    var result = new obj.constructor();
    map.set(obj, result);
    for (let key in obj) {
      result[key] = innerClone(obj[key], map);
    }
    return result;
  };
  return {result: innerClone(input), map};
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

const leftDart = {
  name: 'leftDart',
  vertices: [{
    x: 0, y: 0, a: 180, c: 1, t: true // 0
  }, {
    x: -oneOver2Phi, y: -sqrtOf5PlusSqrt5Over8, a: 36, c: 0 // 1
  }, {
    x: 1, y: 0, a: 72, c: 1 // 2
  }, {
    x: ((sqrt5-1)/4)/phi, y: sqrtOf5PlusSqrt5Over8/phi, a: 72, c: 0, t: true // 3
  }],
  firstEdgeAngle: 252,
};

const rightDart = {
  name: 'rightDart',
  vertices: [{
    x: 0, y: 0, a: 180, c: 1, t: true // 0
  }, {
    x: ((sqrt5-1)/4)/phi, y: -sqrtOf5PlusSqrt5Over8/phi, a: 72, c: 0, t: true // 1
  }, {
    x: 1, y: 0, a: 72, c: 1, // 2
  }, {
    x: -oneOver2Phi, y: sqrtOf5PlusSqrt5Over8, a: 36, c: 0 // 3
  }],
  firstEdgeAngle: 288,
};

const TILES = {kite, dart, leftDart, rightDart};
const TRUNCATED_TILES = {leftDart, rightDart};

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

const truncatedJack = {
  name: "truncatedJack",
  tileVertices: [
    {
      name: "kite",
      vertexIndex: 0,
    },
    {
      name: "rightDart",
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
      name: "leftDart",
      vertexIndex: 1,
    },
  ],
};

const truncatedDeuce = {
  name: 'truncatedDeuce',
  tileVertices: [
    {
      name: "leftDart",
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
      name: "rightDart",
      vertexIndex: 3,
    },
  ],
};

const TRUNCATED_FIGURES = {truncatedJack, truncatedDeuce};

function getTokenFigure(figure) {
  if (figure.name === 'jack') {
    return truncatedJack;
  } else if (figure.name === 'deuce') {
    return truncatedDeuce;
  } else {
    return figure;
  }
}

function instanceTile(tile) {
  const vertices = [];
  for (const v of tile.vertices) {
    vertices.push({x: v.x, y: v.y, a: v.a, c: v.c, t: v.t});
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

function closeEnough(a, b) {
  const difference = mod(b - a, 360);
  return difference === 0;
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
 * Returns [{angle, figure}]
 * Only checks how tiles fit at the given vertex
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

/*
 * Returns [{angle, figure, plane}]
 * Checks all vertices for degeneracy
 * A zero-length array indicates degeneracy of the tessellation
 */
function tryFigures(plane, vertex, possibleFigures) {
  possibleFigures = possibleFigures || identifyPossibleFigures(plane, vertex);
  const successfulFigures = [];
  let lastFailure = null;
  for (let f of possibleFigures) {
    let {result: p, map} = clone(plane);
    generateFigure(p, map.get(vertex), f.figure, f.angle);
    if (!p.vertices.find((v) => identifyPossibleFigures(p, v).length < 1)) {
      // Generate figures at any vertices which are forced to be one particular figure/angle
      let forcedVertex;
      if (forcedVertex = p.vertices.find((v) => !v.figure && identifyPossibleFigures(p, v).length === 1)) {
        // This is recursive and must succeed (not degenerate) in order for this figure to be accepted
        const result = tryFigures(p, forcedVertex);
        if (result.length === 1) {
          // There should be exactly one result
          p = result[0].plane;
          successfulFigures.push(Object.assign(f, {plane: p}));
        };
      } else {
        successfulFigures.push(Object.assign(f, {plane: p}));
      }
    } else {
      lastFailure = {vertex: p.vertices.find((v) => identifyPossibleFigures(p, v).length < 1), plane: p};
      console.log('degeneracy detected', lastFailure);
    }
  }
  return successfulFigures;
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
   *   edges: [{vertices: [{}(2)]}],
   *   tiles: [{vertices: [{}(4)], ...}],
   *   vertices: [{edges: [(1-5)], tiles: [(1-5)], x: number, y: number, ...}]
   * }
   */
  const {edges, tiles, vertices} = plane;
  
  vertex.figure = figure;
  vertex.a = angle;
  
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
  for (const figure of Object.values(FIGURES).concat(Object.values(TRUNCATED_FIGURES))) {
    let plane = newPlane();
    
    const {edges, tiles, vertices} = generateFigure(plane, plane.vertices[0], figure);
    
    Object.assign(figure, {edges, tiles, vertices});
  }
  console.log({FIGURES, TRUNCATED_FIGURES});
}

generateFigures();

function newPlane() {
  const startingVertex = {
    edges: [],
    tiles: [],
    x: 0,
    y: 0,
    c: 1,
  };

  let plane = {
    edges: [],
    tiles: [],
    vertices: [startingVertex],
  };
  
  return plane;
};

function generate(firstFigureName) {
  let plane = newPlane();
  
  plane = generateFigure(plane, plane.vertices[0], FIGURES[firstFigureName]);
  for (let i = 1; i < vertexLimit && i < plane.vertices.length; i++) {
    const vertex = plane.vertices[i];
    // If the vertex is out of bounds, skip it
    if (vertex.x * scale > width / 2 || vertex.x * scale < -width / 2 || vertex.y * scale > height / 2 || vertex.y * scale < -height / 2) {
      continue;
    }
    const possibleFigures = identifyPossibleFigures(plane, vertex);
    const successfulFigures = tryFigures(plane, vertex, possibleFigures);
    if (successfulFigures.length === 0) {
      // Failed to find any figure 
      console.log(`failed at vertex ${i}`);
    } else {
      // Just go with the first figure that works.
      plane = successfulFigures[0].plane;
      postMessage({svg: print(drawPlane(plane, scale, {x: width / 2, y: height / 2})), done: false});
    }
  }
  console.log(plane);
  return plane;
}

// Settings
const ppi = 72;
const width = 11 /*inches*/ * ppi;
const height = 11 /*inches*/ * ppi;
const scale = 72; // pixels per dart-width
const tokenScale = 1/(2*phi);
const vertexLimit = 1000;

function isInBounds(x, y) {
  return x >= 0 && x <= width && y >= 0 && y <= height;
};

function drawToken({edges, vertices}, scale, center) {
  let output = '';
  // We skip the central figure vertex in order to draw the perimeter edges only
  let firstVertex = vertices[1];
  let previousVertex = null;
  let vertex = firstVertex;
  
  output += `<path d="M ${vertex.x * scale + center.x} ${vertex.y * scale + center.y} `;
  
  do {
    let edge = vertex.edges.find((e) => {
      return e[0] !== vertices[0] 
             && e[1] !== vertices[0]
             && e[0] !== previousVertex
             && e[1] !== previousVertex
    });
    
    previousVertex = vertex;
    vertex = edge[0] === vertex ? edge[1] : edge[0];
    
    output += `L ${vertex.x * scale + center.x} ${vertex.y * scale + center.y} `;
  } while (vertex !== firstVertex);
  
  output += 'Z" fill="transparent" stroke="#000000FF" stroke-width="2" />';
  
  // Edges of the central vertex
  /*
  if (edges) {
    output += '<path d="';
    for (let i = edges.length - 1; i >= 0; i--) {
      const e = edges[i];
      if (e[0] === vertices[0] || e[1] === vertices[0]) {
        
        let x1 = e[0].x * scale + center.x;
        let y1 = e[0].y * scale + center.y;
        let x2 = e[1].x * scale + center.x;
        let y2 = e[1].y * scale + center.y;
        
        if (isInBounds(x1, y1) && isInBounds(x2, y2)) {
          output += `M ${x1} ${y1} L ${x2} ${y2} `;
        }
      }
    }
    output += '" stroke-width="2" stroke="#000000FF" />';
  }
  */
  return output;
}

function drawPlane({edges, vertices, tiles}, scale, center) {
  let output = '';
  if (edges) {
    output += '<path d="';
    for (let i = edges.length - 1; i >= 0; i--) {
      const e = edges[i];
      
      // We reduce the length of these lines to make room for figure-tokens at the vertices
      let x1 = e[0].x * scale + center.x;
      let y1 = e[0].y * scale + center.y;
      let x2 = e[1].x * scale + center.x;
      let y2 = e[1].y * scale + center.y;
      
      edgeCenter = {x: (x2 + x1) / 2, y: (y2 + y1) / 2};
      
      x1 = x1 + (edgeCenter.x - x1) * tokenScale * 2;
      y1 = y1 + (edgeCenter.y - y1) * tokenScale * 2;
      x2 = x2 + (edgeCenter.x - x2) * tokenScale * 2;
      y2 = y2 + (edgeCenter.y - y2) * tokenScale * 2;
      
      if (isInBounds(x1, y1) && isInBounds(x2, y2)) {
        output += `M ${x1} ${y1} L ${x2} ${y2} `;
      }
    }
    output += '" stroke-width="2" stroke="#000000FF" />';
  }

  if (vertices) {
    for (let i = vertices.length - 1; i >= 0; i--) {
      const v = vertices[i];
      if (isInBounds(v.x * scale + center.x, v.y * scale + center.y)) {
          if (v.figure) {
            let p = newPlane();
            let tokenFigure = getTokenFigure(v.figure);
            p = generateFigure(p, p.vertices[0], tokenFigure, v.a);
            output += drawToken(p, scale * tokenScale, {x: v.x * scale + center.x, y: v.y * scale + center.y});
          } else {
            const color = v.c ? '#FFFFFFFF' : '#000000FF';
            output += 
              `<circle cx = "${v.x * scale + center.x}"
                       cy = "${v.y * scale + center.y}"
                       r = "15"
                       fill = "${color}"
                       stroke-width="2"
                       stroke="#00000066">
                <title>${i}</title>
              </circle>`;
          }
        }
    }
  }
  
  if (tiles) {
    for (let i = tiles.length - 1; i >= 0; i--) {
      output += '<path d="';
      const t = tiles[i];
      
      // Find center (average of vertices)
      const tileCenter = {x: 0, y: 0};
      for (let j = t.vertices.length - 1; j >= 0; j--) {
        tileCenter.x += t.vertices[j].x;
        tileCenter.y += t.vertices[j].y;
      }
      tileCenter.x /= t.vertices.length;
      tileCenter.y /= t.vertices.length;
      
      // Shrink towards center a bit (0.1) so that edges are clearly marked
      for (let j = 0; j < t.vertices.length; j++) {
        const v = t.vertices[j];
        // Make vector towards center
        let x = tileCenter.x - v.x;
        let y = tileCenter.y - v.y;
        // Normalize to (0.1)
        let magnitude = Math.sqrt(x*x + y*y);
        x /= (magnitude * 10);
        y /= (magnitude * 10);
        // Add vector to vertex
        x += v.x;
        y += v.y;
        x *= scale;
        y *= scale;
        x += center.x;
        y += center.y;
        output += `${j === 0 ? 'M' : 'L'} ${x} ${y} `;
      }
      output += `Z" stroke-width="2" stroke="${t.name === 'kite' ? '#00FF00' : '#FF0000'}" fill="transparent"/>`;
    }
  }
  
  return output;
}

function print(svgContent) {
  const output = `
   <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}">
    ${svgContent}
   </svg>
  `;
  return output;
}

onmessage = (e) => {
  const plane = generate(e.data);
  postMessage({svg: print(drawPlane(plane, scale, {x: width / 2, y: height / 2})), done: true});
};