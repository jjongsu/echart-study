import BasicClass from './basicClass.js';

export default class CTClass extends BasicClass {
	/** response data 기준으로 parsing하는데 도와주는 상수 */
	static NAME_INFO = { 병동: 'wardPatients', 신환: 'newPatients', 재환: 'followUpPatients', 달성률: 'rate' };
	/** 그래프에 들어가는 막대 옵션 */
	static BAR_OPTIONS = { type: 'bar', stack: 'total', yAxisIndex: 0, barWidth: '100%' };
	/** 그래프에 들어가는 라인 옵션 */
	static LINE_OPTIONS = { type: 'line', yAxisIndex: 1, symbol: 'none' };
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['병동', '신환', '재환', '달성률'],
		},
		yAxis: [
			{
				type: 'value',
				name: '',
				min: 0,
				max: 1000,
				interval: 500,
			},
			{
				type: 'value',
				name: '달성률',
				min: 0,
				max: 100,
				show: false,
			},
		],
		xAxis: {
			type: 'category',
			splitLine: {
				show: false,
			},
			data: [],
			axisTick: {
				show: false,
			},
		},
		grid: {
			top: '15%',
			left: '15%',
			right: '10%',
			bottom: '10%',
		},
		series: [
			{
				...CTClass.BAR_OPTIONS,
				name: '병동',
				data: [],
			},
			{
				...CTClass.BAR_OPTIONS,
				name: '신환',
				data: [],
			},
			{
				...CTClass.BAR_OPTIONS,
				name: '재환',
				data: [],
			},
			{
				...CTClass.LINE_OPTIONS,
				name: '달성률',
				data: [],
			},
		],
	};

	constructor({ elementId, options }) {
		super({ elementId, options: { ...CTClass.BASE_OPTIONS, ...options } });
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...CTClass.BASE_OPTIONS, ...options };
		super.setOptions(this.options);
	}

	setData(response) {
		const _xAxisData = response.map(
			(el) => `${new Date(el.time).getHours().toString().padStart(2, '0')}:${new Date(el.time).getMinutes().toString().padStart(2, '0')}`
		);

		const _seriesData = CTClass.BASE_OPTIONS.series.map((el) => {
			const title = CTClass.NAME_INFO[el.name || '병동'];
			return { ...el, data: response.map((el) => ({ name: el.time, value: el.data[title] })) };
		});

		const _options = { xAxis: { ...this.options.xAxis, data: _xAxisData }, series: _seriesData };

		this.setOptions(_options);
	}
}
