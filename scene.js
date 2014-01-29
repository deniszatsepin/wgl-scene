var glMatrix = require('gl-matrix');
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;
var mat4 = glMatrix.mat4;
var toRad = function (grad) {
	return grad * Math.PI / 180;
};

module.exports = function (context) {
	var gl = context;

	function Scene() {
		Scene.prototype.init.apply(this, arguments);
	}

	Scene.prototype.init = function (options) {
		this.color = options.color || vec4.fromValues(0.0, 0.0, 0.0, 1.0);
		this.width = options.width;
		this.height = options.height;
		this.near = options.near || 0.1;
		this.far = options.far || 100.0;
		this.mvMatrix = mat4.create(); // The Model-View matrix
		this.pMatrix = mat4.create(); // The projection matrix
		this.tree = [];


		mat4.perspective(this.pMatrix, toRad(45), this.width / this.height, this.near, this.far);
		var vec = vec3.fromValues(0.0, 0.0, -5.0);
		mat4.translate(this.mvMatrix, this.mvMatrix, vec);
	};

	Scene.prototype.draw = function () {
		var tree = this.tree;
		gl.clearColor.apply(gl, this.color);
		gl.enable(gl.DEPTH_TEST);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, this.width, this.height);
		for (var i = 0, len = tree.length; i < len; i += 1) {
			var element = tree[i];
			element.beforeRender(this.mvMatrix, this.pMatrix);
			element.render();
			element.afterRender();
		}
	};

	Scene.prototype.add = function (element) {
		this.tree.push(element);
	};

	return Scene;
};