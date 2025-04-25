export default class BasicClass {
	constructor({ elementId, options }) {
		this.elementId = elementId;
		this.options = options;

		this.setInit();
		this.setOptions();
	}

	setInit() {
		if (!document.getElementById(this.elementId)) return;
		this.element = document.getElementById(this.elementId);
		this.myChart = echarts.init(this.element);
		this.myChart.setOption(this.options);

		this.resizeEventFunc = () => {
			this.myChart.resize();
		};

		// [TODO]: 이벤트 리스너 처리 필요! removeEventListener
		// window.addEventListener('resize', this.resizeEventFunc);
	}

	setOptions(options) {
		if (!this.myChart || !options) return;

		this.options = options;
		this.myChart.setOption(options);
	}
}
