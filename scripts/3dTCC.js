import * as THREE from '/libdeploy/three.module.js';

import { DDSLoader } from '/libdeploy/DDSLoader.js';
import { MTLLoader } from '/libdeploy/MTLLoader.js';
import { OBJLoader } from '/libdeploy/OBJLoader.js';
import { OrbitControls } from '/libdeploy/OrbitControls.js';

let camera, scene, renderer, controls;
let container;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let liga3D, button3d

function init3dTCC() {
    liga3D = !liga3D;
    if (liga3D) {
        button3d.innerText = "Desabilitar Visualização 3D";
        init();
        animate();
    }
    else {
        button3d.innerText = "Habilitar Visualização 3D";
        campos3D[0].childNodes[1].remove();
    }
}

$(document).ready(() => {
    button3d = document.querySelector('#button-3d-active');
    button3d.addEventListener('click', init3dTCC);
});


function init() {

    container = document.getElementById('render');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 7000);
    camera.position.z = 5000;

    // scene

    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

    // model

    const onProgress = function (xhr) {

        if (xhr.lengthComputable) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');

        }

    };

    const onError = function () { };

    const manager = new THREE.LoadingManager();
    manager.addHandler(/\.dds$/i, new DDSLoader());

    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );

    new MTLLoader(manager)
        .setPath('/libdeploy/glTF/')
        .load('Montagem_Final.mtl', function (materials) {

            materials.preload();

            new OBJLoader(manager)
                .setMaterials(materials)
                .setPath('/libdeploy/glTF/')
                .load('Montagem_Final.obj', function (object) {
                    window.object = object;
                    object.position.x = -250;
                    object.position.y = -300;
                    object.rotateZ(-1.5831853071795867);
                    object.rotateX(3.140868240812233);
                    object.rotateY(4.8);
                    scene.add(object);

                }, onProgress, onError);

        });

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, window.innerHeight - 150);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.target.set(0, 0, - 0.2);
    controls.update();

    document.addEventListener('mousemove', onDocumentMouseMove);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(container.offsetWidth, window.innerHeight - 150);

    render();

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;

}

//

function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    renderer.render(scene, camera);

}