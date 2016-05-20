/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJExporter = function () {};

THREE.OBJExporter.prototype = {

	constructor: THREE.OBJExporter,

	parse: function ( object ) {

		var output = '';

		var indexVertex = 0;
		var indexVertexUvs = 0;
		var indexNormals = 0;

		var vertex = new THREE.Vector3();
		var normal = new THREE.Vector3();
		var uv = new THREE.Vector2();

		var i, j, l, m, face = [];

		var parseMesh = function ( mesh ) {

			var nbVertex = 0;
			var nbNormals = 0;
			var nbVertexUvs = 0;

			var geometry = mesh.geometry;

			var normalMatrixWorld = new THREE.Matrix3();

			if ( geometry instanceof THREE.Geometry ) {

				geometry = new THREE.BufferGeometry().setFromObject( mesh );

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );
				var normals = geometry.getAttribute( 'normal' );
				var uvs = geometry.getAttribute( 'uv' );
				var indices = geometry.getIndex();

				// name of the mesh object
				output += 'o ' + mesh.name + '\n';

				// vertices

				if( vertices !== undefined ) {

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex++ ) {

						vertex.x = vertices.getX( i );
						vertex.y = vertices.getY( i );
						vertex.z = vertices.getZ( i );

						// transfrom the vertex to world space
						vertex.applyMatrix4( mesh.matrixWorld );

						// transform the vertex to export format
						output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

					}

				}

				// uvs

				if( uvs !== undefined ) {

					for ( i = 0, l = uvs.count; i < l; i ++, nbVertexUvs++ ) {

						uv.x = uvs.getX( i );
						uv.y = uvs.getY( i );

						// transform the uv to export format
						output += 'vt ' + uv.x + ' ' + uv.y + '\n';

					}

				}

				// normals

				if( normals !== undefined ) {

					normalMatrixWorld.getNormalMatrix( mesh.matrixWorld );

					for ( i = 0, l = normals.count; i < l; i ++, nbNormals++ ) {

						normal.x = normals.getX( i );
						normal.y = normals.getY( i );
						normal.z = normals.getZ( i );

						// transfrom the normal to world space
						normal.applyMatrix3( normalMatrixWorld );

						// transform the normal to export format
						output += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';

					}

				}

				// faces

				if( indices !== null ) {

					for ( i = 0, l = indices.count; i < l; i += 3 ) {

						for( m = 0; m < 3; m ++ ){

							j = indices.getX( i + m ) + 1;

							face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );

						}

						// transform the face to export format
						output += 'f ' + face.join( ' ' ) + "\n";

					}

				} else {

					for ( i = 0, l = vertices.count; i < l; i += 3 ) {

						for( m = 0; m < 3; m ++ ){

							j = i + m + 1;

							face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );

						}

						// transform the face to export format
						output += 'f ' + face.join( ' ' ) + "\n";

					}

				}

			} else {

				console.warn( 'THREE.OBJExporter.parseMesh(): geometry type unsupported', geometry );

			}

			// update index
			indexVertex += nbVertex;
			indexVertexUvs += nbVertexUvs;
			indexNormals += nbNormals;

		};

		var parseLine = function( line ) {

			var nbVertex = 0;

			var geometry = line.geometry;
			var type = line.type;

			if ( geometry instanceof THREE.Geometry ) {

				geometry = new THREE.BufferGeometry().setFromObject( line );

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );
				var indices = geometry.getIndex();

				// name of the line object
				output += 'o ' + line.name + '\n';

				if( vertices !== undefined ) {

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex++ ) {

						vertex.x = vertices.getX( i );
						vertex.y = vertices.getY( i );
						vertex.z = vertices.getZ( i );

						// transfrom the vertex to world space
						vertex.applyMatrix4( line.matrixWorld );

						// transform the vertex to export format
						output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

					}

				}

				if ( type === 'Line' ) {

					output += 'l ';

					for ( j = 1, l = vertices.count; j <= l; j++ ) {

						output += ( indexVertex + j ) + ' ';

					}

					output += '\n';

				}

				if ( type === 'LineSegments' ) {

					for ( j = 1, k = j + 1, l = vertices.count; j < l; j += 2, k = j + 1 ) {

						output += 'l ' + ( indexVertex + j ) + ' ' + ( indexVertex + k ) + '\n';

					}

				}

			} else {

				console.warn('THREE.OBJExporter.parseLine(): geometry type unsupported', geometry );

			}

			// update index
			indexVertex += nbVertex;

		};

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				parseMesh( child );

			}

			if ( child instanceof THREE.Line ) {

				parseLine( child );

			}

		} );

		return output;

	}

};

