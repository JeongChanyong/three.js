import * as THREE from "../build/three.module.js";
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "../examples/jsm/controls/FirstPersonControls.js";
import { PointerLockControls } from "../examples/jsm/controls/PointerLockControls.js";

// 윈도우가 로드 되면 App Class 실행

class App {
	constructor() {
		// _ 시작하는 경우 자바로 비교하면 privite App Class 내에서만 사용 해야 한다.
		const divContainer = document.querySelector("#webgl-container");

		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antiialias: true }); // antiialias : 3차원 장면이 렌더링 될때 object 경계선이 부드럽게 표현
		renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

		// 카메라, 광원, 모델
		this._setupCamera();
		this._setupLight();
		this._setupModel();
		this._setupControls();

		window.onresize = this.resize.bind(this);
		// 렌더러, 장면을 창 크게 맞게 설정
		this.resize();

		requestAnimationFrame(this.render.bind(this));

		// const helper = new THREE.CameraHelper(this._camera);
		// this._scene.add(helper);

		//X 축은 붉은색, Y 축은 녹색, Z 축은 파란색
		// const axes = new THREE.AxesHelper(5);
		// this._scene.add(axes);
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);

		camera.position.z = 50;
		camera.position.set(80, 80, 10);
		camera.lookAt(0, 0, 0);
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff; // 광원의 색상
		const intensity = 1; // 광원의 세기
		const light = new THREE.AmbientLight(color, intensity);
		light.position.set(-1, 2, 4); // 광원의 위치
		this._scene.add(light); // 광원 추가
	}

	_setupModel() {
		const url = "../model/test.glb";
		const loader = new GLTFLoader();

		loader.load(url, (object) => {
			console.log(object);

			const root = object.scene;
			root.position.set(0, 0, 0);
			this._scene.add(root);
			this._root = root;
		});
		undefined,
			function (error) {
				console.error(error);
			};
	}

	_setupControls() {
		const controls = new OrbitControls(this._camera, this._divContainer);
	}

	// 창 크기 변경시 마다 크기를 조정
	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	// 장면의 애니메이션 효과
	render(time) {
		this._renderer.render(this._scene, this._camera);
		// this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}
}

window.onload = function () {
	new App();
};
