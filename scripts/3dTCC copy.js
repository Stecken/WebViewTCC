import * as THREE from '/libdeploy/three.module.js';

import { GUI } from '/libdeploy/dat.gui.module.js';
import { OrbitControls } from '/libdeploy/OrbitControls.js';
import { GLTFLoader } from '/libdeploy/GLTFLoader.js';
import { RGBELoader } from '/libdeploy/RGBELoader.js';

let mesh, renderer, scene, camera, controls;
let gui, guiExposure = null;
let campos3D;
let liga3D = false;
let button3d;

const params = {
    exposure: 1.0,
    toneMapping: 'ACESFilmic'
};

const toneMappingOptions = {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
    Custom: THREE.CustomToneMapping
};

function init3dTCC() {
    liga3D = !liga3D;
    if(liga3D) {
        button3d.innerText = "Desabilitar Visualização 3D";
        init().catch(function (err) {
            console.error(err);
        });
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

async function init() {
    campos3D = document.getElementsByClassName('render-3d');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(campos3D[0].offsetWidth, window.innerHeight - 150);
   
    campos3D[0].appendChild(renderer.domElement);
    console.log(renderer.domElement);
    renderer.toneMapping = toneMappingOptions[params.toneMapping];
    renderer.toneMappingExposure = params.exposure;

    renderer.outputEncoding = THREE.sRGBEncoding;

    // Set CustomToneMapping to Uncharted2
    // source: http://filmicworlds.com/blog/filmic-tonemapping-operators/

    THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
        'vec3 CustomToneMapping( vec3 color ) { return color; }',
        `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
					float toneMappingWhitePoint = 1.0;
					vec3 CustomToneMapping( vec3 color ) {
						color *= toneMappingExposure;
						return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
					}`
    );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(- 1.8, 0.6, 2.7);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.target.set(0, 0, - 0.2);
    controls.update();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const rgbeLoader = new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('/libdeploy/equirectangular/');

    const gltfLoader = new GLTFLoader().setPath('/libdeploy/glTF/');

    const [texture, gltf] = await Promise.all([
        rgbeLoader.loadAsync('venice_sunset_1k.hdr'),
        gltfLoader.loadAsync('Montagem_F2.gltf'),
    ]);

    // environment

    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    scene.background = envMap;
    scene.environment = envMap;

    texture.dispose();
    pmremGenerator.dispose();

    // model

    console.log(gltf)
    window.gltf = gltf
    window.scene = scene
    gltf.scene.traverseVisible((child) => {
        if (child instanceof THREE.Mesh) {
            mesh = child;
            scene.add(mesh);
        }
    });

    render();

    window.addEventListener('resize', onWindowResize);

    let gui = new GUI({ autoPlace: true });
    new GUI({

    });
    gui.domElement.id = "render";
}

function updateGUI() {

    if (guiExposure !== null) {

        gui.remove(guiExposure);
        guiExposure = null;

    }

    if (params.toneMapping !== 'None') {

        guiExposure = gui.add(params, 'exposure', 0, 2)

            .onChange(function () {

                renderer.toneMappingExposure = params.exposure;
                render();

            });

    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(campos3D[0].offsetWidth, window.innerHeight - 150);

    render();

}

function render() {

    renderer.render(scene, camera);

}