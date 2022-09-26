import * as THREE from "three";
import { Vertex } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as dat from "dat.gui";
import gasp from "gsap";

//shaders
import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";

// colors
const colors = require("nice-color-palettes");

let rnd = Math.floor(Math.random() * colors.length);
// rnd = 19;
let pallete = colors[rnd];

pallete = pallete.map((color) => new THREE.Color(color));

export default class sketch {
  constructor(options) {
    this.time = 0;
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 0.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xffffff, 1);
    this.container.appendChild(this.renderer.domElement);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.setupResize();
    this.addObjects();
    this.render();
    this.resize();
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.imageAspect = 853 / 1280;
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 100, 100);

    this.material = new THREE.ShaderMaterial({
      extension: "#extension GL_OES_standard_derivatives: enable",
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uColor: { value: pallete },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      wireframe: false,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  // stop() {
  //   this.isPlaying = false;
  // }

  // stop() {
  //   if (!this.isPlaying) {
  //     this.render();
  //     this.isPlaying = false;
  //   }
  // }

  render() {
    // if (!this.isPlaying) return;
    this.time += 0.0002;
    // this.scene.rotation.x = this.time;
    // this.scene.rotation.y = this.time;
    // this.mesh.rotation.x = this.time / 2000;
    // this.mesh.rotation.y = this.time / 1000;
    this.material.uniforms.time.value = this.time;
    window.requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new sketch({
  dom: document.getElementById("container"),
});
