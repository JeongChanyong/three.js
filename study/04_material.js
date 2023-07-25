import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

// 윈도우가 로드 되면 App Class 실행
class App {
	constructor() {
		// _ 시작하는 경우 자바로 비교하면 privite App Class 내에서만 사용 해야 한다.

		const divContainer = document.querySelector("#webgl-container");
		// 다른 method에서 참조 하기 위해 필드 설정
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
	}

	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 7;
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff; // 광원의 색상
		const intensity = 1; // 광원의 세기
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4); // 광원의 위치
		this._scene.add(light); // 광원 추가
	}

	_setupModel() {
		const vertices = [];

		for (let i = 0; i < 10000; i++) {
			const x = THREE.MathUtils.randFloatSpread(5);
			const y = THREE.MathUtils.randFloatSpread(5);
			const z = THREE.MathUtils.randFloatSpread(5);

			vertices.push(x, y, z);
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(vertices, 3) // 배열의 갯수 3
		);

		const sprite = new THREE.TextureLoader().load(
			"../examples/textures/sprites/disc.png"
		);

		const material = new THREE.PointsMaterial({
			map: sprite,
			alphaTest: 0.5,
			color: "#00ffff",
			size: 0.1,
			sizeAttenuation: true, // 카메라의 줌인 줌 아웃 상태에 따라 point의 크기 size에 따라 모양이 다르게 보임
		});

		const points = new THREE.Points(geometry, material);
		this._scene.add(points);
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
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001; //
		// this._cube.rotation.x = time;
		// this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
