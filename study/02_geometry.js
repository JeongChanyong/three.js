import * as THREE from "../build/three.module.js";

import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

// 윈도우가 로드 되면 App Class 실행
class App {
	constructor() {
		// _ 시작하는 경우 자바로 비교하면 privite >> App Class 내에서만 사용 해야 한다.

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

	// 카메라 객체와 마우스 이벤트를 받는 dom 요소 필요
	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.x = 70;
		camera.position.z = 4;
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
		const fontLoader = new THREE.FontLoader();
		async function loadFont(that) {
			const url = "../examples/fonts/helvetiker_bold.typeface.json";
			const font = await new Promise((resolve, reject) => {
				fontLoader.load(url, resolve, undefined, reject);
			});

			const geometry = new THREE.TextGeometry("GIS", {
				font: font,
				size: 5,
				height: 1.5,
				curveSegments: 4,
			});
		}

		loadFont(this);
	}

	// _setupModel() {
	// 	const shape = new THREE.Shape();

	// 	// 정사각형을 그리기
	// 	// shape.moveTo(1, 1);
	// 	// shape.lineTo(1, -1);
	// 	// shape.lineTo(-1, -1);
	// 	// shape.lineTo(-1, 1);
	// 	// shape.closePath();

	// 	const x = -2.5,
	// 		y = -5;
	// 	shape.moveTo(x + 2.5, y + 2.5);
	// 	shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);

	// 	const geometry = new THREE.BufferGeometry();
	// 	const points = shape.getPoints();
	// 	geometry.setFromPoints(points);

	// 	const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
	// 	const line = new THREE.Line(geometry, material);

	// 	this._scene.add(line);
	// }

	// _setupModel() {
	// 	const geometry = new THREE.TorusKnotGeometry(0.6, 0.1, 64, 32, 3, 4);

	// 	// const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });
	// 	const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
	// 	const cube = new THREE.Mesh(geometry, fillMaterial);
	// 	// 색상 변경

	// 	// 사각형의 라인 그리기
	// 	const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
	// 	const line = new THREE.LineSegments(
	// 		new THREE.WireframeGeometry(geometry), // WireframeGeometry 를 추가 안하면 모델의 외곽선 표시 안됨
	// 		lineMaterial
	// 	);

	// 	const group = new THREE.Group();
	// 	group.add(cube);
	// 	group.add(line);

	// 	this._scene.add(group);
	// 	this._cube = group;
	// }

	// _setupModel() {
	// 	class CustomSinCurve extends THREE.Curve {
	// 		constructor(scale) {
	// 			super();
	// 			this.scale = scale;
	// 		}
	// 		getPoint(t) {
	// 			const tx = t * 3 - 1.5;
	// 			const ty = Math.sin(2 * Math.PI * t);
	// 			const tz = 0;
	// 			return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
	// 		}
	// 	}

	// 	const path = new CustomSinCurve(4);
	// 	const geometry = new THREE.TubeGeometry(path);

	// 	const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
	// 	const cube = new THREE.Mesh(geometry, fillMaterial);

	// 	const group = new THREE.Group();
	// 	group.add(cube);
	// 	this._scene.add(group);
	// }

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

	// 모델의 회전
	update(time) {
		time *= 0.001; //
		// this._cube.rotation.x = time;
		// this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
