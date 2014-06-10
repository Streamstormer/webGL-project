"use strict";

var webgl = {
    gl: null,
    objects: [],
	time: 0.0,
	life: 250,

	elements: {
		HYDRO: -25,
		KALIUM: -15,
		TITAN: 35,
		FERRUM: 10,
		URAN: -15,
		CARBON: 10,
		MAGNESIUM: -20,
		OXID: -5,
		select: function() {
			//console.log(.Object.getOwnPropertyNames())
			var select = document.getElementById("select");
			var value = select.selectedIndex;
			
			switch(value) {
				case 0:
					webgl.life += this.FERRUM;
					break;
				case 1:
					webgl.life += this.OXID;
					break;
				case 2:
					webgl.life += this.HYDRO;
					break;
				case 3:
					webgl.life += this.URAN;
					break;
				case 4:
					webgl.life += this.CARBON;
					break;
				case 5:
					webgl.life += this.TITAN;
					break;
				case 6:
					webgl.life += this.MAGNESIUM;
					break;
				case 7:
					webgl.life += this.KALIUM;
					break;
				default:
					console.log("Error: unknown element"); 
			}
			
		},
	},



    /**
     * Encapsulates Projection and Viewing matrix and some helper functions.
     **/
    matrices: {
        projection: new J3DIMatrix4(),
        viewing: new J3DIMatrix4(),
        viewingTranslate: {
            x: 0,
            y: 0,
            z: 0
        },
        viewingRotations: {
            x: 0,
            y: 0,
            z: 0
        },
        /**
         * Initializes the Projection and the Viewing matrix.
         * Projection uses perspective projection with fove of 30.0, aspect of 1.0, near 1 and far 10000.
         * Viewing is set up as a translate of (0, 10, -50) and a rotate of 20 degrees around x and y axis.
         **/
        init: function () {
            this.projection.perspective(30, 1.0, 1, 10000);
            this.viewingTranslate = {
                x: 0,
                y: 0,
                z: -5
            };
            this.viewingRotations = {
                x: 50,
                y: 0,
                z: 0
            };
            this.updateViewing.call(this);
        },
        updateViewing: function() {
            var t = this.viewingTranslate;
            this.viewing = new J3DIMatrix4();
            this.viewing.translate(t.x, t.y, t.z);
            var r = this.viewingRotations;
			this.viewing.scale(1.0,1.0,1.0) // 2.0,1.5,10.0
            this.viewing.rotate(r.x, 1, 0, 0);
            this.viewing.rotate(r.y, 0, 1, 0);
            this.viewing.rotate(r.z, 0, 0, 1);
        },
        zoomIn: function() {
            this.viewingTranslate.z -= 1;
            this.updateViewing();
        },
        zoomOut: function() {
            this.viewingTranslate.z += 1;
            this.updateViewing();
        },
        moveLeft: function() {
            this.viewingTranslate.x += 1;
            this.updateViewing();
        },
        moveRight: function() {
            this.viewingTranslate.x -= 1;
            this.updateViewing();
        },
        moveUp: function() {
            this.viewingTranslate.y += 1;
            this.updateViewing();
        },
        moveDown: function() {
            this.viewingTranslate.y -= 1;
            this.updateViewing();
        },
        rotateXAxis: function(offset) {
            this.viewingRotations.x = (this.viewingRotations.x + offset) % 360;
            this.updateViewing();
        },
        rotateYAxis: function(offset) {
            this.viewingRotations.y = (this.viewingRotations.y + offset) % 360;
            this.updateViewing();
        },
        rotateZAxis: function(offset) {
            this.viewingRotations.z = (this.viewingRotations.z + offset) % 360;
            this.updateViewing();
        },
        reset: function() {
            this.projection = new J3DIMatrix4();
            this.viewing = new J3DIMatrix4();
            this.init();
        }
    },
    /**
     * This message checks whether one of the error flags is set and
     * logs it to the console. If @p message is provided the message
     * is printed together with the error code. This allows to track
     * down an error by adding useful debug information to it.
     * 
     * @param message Optional message printed together with the error.
     **/
    checkError: function (message) {
        var errorToString = function(error) {
            switch (error) {
                case gl.NO_ERROR:
                    return "NO_ERROR";
                case gl.INVALID_ENUM:
                    return "INVALID_ENUM";
                case gl.INVALID_VALUE:
                    return "INVALID_VALUE";
                case gl.INVALID_OPERATION:
                    return "INVALID_OPERATION";
                case gl.OUT_OF_MEMORY:
                    return "OUT_OF_MEMORY";
            }
            return "UNKNOWN ERROR: " + error;
        };
        var gl = webgl.gl;
        var error = gl.getError();
        while (error !== gl.NO_ERROR) {
            if (message) {
                console.log(message + ": " + errorToString(error));
            } else {
                console.log(errorToString(error));
            }
            error = gl.getError();
        }
    },
    /**
     * This method logs information about the system:
     * @li VERSION
     * @li RENDERER
     * @li VENDOR
     * @li UNMASKED_RENDERER_WEBGL (Extension WEBGL_debug_renderer_info)
     * @li UNMASKED_VENDOR_WEBGL (Extension WEBGL_debug_renderer_info)
     * @li supportedExtensions
     **/
    systemInfo: function () {
        var gl = webgl.gl;
        console.log("Version: " + gl.getParameter(gl.VERSION));
        console.log("Renderer: " + gl.getParameter(gl.RENDERER));
        console.log("Vendor: " + gl.getParameter(gl.VENDOR));
        var extensions = gl.getSupportedExtensions();
        for (var i = 0; i < extensions.length; i++) {
            if (extensions[i] == "WEBGL_debug_renderer_info") {
                var renderInfo = gl.getExtension("WEBGL_debug_renderer_info");
                if (renderInfo) {
                    console.log("Unmasked Renderer: " + gl.getParameter(renderInfo.UNMASKED_RENDERER_WEBGL));
                    console.log("Unmasked Vendor: " + gl.getParameter(renderInfo.UNMASKED_VENDOR_WEBGL));
                }
            }
        }
        console.log("Extensions: ");
        console.log(extensions);
    },
    /**
     * Creates a shader program out of @p vertex and @p fragment shaders.
     * 
     * In case the linking of the shader program fails the programInfoLog is
     * logged to the console.
     * 
     * @param vertex The compiled and valid WebGL Vertex Shader
     * @param fragment The compiled and valid WebGL Fragment Shader
     * @returns The linked WebGL Shader Program
     **/
    createProgram: function (vertex, fragment) {
        var gl = webgl.gl;
        var shader = gl.createProgram();
        gl.attachShader(shader, vertex);
        gl.attachShader(shader, fragment);
        gl.linkProgram(shader);
        gl.validateProgram(shader);
        var log = gl.getProgramInfoLog(shader);
        if (log != "") {
            console.log(log);
        }
        webgl.checkError("create Program");
        return shader;
    },
    /**
     * Generic method to render any @p object with any @p shader as TRIANGLES.
     *
     * This method can enable vertex, normal and texCoords depending on whether they
     * are defined in the @p object and @p shader. Everything is added in a completely
     * optional way, so there is no chance that an incorrect VertexAttribArray gets
     * enabled.
     *
     * The @p object can provide the following elements:
     * @li loaded: boolean indicating whether the object is completely loaded
     * @li blending: boolean indicating whether blending needs to be enabled
     * @li texture: texture object to bind if valid
     * @li vertexObject: ARRAY_BUFFER with three FLOAT values (x, y, z)
     * @li normalObject: ARRAY_BUFFER with three FLOAT values (x, y, z)
     * @li texCoordObject: ARRAY_BUFFER with two FLOAT values (s, t)
     * @li indexObject: ELEMENT_ARRAY_BUFFER
     * @li numIndices: Number of indices in indexObject
     * @li indexSize: The type of the index, must be one of GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT or GL_UNSIGNED_INT
     *
     * The @p shader can provide the following elements:
     * @li vertexLocation: attribute location for the vertexObject
     * @li normalLocation: attribute location for the normalObject
     * @li texCoordsLocation: attribute location for the texCoordsLocation
     *
     * It is expected that the shader program encapsulated in @p shader is already in use.
     **/
    drawObject: function (gl, object, shader) {
        if (object.loaded === false) {
            // not yet loaded, don't render
            return;
        }
		// Set Time	
		if(object.particle == true) {	
			gl.uniform1f(shader.timeLocation, this.time);
		}

        if (object.texture !== undefined) {
            gl.bindTexture(gl.TEXTURE_2D, object.texture);
        }
        if (shader.vertexLocation !== undefined && object.vertexObject !== undefined) {
            gl.enableVertexAttribArray(shader.vertexLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexObject);
            gl.vertexAttribPointer(shader.vertexLocation, 3, gl.FLOAT, false, 0, 0);
        }

		// start:particle related Attributes
        if (shader.colorLocation !== undefined && object.colorObject !== undefined) {
            gl.enableVertexAttribArray(shader.colorLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.colorObject);
            gl.vertexAttribPointer(shader.colorLocation, 4, gl.FLOAT, false, 0, 0);
        }
        if (shader.velocityLocation !== undefined && object.velocityObject !== undefined) {
            gl.enableVertexAttribArray(shader.velocityLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.velocityObject);
            gl.vertexAttribPointer(shader.velocityLocation, 3, gl.FLOAT, false, 0, 0);
        }
        if (shader.startTimeLocation !== undefined && object.startTimeObject !== undefined) {
            gl.enableVertexAttribArray(shader.startTimeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.startTimeObject);
            gl.vertexAttribPointer(shader.startTimeLocation, 1, gl.FLOAT, false, 0, 0);
        }        
		if (shader.sizeLocation !== undefined && object.sizeObject !== undefined) {
            gl.enableVertexAttribArray(shader.sizeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.sizeObject);
            gl.vertexAttribPointer(shader.sizeLocation, 1, gl.FLOAT, false, 0, 0);
        }
		if(object.particle == true) {
			gl.drawArrays(gl.POINTS, 0, object.particleObject.length);	
		}

		// End: particle related Attributes



        if (shader.normalLocation !== undefined && object.normalObject !== undefined) {
            gl.enableVertexAttribArray(shader.normalLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.normalObject);
            gl.vertexAttribPointer(shader.normalLocation, 3, gl.FLOAT, false, 0, 0);
        }
        if (shader.texCoordsLocation !== undefined && object.texCoordObject !== undefined) {
            gl.enableVertexAttribArray(shader.texCoordsLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.texCoordObject);
            gl.vertexAttribPointer(shader.texCoordsLocation, 2, gl.FLOAT, false, 0, 0);
        }
        if (object.blending !== undefined && object.blending === true) {
			gl.disable(gl.DEPTH_TEST);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
			
			//gl.blendEquation(gl.FUNC_ADD);
			//gl.blendColor(1,1,1,0.5);

        }

        if (object.indexObject !== undefined && object.numIndices !== undefined && object.indexSize !== undefined) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexObject);
            gl.drawElements(gl.TRIANGLES, object.numIndices, object.indexSize, 0);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        if (object.blending !== undefined && object.blending === true) {
            gl.disable(gl.BLEND);
			gl.enable(gl.DEPTH_TEST);
        }
    },
    repaintLoop: {
        frameRendering: false,
        setup: function() {
            setInterval(function () {
                if (webgl.repaintLoop.frameRendering) {
                    return;
                }
                webgl.repaintLoop.frameRendering = true;
                webgl.angle = (webgl.angle + 1) % 360;
                for (var i = 0; i < webgl.objects.length; i++) {
                    var object = webgl.objects[i];
                    if (object.update === undefined) {
                        continue;
                    }
                    object.update.call(object);
                }
				this.time += 16/1000;
                webgl.displayFunc.call(webgl);
                webgl.repaintLoop.frameRendering = false;
            }, 16); // 16
        }
    },
    createShader: function (gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var log = gl.getShaderInfoLog(shader);
        if (log != "") {
            console.log(log);
        }
        webgl.checkError("create shader " + source);
        return shader;
    },
    createTextureShader: function() {
        var gl = this.gl;
        var shader = {
            program: -1,
            loaded: false,
            mvpLocation: -1,
            textureLocation: -1,
            vertexLocation: -1,
            texCoordsLocation: -1,
            create: function() {
                if (this.vertexShader === undefined || this.fragmentShader === undefined) {
                    return;
                }
                var program = webgl.createProgram(this.vertexShader, this.fragmentShader);
                this.program = program;
                this.use();
                // resolve locations
				this.normalMatrixLocation = gl.getUniformLocation(program, "u_normalMatrix"),
                this.lightDirLocation     = gl.getUniformLocation(program, "u_lightDir"),
                this.mvpLocation       = gl.getUniformLocation(program, "modelViewProjection"),
                this.textureLocation   = gl.getUniformLocation(program, "u_texture"),
                this.vertexLocation    = gl.getAttribLocation(program, "vertex"),
                this.texCoordsLocation = gl.getAttribLocation(program, "texCoords"),
                // set uniform
                gl.uniform1i(this.textureLocation, 0);
				gl.uniform3f(this.lightDirLocation, 0.3, 0.3, 0.3);
                this.loaded = true;
            },
            use: function () {
                gl.useProgram(this.program);
            }
        };
        $.get("shaders/texture/vertex.glsl", function(data, response) {
			console.log(data)
            shader.vertexShader = webgl.createShader(webgl.gl, webgl.gl.VERTEX_SHADER, data);
            shader.create.call(data);
        }, "html");
        $.get("shaders/texture/fragment.glsl", function(data, response) {
			console.log(data)
            shader.fragmentShader = webgl.createShader(webgl.gl, webgl.gl.FRAGMENT_SHADER, data);
            shader.create.call(shader);
        }, "html");
        return shader;
    },
	createParticleShader: function () {
		var gl = this.gl;
        var shader = {
            program: -1,
            loaded: false,
            mvpLocation: -1,
           // normalMatrixLocation: -1,
           // lightDirLocation: -1,
            vertexLocation: -1,
           // normalLocation: -1,
			create: function() {
				if (this.vertexShader === undefined || this.fragmentShader === undefined) {
           			return;
        		}
				var program = webgl.createProgram(this.vertexShader, this.fragmentShader);
            	this.program = program;
            	this.use();;
                var shader = {};
				// resolve locations
				this.mvpLocation          = gl.getUniformLocation(program, "modelViewProjection"),
                //this.normalMatrixLocation = gl.getUniformLocation(program, "u_normalMatrix"),
                //this.lightDirLocation     = gl.getUniformLocation(program, "u_lightDir"),
				this.timeLocation 		  = gl.getUniformLocation(program, "u_time"); 
                this.vertexLocation       = gl.getAttribLocation(program, "vertex"),
				this.colorLocation		  = gl.getAttribLocation(program, "initialColor");
                //this.normalLocation       = gl.getAttribLocation(program, "normal"),
                this.velocityLocation     = gl.getAttribLocation(program, "velocity");
                this.startTimeLocation    = gl.getAttribLocation(program, "startTime");
                this.sizeLocation         = gl.getAttribLocation(program, "size");
                
                this.loaded = true;
	    	},
			use: function () {
                gl.useProgram(this.program);
			}
		};
        $.get("shaders/particle/vertex.glsl", function(data) {
            shader.vertexShader = webgl.createShader(webgl.gl, webgl.gl.VERTEX_SHADER, data);
			console.log("loaded!");
            shader.create.call(shader);
        }, "html");
        $.get("shaders/particle/fragment.glsl", function(data) {
            shader.fragmentShader = webgl.createShader(webgl.gl, webgl.gl.FRAGMENT_SHADER, data);
			console.log("loaded!");
            shader.create.call(shader);
        }, "html");
        return shader;
	},	
    createLightShader: function() {
        var gl = this.gl;
        var shader = {
            program: -1,
            loaded: false,
            mvpLocation: -1,
            normalMatrixLocation: -1,
            lightDirLocation: -1,
            vertexLocation: -1,
            normalLocation: -1,
            create: function() {
                if (this.vertexShader === undefined || this.fragmentShader === undefined) {
                    return;
                }
                var program = webgl.createProgram(this.vertexShader, this.fragmentShader);
                this.program = program;
                this.use();
                // resolve locations
				this.textureLocation   = gl.getUniformLocation(program, "u_texture"),
				this.textureLocation   = gl.getUniformLocation(program, "u_texture"),
                this.mvpLocation          = gl.getUniformLocation(program, "modelViewProjection"),
                this.normalMatrixLocation = gl.getUniformLocation(program, "u_normalMatrix"),
                this.lightDirLocation     = gl.getUniformLocation(program, "u_lightDir"),
                this.vertexLocation       = gl.getAttribLocation(program, "vertex"),
                this.normalLocation       = gl.getAttribLocation(program, "normal"),
                // set uniform
                gl.uniform3f(this.lightDirLocation, 0.3, 0.3, 0.3);
                this.loaded = true;
            },
            use: function () {
                gl.useProgram(this.program);
            }
        };
        $.get("shaders/light/vertex.glsl", function(data) {
            shader.vertexShader = webgl.createShader(webgl.gl, webgl.gl.VERTEX_SHADER, data);
            shader.create.call(shader);
        }, "html");
        $.get("shaders/light/fragment.glsl", function(data) {
            shader.fragmentShader = webgl.createShader(webgl.gl, webgl.gl.FRAGMENT_SHADER, data);
            shader.create.call(shader);
        }, "html");
        return shader;
    },
    createColorShader: function() {
        var gl = this.gl;
        var shader = {
            loaded: false,
            program: -1,
            mvpLocation: -1,
            colorLocation: -1,
            vertexLocation: -1,
            create: function() {
                if (this.vertexShader === undefined || this.fragmentShader === undefined) {
                    return;
                }
                var program = webgl.createProgram(this.vertexShader, this.fragmentShader);
                this.program = program;
                this.use();
                // resolve locations
                this.mvpLocation    = gl.getUniformLocation(program, "modelViewProjection");
                this.colorLocation  = gl.getUniformLocation(program, "u_color");
                this.vertexLocation = gl.getAttribLocation(program, "vertex");
                // set uniform
                gl.uniform4f(this.colorLocation, Math.random(), Math.random(), Math.random(), 0.5);
                this.loaded = true;
            },
            use: function () {
                gl.useProgram(this.program);
            }
        };
        $.get("shaders/color/vertex.glsl", function(data) {
            shader.vertexShader = webgl.createShader(webgl.gl, webgl.gl.VERTEX_SHADER, data);
            shader.create.call(shader);
        }, "html");
        $.get("shaders/color/fragment.glsl", function(data) {
            shader.fragmentShader = webgl.createShader(webgl.gl, webgl.gl.FRAGMENT_SHADER, data);
            shader.create.call(shader);
        }, "html");
        setInterval(function () {
            if (!shader.loaded) {
                return;
            }
            shader.use();
            gl.uniform4f(shader.colorLocation, Math.random(), Math.random(), Math.random(), 0.5);
            }, 10000);
        return shader;
    },
    setupKeyHandler: function() {
		var m = this.matrices;
        $("body").keydown(function (event) {
            switch (event.keyCode) {
            case 107:
                m.zoomOut.call(m);
                break;
            case 109:
                m.zoomIn.call(m);
                break;
            case 39:
                if (event.shiftKey) {
                    m.rotateZAxis.call(m, 1);
                } else {
                    m.moveLeft.call(m);
                }
                break;
            case 37:
                if (event.shiftKey) {
                    m.rotateZAxis.call(m, -1);
                } else {
                    m.moveRight.call(m);
                }
                break;
            case 38:
                if (event.shiftKey) {
                    m.rotateXAxis.call(m, 1);
                } else {
                    m.moveUp.call(m);
                }
                break;
            case 40:
                if (event.shiftKey) {
                    m.rotateXAxis.call(m, -1);
                } else {
                    m.moveDown.call(m);
                }
                break;
            case 82:
                m.reset.call(m);
                break;
            }
        });
		},
	makeGround: function (gl){
    var vertices = new Float32Array(
        [  -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1    // v0-v1-v2-v3 front
              // v0-v5-v6-v1 top
             // v1-v6-v7-v2 left
             // v7-v4-v3-v2 bottom
           ]   // v4-v7-v6-v5 back
    );

    // normal array
    var normals = new Float32Array(
        [  0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0     // v0-v1-v2-v3 front
               // v0-v5-v6-v1 top
               // v1-v6-v7-v2 left
               // v7-v4-v3-v2 bottom
            ]    // v4-v7-v6-v5 back
       );


    // texCoord array
    var texCoords = new Float32Array(
        [  0, 0,   1, 0,   1, 1,   0, 1    // v0-v1-v2-v3 front
             // v0-v5-v6-v1 top
               // v1-v6-v7-v2 left
              // v7-v4-v3-v2 bottom
           ]   // v4-v7-v6-v5 back
       );

    // index array
    var indices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3    // front
              // top
              // left
             // bottom
          ]   // back
      );


		var retval = { };

		retval.normalObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, retval.normalObject);
		gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

		retval.texCoordObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, retval.texCoordObject);
		gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

		retval.vertexObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, retval.vertexObject);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		retval.indexObject = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, retval.indexObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		retval.numIndices = indices.length;

		console.log(indices.length);

		return retval;
	},
	makeOpenBox: function (gl){
		   var vertices = new Float32Array(
        [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,    // v0-v1-v2-v3 front
           1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,    // v0-v3-v4-v5 right
           1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,    // v0-v5-v6-v1 top
          -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,    // v1-v6-v7-v2 left
          -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,    // v7-v4-v3-v2 bottom
           1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]   // v4-v7-v6-v5 back
    );

    // normal array
    var normals = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     // v0-v1-v2-v3 front
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     // v0-v3-v4-v5 right
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     // v0-v5-v6-v1 top
          -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     // v1-v6-v7-v2 left
           0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     // v7-v4-v3-v2 bottom
           0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]    // v4-v7-v6-v5 back
       );


    // texCoord array
    var texCoords = new Float32Array(
        [  1, 1,   0, 1,   0, 0,   1, 0,    // v0-v1-v2-v3 front
           0, 1,   0, 0,   1, 0,   1, 1,    // v0-v3-v4-v5 right
           1, 0,   1, 1,   0, 1,   0, 0,    // v0-v5-v6-v1 top
           1, 1,   0, 1,   0, 0,   1, 0,    // v1-v6-v7-v2 left
           0, 0,   1, 0,   1, 1,   0, 1,    // v7-v4-v3-v2 bottom
           0, 0,   1, 0,   1, 1,   0, 1 ]   // v4-v7-v6-v5 back
       );

    // index array
    var indices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
          20,21,22,  20,22,23 ]   // back
      );


		var retval = { };
		retval.normalObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, retval.normalObject);
		gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

		retval.texCoordObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, retval.texCoordObject);
		gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

		retval.vertexObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, retval.vertexObject);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		retval.indexObject = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, retval.indexObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		retval.numIndices = indices.length;

		console.log(indices.length);

		return retval;
	},
    createBuffer: function (gl, vertices) {
	    var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return vbo;
    },
	/*
	createParticle: function () {
		var particle = new Object();
		if (this.position === undefined) {
			this.position = [((Math.random()-.5)*.1),
						((Math.random()-.5)*.1),
						((Math.random()-.5)*.1),
						];
		}
		if (particle.color === undefined) { particle.color = [1.0,0.0,0.0,0.5];}
		
		this.position = position;
		this.color = color;
		
		this.velocity = [((Math.random()-.5)*.1),
						((Math.random()-.5)*.1),
						((Math.random()-.5)*.1),
						];
		if((Math.abs(this.velocity[0]) < 0.01) &&
			(Math.abs(this.velocity[1]) < 0.01) &&
			(Math.abs(this.velocity[2]) < 0.01)
			)
		{ //ensure particle is not stagnant
		this.velocity[0] = 0.1;
		}
		this.age=0;
		this.lifespan=20;
		this.size=1.0;
	},*/

    createParticle: function () {
	    var particle = {};
        particle.position = [1, 1, 1];
        particle.velocity = [0, 0, 0];
        particle.color = [1.0, 0.0, 0.0, 1];
        particle.startTime = Math.random() * 30 + 1;
        particle.size = Math.random()*15 + 1;
        return particle;
    },
	createParticelSystem: function(gl) {
		var particles = [];
        for (var i=0; i<100; i++) {
        	particles.push(this.createParticle());
        }
        var vertices = [];
        var velocities = [];
        var colors = [];
        var startTimes = [];
        var sizes = [];

        for (i=0; i<particles.length; i++) {
        	var particle = particles[i];
        	vertices.push(particle.position[1]);
            vertices.push(particle.position[2]);
            vertices.push(particle.position[3]);
           	velocities.push(particle.velocity[0]);
            velocities.push(particle.velocity[1]);
            velocities.push(particle.velocity[2]);
            colors.push(particle.color[0]);
            colors.push(particle.color[1]);
            colors.push(particle.color[2]);
            colors.push(particle.color[3]);
            startTimes.push(particle.startTime);
            sizes.push(particle.size);
        }
		var retval = { };
        retval.particleObject = particles;
        retval.vertexObject = this.createBuffer(gl, vertices);
        retval.velocityObject = this.createBuffer(gl, velocities);
        retval.colorObject = this.createBuffer(gl, colors);
        retval.startTimesObject = this.createBuffer(gl, startTimes);
        retval.sizeObject = this.createBuffer(gl, sizes);

		retval.particle = true;
		return retval;
	},

	
    init: function (canvasName, vertexShaderName, fragmentShaderName) {
        var canvas, gl;

		$(document).ajaxError(function(e,xhr,opt){
		    console.log("Error requesting " + opt.url + ": " + xhr.status + " " + xhr.statusText);
		});
        // setup the API
        canvas = document.getElementById(canvasName);
        gl = canvas.getContext("experimental-webgl");
        this.gl = gl;
        gl.viewport(0, 0, canvas.width, canvas.height);
		
		
        gl.clearColor(0.0, 0.0, 0.5, 0.5);
        gl.enable(gl.DEPTH_TEST);
        
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
		//gl.colorMask(true, true, true, false); 
        this.systemInfo();
		
			
		
        // create the projection matrix
        this.matrices.init.call(this.matrices);




		// particle objects
		var object = this.createParticelSystem(gl)
		object.shader = this.createParticleShader();
		object.loaded = true;
		object.model = function() {
            var model = new J3DIMatrix4();
			model.perspective(50, 1.0, 1, 10000);
			model.translate(2, 2, -10);
            model.rotate(180, 1,1,0);
            return model;
        };
		this.objects[this.objects.length] = object;



		// ground objects
		var object = this.makeGround(gl)
		object.indexSize = gl.UNSIGNED_BYTE;
        object.loaded = true;
		//object.blending = true;
        // TODO: change texture functionality so that it does not render the object before texture is loaded
        object.texture = loadImageTexture(gl, "textures/metall.jpg");
        object.shader = this.createTextureShader();
		object.model = function() {
            var model = new J3DIMatrix4();	
			model.scale(1.6,1.2,1.8)
			//model.perspective(30, 1.0, 1, 10000)
            //model.translate(0.0, -20.0, 0.0);
            //model.rotate(0.0, 0.0, 1.0, 0.0);;
			return model
		};
        this.objects[this.objects.length] = object;


        // create some objects
        // first a box, textured with a wood texture, which rotates around the y axis
        object = this.makeOpenBox(gl);
        object.indexSize = gl.UNSIGNED_BYTE;
        object.loaded = true;
			
		// Disabled because of driver problems -> blending not functional in basis-application
		object.blending = true;
        // TODO: change texture functionality so that it does not render the object before texture is loaded
        object.texture = loadImageTexture(gl, "textures/ogee-glass.png");
        object.angle = 0;
        object.shader = this.createTextureShader();
        object.update = function() {
            this.angle = (this.angle + 1) % 360;
        };
        object.model = function() {
            var model = new J3DIMatrix4();
			model.scale(0.5,0.5,0.5)
			model.translate(0,-1.39,0);
            //model.rotate(this.angle, 0.0, 1.0, 0.0);
            return model;
        };
        this.objects[this.objects.length] = object;

		// particle objects
		var object = this.createParticelSystem(gl)
		object.shader = this.createParticleShader();
		object.loaded = true;
		object.model = function() {
            var model = new J3DIMatrix4();
			model.perspective(50, 1.0, 1, 10000);
			model.translate(2, 2, -10);
            model.rotate(180, 1,1,0);
            return model;
        };
		this.objects[this.objects.length] = object;

		/*
        // and a teapot under light rotating in the opposite direction from the box
        object = loadObj(gl, "objects/teapot.obj");
        object.indexSize = gl.UNSIGNED_SHORT;
        object.shader = this.createLightShader();
        object.angle = 0;
        object.update = function() {
            this.angle = (this.angle - 1) % 360;
        };
        object.model = function() {
            var model = new J3DIMatrix4();
            model.translate(0.0, -20.0, 0.0);
            model.rotate(this.angle, 0.0, 1.0, 0.0);
            return model;
        };
        this.objects[this.objects.length] = object;

        // and another box which uses a color shader
        object = makeBox(gl);
        object.loaded = true;
        object.blending = true;
        object.indexSize = gl.UNSIGNED_BYTE;
        object.shader = this.createColorShader();
        object.angle = 0;
        object.update = function() {
            this.angle = (this.angle + 2) % 360;
        };
        object.model = function() {
            var model = new J3DIMatrix4();
            model.translate(0.0, -10.0, 20.0);
            model.scale(1.5, 1.5, 1.5);
            model.rotate(this.angle, 0.0, 0.0, 1.0);
            return model;
        };
        this.objects[this.objects.length] = object;*/

        // setup animation
       	this.repaintLoop.setup();

        // setup handlers
        this.setupKeyHandler();
    },
    displayFunc: function () {
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (var i = 0; i < this.objects.length; i++) {
            var object, shader, modelView, normalMatrix, modelViewProjection;
            object = this.objects[i];

		/*	if(object.particle && object.shader != undefined) {
				console.log("display");
			}*/

            if (object.shader === undefined) {
                // no shader is set, cannot render
                continue;
            }
            if (object.shader.loaded !== undefined && object.shader.loaded === false) {
                // shader not yet loaded
                continue;
            }
            shader = object.shader;
            shader.use();
            // create the matrices
            modelViewProjection = new J3DIMatrix4(this.matrices.projection);
            modelView = new J3DIMatrix4(this.matrices.viewing);
            if (object.model !== undefined) {
                modelView.multiply(object.model.call(object));
            }
            modelViewProjection.multiply(modelView);
            if (shader.mvpLocation !== undefined) {
                modelViewProjection.setUniform(gl, shader.mvpLocation, false);
            }
            if (shader.normalMatrixLocation) {
                normalMatrix = new J3DIMatrix4();
                normalMatrix.load(modelView);
                normalMatrix.invert();
                normalMatrix.transpose();
                normalMatrix.setUniform(gl, shader.normalMatrixLocation, false)
            }
            this.drawObject(gl, object, shader);
            this.checkError("drawObject: " + i);
        }
        this.checkError("displayFunc");
    }
};
