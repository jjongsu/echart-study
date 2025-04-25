import BasicClass from './basicClass.js';

export default class Blood1Class extends BasicClass {
	/** response data 기준으로 parsing하는데 도와주는 상수 */
	static NAME_INFO = { 신환: 'newPatients', 재환: 'followUpPatients', 달성률: 'rate' };
	/** 그래프에 들어가는 막대 옵션 */
	static BAR_OPTIONS = { type: 'bar', yAxisIndex: 0 };
	/** 그래프에 들어가는 라인 옵션 */
	static LINE_OPTIONS = { type: 'line', yAxisIndex: 1 };
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['신환', '재환', '달성률'],
			left: 'right',
			top: 'middle',
			orient: 'vertical',
			formatter: () => '',
		},
		xAxis: {
			type: 'category',
			splitLine: {
				show: false,
			},
			data: [],
			// data: response.map(
			// 	(el) => `${new Date(el.name).getHours().toString().padStart(2, '0')}:${new Date(el.name).getMinutes().toString().padStart(2, '0')}`
			// ),
		},
		yAxis: [
			{
				type: 'value',
				name: '',
				min: 0,
				max: 250,
				interval: 50,
				axisLine: {
					show: false,
				},
				axisStick: {
					show: false,
				},
				splitLine: {
					show: false,
				},
			},
			{
				type: 'value',
				name: '달성률',
				min: 0,
				max: 100,
				show: false,
			},
		],
		series: [
			{
				...Blood1Class.BAR_OPTIONS,
				name: '신환',
				data: [],
			},
			{
				...Blood1Class.BAR_OPTIONS,
				name: '재환',
				data: [],
			},
			{
				...Blood1Class.LINE_OPTIONS,
				name: '달성률',
				yAxis: 1,
				data: [],
			},
		],
	};

	constructor({ elementId, options }) {
		super({ elementId, options: { ...Blood1Class.BASE_OPTIONS, ...options } });
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...Blood1Class.BASE_OPTIONS, ...options };
		super.setOptions(this.options);
	}

	setData(response) {
		const _xAxisData = response.map(
			(el) => `${new Date(el.name).getHours().toString().padStart(2, '0')}:${new Date(el.name).getMinutes().toString().padStart(2, '0')}`
		);

		const _seriesData = Blood1Class.BASE_OPTIONS.series.map((el) => {
			const title = Blood1Class.NAME_INFO[el.name || '신환'];
			return { ...el, data: response.map((el) => ({ name: el.name, value: el.data[title] })) };
		});

		const _options = { xAxis: { ...this.options.xAxis, data: _xAxisData }, series: _seriesData };

		this.setOptions(_options);
	}
}
