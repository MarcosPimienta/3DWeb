// Three.js - PostProcessing
// from https://threejsfundamentals.org/threejs/threejs-postprocessing.html


import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/RenderPass.js';
import {BloomPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/BloomPass.js';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/FilmPass.js';

let scene, camera, renderer, cloudParticles, canvas, composer;
function main()
{
    canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({canvas});
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;

    scene = new THREE.Scene();
    {
        let ambient = new THREE.AmbientLight(0x555555);
        scene.add(ambient);
        let directionalLight = new THREE.DirectionalLight(0xff8c19);
        directionalLight.position.set(0,0,1);
        scene.add(directionalLight);
        let orangeLight = new THREE.PointLight(0xcc6600,50,450,1.7);
        orangeLight.position.set(200,300,100);
        scene.add(orangeLight);
        let redLight = new THREE.PointLight(0xd8547e,50,450,1.7);
        redLight.position.set(100,300,100);
        scene.add(redLight);
        let blueLight = new THREE.PointLight(0x3677ac,50,450,1.7);
        blueLight.position.set(300,300,200);
        scene.add(blueLight);
        scene.fog = new THREE.FogExp2(0x03544e, 0.001);
        renderer.setClearColor(scene.fog.color);
        /* const color = 0xFFFFFF;
        const intensity = 2;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light); */
    }

    /* const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth); */
    let loader = new THREE.TextureLoader();
    loader.load("https://i.ibb.co/2jbYb5R/smoke-1.png", function(texture)
    {
        var cloudGeo = new THREE.PlaneBufferGeometry(500,500);
        var cloudMaterial = new THREE.MeshLambertMaterial({map:texture, transparent: true});
        for(let p=0; p<50; p++)
        {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
                cloud.position.set
                (
                    Math.random()*800 -400,
                    500,
                    Math.random()*500-500
                );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*2*Math.PI;
            cloud.material.opacity = 0.55;
            cloudParticles.push(cloud);
            scene.add(cloud);
        }
    });

    /* function makeInstance(geometry, color, x)
    {
        const material = new THREE.MeshPhongMaterial({color});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = x;
        return cube;
    } */

    /* const cubes =
    [
        makeInstance(geometry, 0x44aa88,  0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844,  2),
    ]; */

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new BloomPass
    (
        1,    // strength
        25,   // kernel size
        4,    // sigma ?
        256,  // blur render target resolution
    );
    composer.addPass(bloomPass);

    const filmPass = new FilmPass
    (
        0.35,   // noise intensity
        0.025,  // scanline intensity
        648,    // scanline count
        false,  // grayscale
    );
    filmPass.renderToScreen = true;
    composer.addPass(filmPass);

    function resizeRendererToDisplaySize(renderer)
    {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
        renderer.setSize(width, height, false);
        }
        return needResize;
    }

    let then = 0;
    function render(now)
    {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

            if (resizeRendererToDisplaySize(renderer))
            {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
                composer.setSize(canvas.width, canvas.height);
            }

        cubes.forEach((cube, ndx) =>
        {
            const speed = 1 + ndx * .1;
            const rot = now * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        composer.render(deltaTime);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();
