import BasicClass from './basicClass.js';

export default class VisitorClass extends BasicClass {
	/** 그래프에 들어가는 보통의 옵션 */
	static COMMON_OPTIONS = {
		type: 'line',
		smooth: 0.5,
		smoothMonotone: 'x',
		areaStyle: {
			opacity: 0.1,
		},
		symbol: 'none',
	};
	/** 그래프에 들어가는 하나의 옵션 */
	static UNIQUE_OPTIONS = {
		type: 'line',
		smooth: 0.5,
		smoothMonotone: 'x',
		symbolSize: 6,
		areaStyle: {
			opacity: 0.2,
		},
	};
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		tooltip: {
			trigger: 'axis',
			// formatter: '{a1}|{b2}|{c}',
		},
		legend: {
			data: ['year', 'month', 'week', 'day'],
			icon: 'circle',
		},
		grid: {
			top: '10%',
			left: '10%',
			right: '10%',
			bottom: '10%',
		},
		xAxis: {
			type: 'category',
			splitLine: {
				show: false,
			},
			data: [],
		},
		yAxis: {
			type: 'value',
			min: 0,
			max: 1500,
			interval: 500,
		},
		series: [
			{
				...VisitorClass.COMMON_OPTIONS,
				name: 'day',
				data: [],
			},
			{
				...VisitorClass.UNIQUE_OPTIONS,
				name: 'year',
				data: [],
			},
			{
				...VisitorClass.COMMON_OPTIONS,
				name: 'month',
				data: [],
			},
			{
				...VisitorClass.COMMON_OPTIONS,
				name: 'week',
				data: [],
			},
		],
	};

	constructor({ elementId, options }) {
		super({ elementId, options: { ...VisitorClass.BASE_OPTIONS, ...options } });
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...VisitorClass.BASE_OPTIONS, ...options };
		super.setOptions(this.options);
	}

	setData(response) {
		const _xAxisData = response.map(
			(el) => `${new Date(el.time).getHours().toString().padStart(2, '0')}:${new Date(el.time).getMinutes().toString().padStart(2, '0')}`
		);

		const _seriesData = VisitorClass.BASE_OPTIONS.series.map((el) => {
			return { ...el, data: response.map((res) => ({ name: res.time, value: res.data[el.name] })) };
		});

		const _options = { xAxis: { data: _xAxisData }, series: _seriesData };

		this.setOptions(_options);
	}
}
