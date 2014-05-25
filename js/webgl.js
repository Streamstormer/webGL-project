var webgl = {
    gl: null,
    objects: [],
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
                y: 10,
                z: -50
            };
            this.viewingRotations = {
                x: 20,
                y: 20,
                z: 0
            }
            this.updateViewing.call(this);
        },
        updateViewing: function() {
            var t = this.viewingTranslate;
            this.viewing = new J3DIMatrix4();
            this.viewing.translate(t.x, t.y, t.z);
            var r = this.viewingRotations;
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
        while (error != gl.NO_ERROR) {
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
        if (object.texture !== undefined) {
            gl.bindTexture(gl.TEXTURE_2D, object.texture);
        }
        if (shader.vertexLocation !== undefined && object.vertexObject !== undefined) {
            gl.enableVertexAttribArray(shader.vertexLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexObject);
            gl.vertexAttribPointer(shader.vertexLocation, 3, gl.FLOAT, false, 0, 0);
        }
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
            gl.enable(gl.BLEND);
        }

        if (object.indexObject !== undefined && object.numIndices !== undefined && object.indexSize !== undefined) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexObject);
            gl.drawElements(gl.TRIANGLES, object.numIndices, object.indexSize, 0);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        if (object.blending !== undefined && object.blending === true) {
            gl.disable(gl.BLEND);
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
                webgl.displayFunc.call(webgl);
                webgl.repaintLoop.frameRendering = false;
            }, 16);
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
                this.mvpLocation       = gl.getUniformLocation(program, "modelViewProjection"),
                this.textureLocation   = gl.getUniformLocation(program, "u_texture"),
                this.vertexLocation    = gl.getAttribLocation(program, "vertex"),
                this.texCoordsLocation = gl.getAttribLocation(program, "texCoords"),
                // set uniform
                gl.uniform1i(this.textureLocation, 0);
                this.loaded = true;
            },
            use: function () {
                gl.useProgram(this.program);
            }
        };
        $.get("shaders/texture/vertex.glsl", function(data) {
            shader.vertexShader = webgl.createShader(webgl.gl, webgl.gl.VERTEX_SHADER, data);
            shader.create.call(shader);
        });
        $.get("shaders/texture/fragment.glsl", function(data) {
            shader.fragmentShader = webgl.createShader(webgl.gl, webgl.gl.FRAGMENT_SHADER, data);
            shader.create.call(shader);
        });
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
                this.mvpLocation          = gl.getUniformLocation(program, "modelViewProjection"),
                this.normalMatrixLocation = gl.getUniformLocation(program, "u_normalMatrix"),
                this.lightDirLocation     = gl.getUniformLocation(program, "u_lightDir"),
                this.vertexLocation       = gl.getAttribLocation(program, "vertex"),
                this.normalLocation       = gl.getAttribLocation(program, "normal"),
                // set uniform
                gl.uniform3f(this.lightDirLocation, 0.5, 0.8, 0.5);
                this.loaded = true;
            },
            use: function () {
                gl.useProgram(this.program);
            }
        };
        $.get("shaders/light/vertex.glsl", function(data) {
            shader.vertexShader = webgl.createShader(webgl.gl, webgl.gl.VERTEX_SHADER, data);
            shader.create.call(shader);
        });
        $.get("shaders/light/fragment.glsl", function(data) {
            shader.fragmentShader = webgl.createShader(webgl.gl, webgl.gl.FRAGMENT_SHADER, data);
            shader.create.call(shader);
        });
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
        });
        $.get("shaders/color/fragment.glsl", function(data) {
            shader.fragmentShader = webgl.createShader(webgl.gl, webgl.gl.FRAGMENT_SHADER, data);
            shader.create.call(shader);
        });
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
    init: function (canvasName, vertexShaderName, fragmentShaderName) {
        var canvas, gl;
        // setup the API
        canvas = document.getElementById(canvasName);
        gl = canvas.getContext("experimental-webgl");
        this.gl = gl;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.systemInfo();

        // create the projection matrix
        this.matrices.init.call(this.matrices);

        // create some objects
        // first a box, textured with a wood texture, which rotates around the y axis
        var object = makeBox(gl);
        object.indexSize = gl.UNSIGNED_BYTE;
        object.loaded = true;
        // TODO: change texture functionality so that it does not render the object before texture is loaded
        object.texture = loadImageTexture(gl, "textures/wood.jpeg");
        object.angle = 0;
        object.shader = this.createTextureShader();
        object.update = function() {
            this.angle = (this.angle + 1) % 360;
        };
        object.model = function() {
            var model = new J3DIMatrix4();
            model.rotate(this.angle, 0.0, 1.0, 0.0);
            return model;
        };
        this.objects[this.objects.length] = object;

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
        this.objects[this.objects.length] = object;

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
