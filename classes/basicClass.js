export default class BasicClass {
	constructor({ elementId, options }) {
		this.elementId = elementId;
		this.options = options;

		this.setInit();
		this.setOptions();
	}

	setInit() {
		this.myChart = echarts.init(document.getElementById(this.elementId));
	}

	setOptions() {
		this.myChart.setOption(this.options);
	}
}
