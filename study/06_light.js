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

		//X 축은 붉은색, Y 축은 녹색, Z 축은 파란색
		const axes = new THREE.AxesHelper(5);
		this._scene.add(axes);
	}

	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);

		// camera.position.z = 10;
		camera.position.set(7, 7, 0);
		// camera.lookAt(0, 0, 0);

		this._camera = camera;
	}

	_setupLight() {
		// 주변광
		const light = new THREE.AmbientLight(0xffffff, 5);
		this._scene.add(light);
		this._light = light;
	}

	_setupModel() {
		const groundGeometry = new THREE.PlaneGeometry(10, 10);
		const groundMaterial = new THREE.MeshStandardMaterial({
			color: "#2c3e50",
			roughness: 0.5,
			metalness: 0.5,
			side: THREE.DoubleSide,
		});

		const groud = new THREE.Mesh(groundGeometry, groundMaterial);
		groud.rotation.x = THREE.MathUtils.degToRad(-90);
		this._scene.add(groud);

		const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
		const bigSphereMaterial = new THREE.MeshStandardMaterial({
			color: "#ffffff",
			roughness: 0.1,
			metalness: 0.2,
		});

		const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
		bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
		this._scene.add(bigSphere);

		const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
		const torusMaterial = new THREE.MeshStandardMaterial({
			color: "#9B59b6",
			roughness: 0.5,
			metalness: 0.9,
		});

		for (let i = 0; i < 8; i++) {
			const torusPivot = new THREE.Object3D();
			const torus = new THREE.Mesh(torusGeometry, torusMaterial);
			torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
			torus.position.set(3, 0.5, 0);
			torusPivot.add(torus);
			this._scene.add(torusPivot);
		}

		const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
		const smallSphereMaterial = new THREE.MeshStandardMaterial({
			color: "#e74c3c",
			roughness: 0.2,
			metalness: 0.5,
		});

		const smallSpherePivot = new THREE.Object3D();
		const smallSphere = new THREE.Mesh(
			smallSphereGeometry,
			smallSphereMaterial
		);

		smallSpherePivot.add(smallSphere);
		smallSpherePivot.name = "smallSpherePivot";
		smallSphere.position.set(3, 0.5, 0);
		this._scene.add(smallSpherePivot);
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
	}
}

window.onload = function () {
	new App();
};
