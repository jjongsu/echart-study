import BasicClass from './basicClass.js';

export default class OperateClass extends BasicClass {
	/** response data 기준으로 parsing하는데 도와주는 상수 */
	static NAME_INFO = { '예상 검사/ 수술 수': 'expectNum', '실행 검사 / 수술 수': 'operateNum', 달성률: 'rate' };
	/** 그래프에 들어가는 막대 옵션 */
	static BAR_OPTIONS = { type: 'bar' };
	/** 그래프에 들어가는 라인 옵션 */
	static LINE_OPTIONS = { type: 'line' };
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['예상 검사/ 수술 수', '실행 검사 / 수술 수', '달성률'],
			icon: 'circle',
			itemGap: 3,
			itemWidth: 10,
		},
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
		yAxis: [
			{
				type: 'value',
				min: 0,
				max: 100,
				interval: 25,
				axisLabel: {
					formatter: function (value) {
						return `${value}%`;
					},
				},
			},
		],
		grid: {
			top: '20%',
			left: '15%',
			right: '10%',
			bottom: '10%',
		},
		series: [
			{
				...OperateClass.BAR_OPTIONS,
				barGap: '60%',
				name: '예상 검사/ 수술 수',
				data: [],
				// data: response.map((el) => ({ name: el.name, value: el.data.expectNum })),
				itemStyle: {
					color: '#47575c',
					borderRadius: [50, 50, 0, 0],
				},
			},
			{
				...OperateClass.BAR_OPTIONS,
				name: '실행 검사 / 수술 수',
				barGap: '-60%',
				data: [],
				// data: response.map((el) => ({ name: el.name, value: el.data.operateNum })),
				itemStyle: {
					color: '#21c8ff',
					borderRadius: [50, 50, 0, 0],
				},
			},
			{
				...OperateClass.LINE_OPTIONS,
				name: '달성률',
				data: [],
				// data: response.map((el) => ({ name: el.name, value: el.data.rate })),
				itemStyle: {
					color: '#f5e076',
				},
			},
		],
	};

	constructor({ elementId, options }) {
		super({ elementId, options: { ...OperateClass.BASE_OPTIONS, ...options } });
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...OperateClass.BASE_OPTIONS, ...options };
		super.setOptions(this.options);
	}

	setData(response) {
		const _xAxisData = response.map(
			(el) => `${new Date(el.time).getHours().toString().padStart(2, '0')}:${new Date(el.time).getMinutes().toString().padStart(2, '0')}`
		);

		const _seriesData = OperateClass.BASE_OPTIONS.series.map((el) => {
			const title = OperateClass.NAME_INFO[el.name || '예상 검사/ 수술 수'];
			return { ...el, data: response.map((el) => ({ name: el.time, value: el.data[title] })) };
		});

		const _options = { xAxis: { ...this.options.xAxis, data: _xAxisData }, series: _seriesData };

		this.setOptions(_options);
	}
}
