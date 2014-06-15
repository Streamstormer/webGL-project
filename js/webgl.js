"use strict";

/***
* critical element webgl demo by Silke Rohn and Benedikt Klotz
* Source is the Basis applikation.
* Added and changed functionalities:
* @Benedikt: Objects, Lighting,  particle systems, shader, blending and face culling
* @Silke: particle system, changes to particle systems (Elements)
*/

var webgl = {
    gl: null,
    objects: [],
	time: 0.0,
	life: 250,
	objectAngle: 0,
	debug: true,
	maxAge: 5.0,

    /**
    * @author: Silke Rohn
    **/

	elements: {
        
		HYDRO: -15,
		KALIUM: -15,
		TITAN: 35,
		FERRUM: 10,
		URAN: -15,
		CARBON: 10,
		MAGNESIUM: -20,
		OXID: -5,
		select: function() {
			var select = document.getElementById("select");
			var value = select.selectedIndex;		
			var objects = webgl.objects[2]			
			
			switch(value) {
				case 0:
					
					webgl.life += this.FERRUM;
					if (webgl.life <0){
						window.alert("Die kritische Masse ist explodiert!!!");
					}					
					var changed = false;
                    if (objects.colors[0] <= 0.9) {
					    for (var i = 0; i < objects.colors.length;i+=4) {	    
					        objects.colors[i] += 0.01;	
					        objects.colors[i+1] += 0.01;									    
						}	
                        changed = true;
					}
					if(changed) {
						webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER,objects.colorObject);
					    webgl.gl.bufferSubData(webgl.gl.ARRAY_BUFFER,0,new Float32Array(objects.colors));
					}											
					break;
				case 1:
					webgl.life += this.OXID;
					if (webgl.life <0){
						window.alert("Die kritische Masse ist explodiert!!!");
					}
					var changed = false;
                    if (objects.colors[0] <= 0.9) {
					    for (var i = 0; i < objects.colors.length;i+=4) {	    
					        objects.colors[i+1] += 0.1;						        									    
						}	
                        changed = true;
					}										
						webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, objects.colorObject);
						webgl.gl.bufferSubData(webgl.gl.ARRAY_BUFFER,0,new Float32Array(objects.colors));							
					break;
				case 2:
					webgl.life += this.HYDRO;
					if (webgl.life <0){
						window.alert("Die kritische Masse ist explodiert!!!");
					}					
					var changed = false;
                    
					    for (var i = 0; i < objects.velocities.length;i+=3) {	    
					        objects.velocities[i] += 0.01;	
							objects.velocities[i+1] += 0.01;
						}	
                        changed = true;	
						webgl.maxAge += 0.5;
					
						webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, objects.velocityObject);
						webgl.gl.bufferSubData(webgl.gl.ARRAY_BUFFER,0,new Float32Array(objects.velocities));
					break;
				case 3:
					webgl.life += this.URAN;
					if (webgl.life <0){
						window.alert("Die kritische Masse ist explodiert!!!");
					}
					
					var changed = false;
                    
					    for (var i = 0; i < objects.colors.length;i+=3) {	    
					        objects.velocities[i] -= 0.01;
							objects.velocities[i+2] -= 0.01;
						}	
                        changed = true;	
						if (webgl.maxAge <0.5){
							window.alert("Die kritische Masse ist verschwunden!!!");
						}						
						webgl.maxAge -= 0.5;
						
					
						webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, objects.velocityObject);
						webgl.gl.bufferSubData(webgl.gl.ARRAY_BUFFER,0,new Float32Array(objects.velocities));
					break;
				case 4:
					webgl.life += this.CARBON;
					if (webgl.life <0){
						window.alert("Die kritische Masse ist explodiert!!!");
					}
					
					var changed = false;
                        for (var i = 0; i < objects.velocities.length;i+=3) {	    
					       	objects.velocities[i] -= 0.01;
							objects.velocities[i+1] -= 0.01;
						}	
                        changed = true;	
						if (webgl.maxAge <0.5){
							window.alert("Die kritische Masse ist verschwunden!!!");
						}
						webgl.maxAge -= 0.5;
						
					
						webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, objects.velocityObject);
						webgl.gl.bufferSubData(webgl.gl.ARRAY_BUFFER,0,new Float32Array(objects.velocities));						
					break;
				case 5:
					webgl.life += this.TITAN;
					if (webgl.life <0){
						window.alert("Die kritische Masse ist explodiert!!!");
					}
					
					var changed = false;
                    if (objects.colors[2] >= 0.1) {
					    for (var i = 0; i < objects.colors.length;i+=4) {	    
					        objects.colors[i+2] -= 0.1;	
							
						}	
                        changed = true;
					}					
						webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, objects.colorObject);
						webgl.gl.bufferSubData(webgl.gl.ARRAY_BUFFER,0,new Float32Array(objects.colors));
					break;
				case 6:
					webgl.life += this.MAGNESIUM;
					if (webgl.life <0){
						window.alert("Die kritische Masse ist explodiert!!!");
					}
					
					var changed = false;
                    if ((objects.colors[0] >= 0.1) && (objects.colors[1] >= 0.1)) {
					    for (var i = 0; i < objects.colors.length;i+=4) {	    
					        objects.colors[i] -= 0.1;	
							objects.colors[i+1] -= 0.1;							
						}	
                        changed = true;
					}
					
						webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, objects.colorObject);
						webgl.gl.bufferSubData(webgl.gl.ARRAY_BUFFER,0,new Float32Array(objects.colors));
					break;
				case 7:
					webgl.life += this.KALIUM;
					if (webgl.life <0){
						window.alert("Die kritische Masse ist explodiert!!!");
					}
					
					var changed = false;
                    
					    for (var i = 0; i < webgl.objects[2].velocities.length;i+=3) {	 
							objects.velocities[i] += 0.01;//Math.random()*.1;
					        objects.velocities[i+1] += 0.01;//Math.random()*.1;	
							objects.velocities[i+2] += 0.01;//Math.random()*.1;												
						}	
						
                        changed = true;		
						if (webgl.maxAge <0.5){
							window.alert("Die kritische Masse ist verschwunden!!!");
						}
						webgl.maxAge -= 0.5;	
						
					
						webgl.gl.bindBuffer(webgl.gl.ARRAY_BUFFER, objects.velocityObject);
						webgl.gl.bufferSubData(webgl.gl.ARRAY_BUFFER,0,new Float32Array(objects.velocities));
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
        },
		rotateObjectsLeft: function() {
			webgl.objectAngle = (webgl.objectAngle - 1) % 360;
		},
		rotateObjectsRight: function() {
			webgl.objectAngle = (webgl.objectAngle + 1) % 360;
		},
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
     * Changes by: Benedikt Klotz
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
            gl.uniform1f(shader.ageLocation, this.maxAge);
		}

        if (object.texture !== undefined) {
            gl.bindTexture(gl.TEXTURE_2D, object.texture);
        }
        if (shader.vertexLocation !== undefined && object.vertexObject !== undefined) {
            gl.enableVertexAttribArray(shader.vertexLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexObject);
            gl.vertexAttribPointer(shader.vertexLocation, 3, gl.FLOAT, false, 0, 0);
        }

		// start: Particle System related Attributes
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

		if(object.particle == true) {
			gl.drawArrays(gl.POINTS, 0, object.particleObject.length);	
		}
		// End: Particle System related Attributes

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

        // Activate blending
        if (object.blending !== undefined && object.blending === true) {
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // 

            gl.enable(gl.BLEND);
			gl.uniform1f(shader.alphaLocation, 0.8);
			gl.disable(gl.DEPTH_TEST);
        // Set Alpha if blending for object is not activated
        } else{
			gl.uniform1f(shader.alphaLocation, 1.0);
		}

        // Activate culling
		if(object.culling !== undefined && object.culling === true) {
					gl.enable(gl.CULL_FACE);
					gl.cullFace(gl.FRONT);
		}

        if (object.indexObject !== undefined && object.numIndices !== undefined && object.indexSize !== undefined) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexObject);
            gl.drawElements(gl.TRIANGLES, object.numIndices, object.indexSize, 0);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);

        // Disbale Culling and enable Depth Test
        if (object.blending !== undefined && object.blending === true) {
			gl.enable(gl.DEPTH_TEST);
			gl.disable(gl.BLEND);
        }

        // Disable Culling
		if(object.culling !== undefined && object.culling === true) {
			gl.disable(gl.CULL_FACE);
		}
    },
    repaintLoop: {
        frameRendering: false,
		setup: function() {
            var render = function(){
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
				webgl.time += 16/1000;
                webgl.displayFunc.call(webgl);
                webgl.repaintLoop.frameRendering = false;
				window.requestAnimFrame(render);
            };
			window.requestAnimFrame(render);
			render();
			
			
		},
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

    /**
     * Create a texture shader with Lighting enabled
     *
     * @author: Benedikt Klotz
     **/
    createObjectShader: function() {
        var gl = this.gl;
        var shader = {
            program: -1,
            loaded: false,
            mvpLocation: -1,
            textureLocation: -1,
            vertexLocation: -1,
            texCoordsLocation: -1,
			lightDirLocation: -1,
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
                this.mvpLocation          = gl.getUniformLocation(program, "modelViewProjection"),
                this.textureLocation      = gl.getUniformLocation(program, "u_texture"),
                this.vertexLocation       = gl.getAttribLocation(program, "vertex"),
                this.texCoordsLocation    = gl.getAttribLocation(program, "texCoords"),
				this.alphaLocation 		  = gl.getUniformLocation(program, "uAlpha");
                // set uniform
                gl.uniform1i(this.textureLocation, 0);
				gl.uniform3f(this.lightDirLocation, 1.0, 1.0, 1.0);
                this.loaded = true;
            },
            use: function () {
                gl.useProgram(this.program);
            }
        };
        $.get("shaders/texture/vertex.glsl", function(data, response) {
            shader.vertexShader = webgl.createShader(webgl.gl, webgl.gl.VERTEX_SHADER, data);
            shader.create.call(shader);
        }, "html");
        $.get("shaders/texture/fragment.glsl", function(data, response) {
            shader.fragmentShader = webgl.createShader(webgl.gl, webgl.gl.FRAGMENT_SHADER, data);
            shader.create.call(shader);
        }, "html");
        return shader;
    },

    /**
     * Create a special shader for the Particle System
     *
     * @author: Benedikt Klotz
     **/
	createParticleShader: function () {
		var gl = this.gl;
        var shader = {
            program: -1,
            loaded: false,
            mvpLocation: -1,
            vertexLocation: -1,
			dirLocation: -1,
			create: function() {
				if (this.vertexShader === undefined || this.fragmentShader === undefined) {
           			return;
        		}
				var program = webgl.createProgram(this.vertexShader, this.fragmentShader);
            	this.program = program;
            	this.use();
                var shader = {};
				// resolve locations
				this.mvpLocation           = gl.getUniformLocation(program, "modelViewProjection"),
				this.timeLocation 		   = gl.getUniformLocation(program, "u_time"),
                this.vertexLocation        = gl.getAttribLocation(program, "vertex"),
                this.ageLocation           = gl.getUniformLocation(program, "maxAlter");
				this.colorLocation		   = gl.getAttribLocation(program, "initialColor"),
                this.velocityLocation      = gl.getAttribLocation(program, "velocity"),
                this.startTimeLocation     = gl.getAttribLocation(program, "startTime"),
                this.sizeLocation          = gl.getAttribLocation(program, "size"),
                this.loaded = true;
	    	},
			use: function () {
                gl.useProgram(this.program);
			}
		};
        $.get("shaders/particle/vertex.glsl", function(data) {
            shader.vertexShader = webgl.createShader(webgl.gl, webgl.gl.VERTEX_SHADER, data);
            shader.create.call(shader);
        }, "html");
        $.get("shaders/particle/fragment.glsl", function(data) {
            shader.fragmentShader = webgl.createShader(webgl.gl, webgl.gl.FRAGMENT_SHADER, data);
            shader.create.call(shader);
        }, "html");
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
                    /** disabled
					 * m.rotateObjectsLeft.call(m);
                     **/
                }
                break;
            case 37:
                if (event.shiftKey) {
                    m.rotateZAxis.call(m, -1);
                } else {
                    m.moveRight.call(m);
                    /** disabled
					 * m.rotateObjectsRight.call(m);
                     **/
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

    /**
     * Create ground object
     *
     * @author: Benedikt Klotz
     */
	makeGround: function (gl){
		var buffer = { };

		// vertices array
    	var vertices =
        	[  -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1 ];
    	// normal array
    	var normals =
        	[  0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0 ];

    	// texCoord array
    	var texCoords =
       		[  0, 0,   1, 0,   1, 1,   0, 1 ];

   		// index array
    	var indices = 
        	[  0, 1, 2,   0, 2, 3  ];
	
		buffer.vertexObject = this.createBuffer_f32(gl, vertices);
		buffer.texCoordObject = this.createBuffer_f32(gl, texCoords);
		buffer.normalObject = this.createBuffer_f32(gl,normals);
		buffer.indexObject = this.createBuffer_ui8(gl, indices);

		buffer.numIndices = indices.length;

		return buffer;
	},

    /**
     * create an upwards open box
     *
     * @author: Benedikt Klotz
     **/
	makeOpenBox: function (gl){
		var buffer = { };

		// vertices array
		var vertices = 
	        [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,    // v0-v1-v2-v3 front
	           1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,    // v0-v3-v4-v5 right
	           1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,    // v0-v5-v6-v1 top
	          -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,    // v1-v6-v7-v2 left
	          -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,    // v7-v4-v3-v2 bottom
	           1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ];  // v4-v7-v6-v5 back

	   	// normal array
	   	var normals =
	        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     // v0-v1-v2-v3 front
	           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     // v0-v3-v4-v5 right
	           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     // v0-v5-v6-v1 top
	          -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     // v1-v6-v7-v2 left
	           0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     // v7-v4-v3-v2 bottom
	           0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ];   // v4-v7-v6-v5 back

    	// texCoord array
    	var texCoords =
        	[  1, 1,   0, 1,   0, 0,   1, 0,    // v0-v1-v2-v3 front
        	   0, 1,   0, 0,   1, 0,   1, 1,    // v0-v3-v4-v5 right
        	   1, 0,   1, 1,   0, 1,   0, 0,    // v0-v5-v6-v1 top
        	   1, 1,   0, 1,   0, 0,   1, 0,    // v1-v6-v7-v2 left
        	   0, 0,   1, 0,   1, 1,   0, 1,    // v7-v4-v3-v2 bottom
        	   0, 0,   1, 0,   1, 1,   0, 1 ];  // v4-v7-v6-v5 back

    	// index array
    	var indices =
			[   0, 1, 2,   0, 2, 3,    // front
				4, 5, 6,   4, 6, 7,    // right   
				12,13,14,  12,14,15,    // left
				16,17,18,  16,18,19,    // bottom
          		20,21,22,  20,22,23 ];   // back


		buffer.vertexObject = this.createBuffer_f32(gl, vertices);
		buffer.texCoordObject = this.createBuffer_f32(gl, texCoords);
		buffer.normalObject = this.createBuffer_f32(gl,normals);
		buffer.indexObject = this.createBuffer_ui8(gl, indices);

		buffer.numIndices = indices.length;

		return buffer;
	},

    /**
     *
     * Create Buffer Objects in Bit Size 8 and 32 in float and unsigned int.
     * The function with a d is used for dynamic draws
     *
     * @author: Benedikt Klotz
     **/      
    createBuffer_f32: function (gl, data) {
	    var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    },
    createBuffer_f32_d: function (gl, data) {
	    var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    },

	createBuffer_ui8: function (gl, data) {
	    var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(data), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return vbo;
    },

    /**
     * Create a particle system, whose particle are black and are going in all directions
     * 
     * @author: Benedikt Klotz, Silke Rohn
     **/
   createParticle: function (dir) {
	    var particle = {};
        particle.position = [1, 1, 1];

		
		switch(dir) {
			case 0:
				particle.velocity = [Math.random()*.1, Math.random()*.1, Math.random()*.1];
				break;
			case 1:
				particle.velocity = [-Math.random()*.1, Math.random()*.1, Math.random()*.1];
				break;			
			case 2:
				particle.velocity = [Math.random()*.1, -Math.random()*.1, Math.random()*.1];
				break;
			case 3:
				particle.velocity = [Math.random()*.1, Math.random()*.1, -Math.random()*.1];
				break;
			case 4:
				particle.velocity = [-Math.random()*.1, -Math.random()*.1, Math.random()*.1];
				break;
			case 5:
				particle.velocity = [-Math.random()*.1, Math.random()*.1, -Math.random()*.1];
				break;
			case 6:
				particle.velocity = [Math.random()*.1, -Math.random()*.1, -Math.random()*.1];
				break;
			case 7:
				particle.velocity = [-Math.random()*.1, -Math.random()*.1, -Math.random()*.1];
				break;
			default:
				console.log("Error - particle creation: Unknown Direction - " + dir);
				break;			
		}
        // start with black particles
        particle.color = [0.0, 0.0, 0.0, 1.0];
        particle.startTime = Math.random() * 10 + 1;
        return particle;
    },
	createParticelSystem: function(gl) {
		var particles = [];

        for (var i=0, dir=0; i<100000; i++, dir++) {
			if(dir == 8) {
				dir=0;
			}
        	particles.push(this.createParticle(dir));
        }
        var vertices = [];
        var velocities = [];
        var colors = [];
        var startTimes = [];
        var dirs = [];

        for (i=0; i<particles.length; i++) {
        	var particle = particles[i];
        	vertices.push(particle.position[0]);
            vertices.push(particle.position[1]);
            vertices.push(particle.position[2]);
           	velocities.push(particle.velocity[0]);
            velocities.push(particle.velocity[1]);
            velocities.push(particle.velocity[2]);
            colors.push(particle.color[0]);
            colors.push(particle.color[1]);
            colors.push(particle.color[2]);
            colors.push(particle.color[3]);
            startTimes.push(particle.startTime);
            dirs.push(particle.dir);
        }

        // create gl Buffer for particles
		var buffer = { };
        buffer.particleObject = particles;
        buffer.vertexObject = this.createBuffer_f32(gl, vertices);
        buffer.velocityObject = this.createBuffer_f32_d(gl, velocities);
        buffer.colorObject = this.createBuffer_f32_d(gl, colors);
        buffer.startTimeObject = this.createBuffer_f32_d(gl, startTimes);
        buffer.dirObject = this.createBuffer_f32(gl, dirs);

        // save object properties for update later
        buffer.velocities = velocities;
        buffer.startTimes = startTimes;
        buffer.colors = colors;

		buffer.particle = true;
		return buffer;
	},



	loadTexture: function(gl, path, object)
	{
		var texture = gl.createTexture();
		var image = new Image();
		g_loadingImages.push(image);
		image.onload = function() { webgl.doLoadTexture.call(webgl, gl, image, texture, object) }
		image.src = path;
		return texture;
	},

	doLoadTexture: function(gl, image, texture, object)
	{
		g_loadingImages.splice(g_loadingImages.indexOf(image), 1);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		// Set Texture Parameter
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);

		// Set texture loaded
		object.loaded = true;
	},

    /**
     * Initialize all systems and objects
     *
     * @author: Benedikt Klotz
     **/
    init: function (canvasName, vertexShaderName, fragmentShaderName) {
        var canvas, gl;

        // Setup Error reporting
		$(document).ajaxError(function(e,xhr,opt){
		    console.log("Error requesting " + opt.url + ": " + xhr.status + " " + xhr.statusText);
		});
        // setup the API
        canvas = document.getElementById(canvasName);
        gl = canvas.getContext("experimental-webgl",{premultipliedAlpha:false});
        this.gl = gl;
        gl.viewport(0, 0, canvas.width, canvas.height);
		// make background blue	
        gl.clearColor(0.0, 0.0, 0.5, 0.6);
        gl.enable(gl.DEPTH_TEST);
 
        this.systemInfo();		
        // create the projection matrix
        this.matrices.init.call(this.matrices);


		// ground objects
		var object = this.makeGround.call(this, gl)
		object.indexSize = gl.UNSIGNED_BYTE;
		object.name = "ground";
		object.blending = false;
		// Enable Front Face Culling
		object.culling = true;

        object.texture = this.loadTexture.call(this, gl, "textures/metall.jpg", object);
        object.shader = this.createObjectShader();
		object.model = function() {
            var model = new J3DIMatrix4();	
			model.scale(1.6,1.2,1.8)
			model.rotate(this.objectAngle, 0.0, 1.0, 0.0);

			return model
		};
        this.objects[this.objects.length] = object;


		// create a open box
        object = this.makeOpenBox.call(this, gl);
        object.indexSize = gl.UNSIGNED_BYTE;
		object.name = "box";

		// enable object blending
		object.blending = true;

        object.texture = this.loadTexture.call(this, gl, "textures/glas.jpg", object);
        object.shader = this.createObjectShader();

        object.model = function() {
            var model = new J3DIMatrix4();
			model.scale(0.5,0.5,0.5)
			model.translate(0,-1.39,0);
			model.rotate(this.objectAngle, 0.0, 1.0, 0.0);
            return model;
        };
        this.objects[this.objects.length] = object;

		// particle objects
		var object = this.createParticelSystem(gl)
		object.shader = this.createParticleShader();
		object.loaded = true;
		object.blending = true;
		object.model = function() {
            var model = new J3DIMatrix4();
			model.translate(-1.0,-1.7,-1.0);
			model.rotate(this.objectAngle, 0.0, 1.0, 0.0);
            return model;
        };

        // Reset particle startTime if there are discarded
		setInterval(function() {
			var particles = object.particleObject;
            var changed = false;
			for (var i=0; i<particles.length; i++) {
				if(object.startTimes[i] + 7.0 <= webgl.time) {
					object.startTimes[i] = webgl.time + 3.0*Math.random();
                    changed = true; 
				}
					
			}
            if(changed) {
			    gl.bindBuffer(gl.ARRAY_BUFFER,object.startTimeObject);
			    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(object.startTimes));
            }			
		}, 1000);
		this.objects[this.objects.length] = object;


        // setup animation
       	this.repaintLoop.setup.call(this);

        if(this.debug) {
            // setup handlers
            this.setupKeyHandler();
        }
    },
    displayFunc: function () {
        var gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (var i = 0; i < this.objects.length; i++) {
            var object, shader, modelView, normalMatrix, modelViewProjection;
            object = this.objects[i];

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
                modelView.multiply(object.model.call(this));
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
