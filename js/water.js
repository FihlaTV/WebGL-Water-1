
var canvas = null;
var gl = null;

var camera = null;
var skybox = null;
var grid = null;

var currentlyPressedKeys = {};

var deltaTime = 0;
var lastFrame = 0;

var lastX = 0;
var lastY = 0;

window.onload = function() {
    canvas = document.getElementById('glcanvas');
    try {
        gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl", {antialias: true}));
        let uint = gl.getExtension("OES_element_index_uint");
        let displayWidth = document.getElementById('container').clientWidth;
        let displayHeight = document.getElementById('container').clientHeight;
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewportWidth = displayWidth;
        gl.viewportHeight = displayHeight;
        lastX = displayHeight/2;
        lastY = displayWidth/2;
    }
    catch(e) {
    }
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousemove = handelMouse;
    init();

};

function init(){

    camera =  new Camera([0.0, 5.0, 0.0],[0.0, 1.0, 0.0],[0.0, 0.0, -1.0]);
    grid = new Grid("textures/waternormal3.jpg",gl);
    skybox = new Skybox("textures/skybox/mountain-brun/",gl);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    tick();
}

function tick() {
    requestAnimFrame(tick);

    let d = new Date();
    let currentFrame = d.getTime();
    deltaTime = currentFrame - lastFrame;
    lastFrame = currentFrame;

    resizeCanvas();
    handleKeys();
    animate();
    drawScene();
}


function drawScene(){

        var projection = mat4.create();
        mat4.perspective(projection, degToRad(80),gl.viewportWidth / gl.viewportHeight, 0.01, 1000000.0);

        var view = camera.getViewMatrix();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT,gl.DEPTH_BUFFER_BIT);

        grid.draw(view,projection,skybox,camera);

        skybox.draw(view,projection);

}

function animate() {
    grid.animate();
}

function resizeCanvas() {
    let displayWidth = document.getElementById('container').clientWidth;
    let displayHeight = document.getElementById('container').clientHeight;

    if (gl.viewportWidth !== displayWidth || gl.viewportHeight !== displayHeight) {
        gl.viewportWidth = displayWidth;
        gl.viewportHeight = displayHeight;
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

function degToRad(degrees) {
    return (degrees * Math.PI / 180.0);
}

function handleKeys() {
    if ( currentlyPressedKeys[65]) { // A
        camera.processKeyboard(2,deltaTime);
    } else if (currentlyPressedKeys[68]) { // D
        camera.processKeyboard(3,deltaTime);
    } else if ( currentlyPressedKeys[87]) { // W
        camera.processKeyboard(0,deltaTime);
    } else if (currentlyPressedKeys[83]) { // S
        camera.processKeyboard(1,deltaTime);
    }
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handelMouse(event) {

    let xoffset = event.clientX - lastX;
    let yoffset = lastY - event.clientY ;

    lastX = event.clientX ;
    lastY = event.clientY;

    camera.processMouseMovement(xoffset, yoffset);
}


