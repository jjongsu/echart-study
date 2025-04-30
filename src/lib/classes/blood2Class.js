import BasicClass from './basicClass.js';

const titleIndex = {
	0: { en: 'cancer2F', ko: '암병원 2F' },
	1: { en: 'cancer1F', ko: '암병원 1F' },
	2: { en: 'center2F', ko: '본관 2F' },
	3: { en: 'center1F', ko: '본관 1F' },
};
const title = Object.values(titleIndex).map((el) => el.ko);

/**
 * 사용 X
 */
export default class Blood2Class extends BasicClass {
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		tooltip: {
			position: 'top',
		},
		grid: {
			height: '60%',
			top: '10%',
			left: '10%',
		},
		xAxis: {
			type: 'category',
			data: [],
			splitArea: {
				show: true,
			},
		},
		yAxis: {
			type: 'category',
			data: title,
			splitArea: {
				show: true,
			},
		},
		visualMap: {
			type: 'piecewise',
			splitNumber: 10,
			min: 0,
			max: 10,
			top: 'top',
			calculable: true,
			realtime: false,
			inRange: {
				color: ['#104361', '#1D3F73', '#293A84', '#363696', '#4331A7', '#4F2DB9', '#5C28CA', '#6924DC', '#751FED', '#821BFF', '#a50026'],
			},
			showLabel: false,
			itemGap: 0,
			itemSymbol: 'rect',
		},
		series: [
			{
				type: 'heatmap',
				data: [],
				label: {
					show: false,
				},
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};

	constructor({ elementId, options }) {
		super({ elementId, options: { ...Blood2Class.BASE_OPTIONS, ...options } });
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...Blood2Class.BASE_OPTIONS, ...options };
		super.setOptions(this.options);
	}

	setData(response) {
		const _xAxisData = response.map(
			(el) => `${new Date(el.time).getHours().toString().padStart(2, '0')}:${new Date(el.time).getMinutes().toString().padStart(2, '0')}`
		);

		const _heatmapData = response.reduce((a, b, i) => {
			const _data = [];
			for (let index = 0; index < 4; index++) {
				const elementData = [i, index, b.data[titleIndex[index].en] || '-'];
				_data.push(elementData);
			}
			return [...a, ..._data];
		}, []);

		const _seriesData = Blood2Class.BASE_OPTIONS.series.map((el) => {
			return { ...el, data: _heatmapData };
		});

		const _options = { xAxis: { ...this.options.xAxis, data: _xAxisData }, series: _seriesData };

		this.setOptions(_options);
	}
}
