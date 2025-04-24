export default class BasicClass {
	constructor({ elementId, options }) {
		this.elementId = elementId;
		this.options = options;

		this.setInit();
		this.setOptions();
	}

	setInit() {
		if (!document.getElementById(this.elementId)) return;
		this.myChart = echarts.init(document.getElementById(this.elementId));
	}

	setOptions() {
		if (!this.myChart) return;
		this.myChart.setOption(this.options);
	}
}
