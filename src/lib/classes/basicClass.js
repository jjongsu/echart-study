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

		this.element.addEventListener('resize', this.resizeEventFunc);

		// [TODO]: 이벤트 리스너 처리 필요! removeEventListener
		// window.addEventListener('resize', this.resizeEventFunc);
	}

	setOptions(options) {
		if (!this.myChart || !options) return;

		this.options = options;
		this.myChart.setOption(options);
	}

	resize() {
		this.myChart.resize();
	}

	getImage({ pixelRatio, backgroundColor, excludeComponents }) {
		const img = this.myChart.getDataURL({
			type: 'png',
			pixelRatio,
			backgroundColor,
			excludeComponents,
		});

		// 다운로드용 링크 생성
		const link = document.createElement('a');
		link.href = img;
		link.download = 'chart.png';
		link.click();

		return img;
	}
}
