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

		camera.position.z = 20;
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
		const solarSystem = new THREE.Object3D();
		this._scene.add(solarSystem);

		const radius = 1;
		const widthSegments = 12;
		const heightSegments = 12;
		const shperGeometry = new THREE.SphereGeometry(
			radius,
			widthSegments,
			heightSegments
		);
		const sunMaterial = new THREE.MeshPhongMaterial({
			emissive: 0xffff00,
			flatShading: true,
		});

		const sunMesh = new THREE.Mesh(shperGeometry, sunMaterial);
		sunMesh.scale.set(3, 3, 3); // 원래 지오메트리의 크기 보다 3배씩 더 크게 하기 위해 설정
		solarSystem.add(sunMesh);

		const earthOrbit = new THREE.Object3D();
		solarSystem.add(earthOrbit);

		const earthMaterial = new THREE.MeshPhongMaterial({
			color: 0x2233ff,
			emissive: 0x112244,
			flatShading: true,
		});

		const earthMesh = new THREE.Mesh(shperGeometry, earthMaterial);
		earthOrbit.position.x = 10;
		earthOrbit.add(earthMesh);

		const moonOrbit = new THREE.Object3D();
		moonOrbit.position.x = 2;
		earthOrbit.add(moonOrbit);

		const moonMaterial = new THREE.MeshPhongMaterial({
			clolr: 0x888888,
			emissive: 0x222222,
			flatShading: true,
		});

		const moonMesh = new THREE.Mesh(shperGeometry, moonMaterial);
		moonMesh.scale.set(0.5, 0.5, 0.5);
		moonOrbit.add(moonMesh);

		this._solarSystem = solarSystem;
		this._earthOrbit = earthOrbit;
		this._moonOrbit = moonOrbit;
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

	// 모델의 회전
	update(time) {
		time *= 0.001; //
		// this._solarSystem.rotation.x = time / 2;
		this._solarSystem.rotation.y = time / 2;
		this._earthOrbit.rotation.y = time / 2;
		this._moonOrbit.rotation.y = time / 5;
	}
}

window.onload = function () {
	new App();
};
