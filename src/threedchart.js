import * as THREE from 'three';
import { OPTIONSCFG } from './const';
import configOpts from './config-opts';
import Chart from './chart/chart';

const DEFAULTCAMERADISTANCE = 17;

class Threedchart {

	// opts
	el;
	colors;

	// hud opts
	showLegend;

	// threejs
	camera;
	scene;
	renderer;

	// other
	chart;
	hud;

	constructor(opts = { }) {
		opts = configOpts(OPTIONSCFG, opts);
		this.el = opts.el;
		this.colors = opts.colors;
		for (let k in opts) {
			this[k] = opts[k];
		}

		// el option

		if (!this.el) {
			throw new Error('Invalid "el" option.');
		}

		// renderer

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	    this.camera.position.z = DEFAULTCAMERADISTANCE;

	    this.scene = new THREE.Scene();

	    this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.el.appendChild(this.renderer.domElement);

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.renderer.setClearColor(this.colors.background, 1);
		this.renderer.clear();

		this.onResize();
		window.addEventListener('resize', this.onResize.bind(this));

		// chart

		this.chart = Chart.factory({
			type: opts.type,
			colors: opts.colors,
			title: opts.title,
			xLabel: opts.xLabel,
			yLabel: opts.yLabel,
			xPrefix: opts.xPrefix,
			yPrefix: opts.yPrefix,
			xSuffix: opts.xSuffix,
			ySuffix: opts.ySuffix,
			data: opts.data,
		});

		// hud
	}

	destroy() {
		window.removeEventListener('resize', this.onResize.bind(this));
	}

	setData(data) {
		//#TODO
	}

	onResize() {
		let { width, height } = this.el.getBoundingClientRect();
		height = height || 200;
		this.renderer.setSize(width, height);
		this.camera.aspect = (width > height) ? width / height : height / width;
		// this.camera.target.position.set(0, 0, 0);
		this.renderer.render(this.scene, this.camera);
	}

}

export default Threedchart;