(()=>{
    let camera, scene, renderer;

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = -1;
    camera.position.y = 3;
    camera.position.x = -2;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();
  
    let pointLight = new THREE.PointLight( 0x9999ff, 10, 300);
		pointLight.position.set( -10, 5, 100 );
		scene.add( pointLight );
    
    let light = new THREE.AmbientLight( 0x212111 ); // soft white light
		scene.add( light );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  
    let exporter = new THREE.OBJExporter();

    var sqrt5 = Math.sqrt(5);
    var phi = (1 + sqrt5) / 2;
    var x = -1 / (2 * phi);
    var y = Math.sqrt((5 + sqrt5) / 8);
  
    let extrude = (geometry, z) => {
      let vertices = geometry.vertices.slice(0);
      let l = vertices.length;
      for (let v of vertices) {
        geometry.vertices.push(new THREE.Vector3(v.x, v.y, z));
      }
      let faces = geometry.faces.slice(0);
      for (let i in faces) {
        let f = faces[i];
        geometry.faces.push(new THREE.Face3(
          f.c + l, 
          f.b + l,
          f.a + l));
        geometry.faceVertexUvs[0].push([
          geometry.faceVertexUvs[0][i][2],
          geometry.faceVertexUvs[0][i][1],
          geometry.faceVertexUvs[0][i][0]]);
      }
      //side faces
      for (let i = 0; i < vertices.length; i++) {
        let a = i;
        let b = i + l;
        let c = (i + 1) % l;
        let d = c + l;
        geometry.faces.push(new THREE.Face3(a, b, c));
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, 0)]);
        geometry.faces.push(new THREE.Face3(c, b, d));
        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0, 0)]);
      }
    };
  
    let getTexture = (textureResolution, name, render) => {
      var canvas = document.createElement('canvas');
      var width = canvas.width = textureResolution;
      var height = canvas.height = textureResolution;
      document.body.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      
      render(ctx, width, height); 
      
      var link = document.createElement('a');
      link.href = canvas.toDataURL().replace(/^data:image\/png;/, 'data:application/octet-stream;');
      link.download = name + '.png';
      link.innerHTML = name;
      document.getElementById('downloads').appendChild(link);
      var imageData = ctx.getImageData(0, 0, width, height);
      window.textures = window.textures || [];
      window.textures.push(imageData);
      var texture = new THREE.DataTexture(Uint8Array.from(imageData.data), width, height);
      texture.needsUpdate = true;
      return texture;
    };
  
    let texture = getTexture(200, 'kite', (ctx, width, height) => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      ctx.arc(width, height/2, height/8, 0, 2 * Math.PI);
      ctx.arc(0, height/2, height/8, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });
  
    var kite = new THREE.Geometry();
    kite.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, 0),
      new THREE.Vector3(-phi, 0, 0),
      new THREE.Vector3(x, -y, 0)
    );
    kite.faces.push(new THREE.Face3(0, 1, 2));
    kite.faces.push(new THREE.Face3(0, 2, 3));
    kite.faceVertexUvs[0].push([
      new THREE.Vector2(1, 1 / 2),
      new THREE.Vector2((1 - x) / phi, 0),
      new THREE.Vector2(0, 1 / 2)]);
    kite.faceVertexUvs[0].push([
      new THREE.Vector2(1, 1 / 2),
      new THREE.Vector2(0, 1 / 2),
      new THREE.Vector2((1 - x) / phi, 1)]);
    extrude(kite, x / 2);

    kite.computeFaceNormals();
    kite.uvNeedsUpdate = true;
  
    kite.rotateX(Math.PI / 2);
    var kiteMesh = new THREE.Mesh(kite, new THREE.MeshBasicMaterial({color: 0xffffff, map: texture}));
    scene.add(kiteMesh);
  
    texture = getTexture(200, 'dart', (ctx, width, height) => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, height/8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, height, height/8, 0, 2 * Math.PI);
      ctx.fill();
    });
  
    var dart = new THREE.Geometry();
    dart.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, -y, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(x, y, 0)
    );
    dart.faces.push(new THREE.Face3(0, 1, 2));
    dart.faces.push(new THREE.Face3(0, 2, 3));
    dart.faceVertexUvs[0].push([
      new THREE.Vector2(-x / (1 - x), .5),
      new THREE.Vector2(0, 1),
      new THREE.Vector2(1, .5)]);
    dart.faceVertexUvs[0].push([
      new THREE.Vector2(-x / (1 - x), .5),
      new THREE.Vector2(1, .5),
      new THREE.Vector2(0, 0)]);
    extrude(dart, x / 2);
    dart.computeFaceNormals();
    dart.rotateX(Math.PI / 2);
    scene.add(new THREE.Mesh(dart, new THREE.MeshBasicMaterial({color: 0xffffff, map: texture})));
  
    var dartRight = new THREE.Geometry();
    dartRight.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, -y, 0),
      new THREE.Vector3(1, 0, 0)
    );
    dartRight.faces.push(new THREE.Face3(0, 1, 2));
    dartRight.faceVertexUvs[0].push([
      new THREE.Vector2(-x / (1 - x), .5),
      new THREE.Vector2(0, 1),
      new THREE.Vector2(1, .5)]);
    extrude(dartRight, x / 2);
    dartRight.computeFaceNormals();
    dartRight.rotateX(Math.PI / 2);
    var dartRightMesh = new THREE.Mesh(dartRight, new THREE.MeshBasicMaterial({color: 0xffffff, map: texture}));
  
    var dartLeft = new THREE.Geometry();
    dartLeft.vertices.push(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(x, y, 0)
    );
    dartLeft.faces.push(new THREE.Face3(0, 1, 2));
    dartLeft.faceVertexUvs[0].push([
      new THREE.Vector2(-x / (1 - x), .5),
      new THREE.Vector2(1, .5),
      new THREE.Vector2(0, 0)]);
    extrude(dartLeft, x / 2);
    dartLeft.computeFaceNormals();
    dartLeft.rotateX(Math.PI / 2);
    var dartLeftMesh = new THREE.Mesh(dartLeft, new THREE.MeshBasicMaterial({color: 0xffffff, map: texture}));
  
    var twoMeshDart = new THREE.Object3D();
    twoMeshDart.add(dartLeftMesh);
    twoMeshDart.add(dartRightMesh);
    twoMeshDart.position.x = 1.1;
    scene.add(twoMeshDart);
  
    console.log('kite', exporter.parse(kiteMesh));
    //console.log('dart', exporter.parse(new THREE.Mesh(dart)));
    console.log('two-mesh dart', exporter.parse(twoMeshDart));
  
    renderer.render(scene, camera);
})(); 