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

	getImage({ pixelRatio, backgroundColor, excludeComponents, isPdf = false }) {
		const img = this.myChart.getDataURL({
			type: 'png',
			pixelRatio,
			backgroundColor,
			excludeComponents,
		});

		if (!isPdf) {
			// 다운로드용 링크 생성
			const link = document.createElement('a');
			link.href = img;
			link.download = 'chart.png';
			link.click();
			link.remove();

			// img element 제거
			img.remove();
		} else {
			return img;
		}
	}

	getPdf() {
		if (!this.element) return;
		// image element 생성
		const imgElement = this.getImage({ isPdf: true });
		// 현재 modal에 띄워져 있는 그래프에서 width, height값 추출
		const { clientWidth, clientHeight } = this.myChart.getDom();

		const { jsPDF } = window.jspdf;
		const options = {
			unit: 'mm',
			format: [clientWidth + 20, clientHeight + 20],
		};

		// 가로가 세로보다 길면 jspdf 생성 시 orientation 'l'속성 추가
		if (clientWidth >= clientHeight) {
			options['orientation'] = 'l';
		}

		// jsPDF에서 이미지 추가 후 저장
		const doc = new jsPDF(options);
		doc.addImage(imgElement, 'PNG', 10, 10, clientWidth, clientHeight);
		doc.save('chart.pdf');

		// img element 제거
		imgElement?.remove();
	}
}
