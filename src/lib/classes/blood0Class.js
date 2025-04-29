import BasicClass from './basicClass.js';

const titleIndex = {
	0: { en: 'cancer2F', ko: '암병원 F1' },
	1: { en: 'cancer1F', ko: '암병원 F1' },
	2: { en: 'center2F', ko: '본관 F1' },
	3: { en: 'center1F', ko: '본관 F2' },
};
const title = Object.values(titleIndex).map((el) => el.ko);

export default class Blood0Class extends BasicClass {
	/** response data 기준으로 parsing하는데 도와주는 상수 */
	static NAME_INFO = { 신환: 'newPatients', 재환: 'followUpPatients', 달성률: 'rate' };
	/** 그래프에 들어가는 막대 옵션 */
	static BAR_OPTIONS = { type: 'bar', xAxisIndex: 0, yAxisIndex: 0 };
	/** 그래프에 들어가는 라인 옵션 */
	static LINE_OPTIONS = { type: 'line', xAxisIndex: 0, yAxisIndex: 1, symbol: 'none' };
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		tooltip: {
			trigger: 'axis',
		},
		legend: [
			{
				data: ['신환', '재환', '달성률'],
				left: 'right',
				icon: 'roundRect',
				orient: 'vertical',
				formatter: () => '',
			},
		],
		grid: [
			{ top: '5%', left: '15%', height: '35%', width: '70%' }, // 첫 번째 차트 위치와 크기
			{ top: '55%', left: '18%', height: '35%', width: '68%' }, // 두 번째 차트 위치와 크기
		],
		xAxis: [
			{
				gridIndex: 0,
				type: 'category',
				splitLine: {
					show: false,
				},
				data: [],
				axisTick: {
					show: false,
				},
			},
			{
				gridIndex: 1,
				type: 'category',
				data: [],
				splitArea: {
					show: true,
				},
				axisTick: {
					show: false,
				},
			},
		],
		yAxis: [
			{
				gridIndex: 0,
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
				axisLabel: {
					formatter: '{value}%',
				},
			},
			{
				gridIndex: 0,
				type: 'value',
				name: '달성률',
				min: 0,
				max: 100,
				show: false,
			},
			{
				gridIndex: 1,
				type: 'category',
				data: title,
				splitArea: {
					show: true,
				},
				axisLabel: {
					formatter: function (value) {
						const text = value.replaceAll(' ', '\n');
						return text;
					},
					// color: '#FFFFFF',
					fontSize: 8,
				},
				axisTick: {
					show: false,
				},
			},
		],
		visualMap: [
			{
				seriesIndex: 3,
				type: 'piecewise',
				splitNumber: 10,
				min: 0,
				max: 10,
				calculable: true,
				realtime: false,
				inRange: {
					color: ['#104361', '#1D3F73', '#293A84', '#363696', '#4331A7', '#4F2DB9', '#5C28CA', '#6924DC', '#751FED', '#821BFF', '#a50026'],
				},
				showLabel: false,
				itemWidth: 12,
				itemHeight: 8,
				top: '55%',
				itemGap: 0,
				itemSymbol: 'rect',
			},
		],
		series: [
			{
				...Blood0Class.BAR_OPTIONS,
				name: '신환',
				data: [],
			},
			{
				...Blood0Class.BAR_OPTIONS,
				name: '재환',
				data: [],
			},
			{
				...Blood0Class.LINE_OPTIONS,
				name: '달성률',
				data: [],
			},
			{
				xAxisIndex: 1,
				yAxisIndex: 2,
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
		super({ elementId, options: { ...Blood0Class.BASE_OPTIONS, ...options } });
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...Blood0Class.BASE_OPTIONS, ...options };
		super.setOptions(this.options);
	}

	setData(response) {
		const _xAxisData = response.map(
			(el) => `${new Date(el.time).getHours().toString().padStart(2, '0')}:${new Date(el.time).getMinutes().toString().padStart(2, '0')}`
		);

		const _heatmapData = response.reduce((a, b, i) => {
			const _data = [];
			for (let index = 0; index < 4; index++) {
				const elementData = [i, index, b.data2[titleIndex[index].en] || '-'];
				_data.push(elementData);
			}
			return [...a, ..._data];
		}, []);

		const _seriesData = Blood0Class.BASE_OPTIONS.series.map((el, i) => {
			if (i <= 2) {
				const title = Blood0Class.NAME_INFO[el.name || '신환'];
				return { ...el, data: response.map((el) => ({ name: el.time, value: el.data1[title] })) };
			} else {
				return { ...el, data: _heatmapData };
			}
		});

		const _options = { xAxis: this.options.xAxis.map((el) => ({ ...el, data: _xAxisData })), series: _seriesData };

		this.setOptions(_options);
	}
}
