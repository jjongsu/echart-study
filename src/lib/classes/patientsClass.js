import BasicClass from './basicClass.js';

export default class PatientsClass extends BasicClass {
	/** response data 기준으로 parsing하는데 도와주는 상수 */
	static NAME_INFO = { 본관: 'mainBuilding', 별관: 'annexBuilding', 암병원: 'cancerCenter', 양성자센터: 'protonTherapyCenter' };
	/** 그래프에 들어가는 scatter 옵션 */
	static SCATTER_OPTIONS = { type: 'scatter', symbolSize: 5, yAxisIndex: 0, xAxisIndex: 1 };
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		tooltip: {
			show: true,
			trigger: 'axis',
			axisPointer: {
				label: {
					formatter: function (value) {
						const target = new Date(value.value);
						const yyyy = target.getFullYear();
						const mm = String(target.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
						const dd = String(target.getDate()).padStart(2, '0');
						const hh = String(target.getHours()).padStart(2, '0');
						const min = String(target.getMinutes()).padStart(2, '0');

						const formatted = `${yyyy}-${mm}-${dd} ${hh}:${min}`;
						return `${formatted}`;
					},
				},
			},
			formatter: function (value) {
				const label = value?.[0]?.axisValueLabel;
				const parsingText = value.reduce((a, b) => {
					return a + `<br/>${b.seriesName} : ${b.value[1]}`;
				}, '');
				return `${label}${parsingText}`;
			},
		},
		legend: {
			data: ['본관', '별관', '암병원', '양성자센터'],
			icon: 'circle',
			textStyle: { color: '#FFFFFF' },
		},
		xAxis: [
			{
				type: 'category',
				splitLine: {
					show: false,
				},
				boundaryGap: false,
				data: [],
				axisTick: {
					show: false,
				},
				axisLine: { show: false },
			},
			{
				type: 'value',
				splitLine: {
					show: false,
				},
				axisLabel: {
					show: false,
				},
				axisTick: {
					show: false,
				},
			},
		],
		yAxis: {
			type: 'value',
			min: 100,
			max: 500,
			interval: 100,
			axisLabel: {
				formatter: function (value) {
					return `${value}`;
				},
			},
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
				...PatientsClass.SCATTER_OPTIONS,
				name: '본관',
				data: [],
			},
			{
				...PatientsClass.SCATTER_OPTIONS,
				name: '별관',
				data: [],
			},
			{
				...PatientsClass.SCATTER_OPTIONS,
				name: '암병원',
				data: [],
			},
			{
				...PatientsClass.SCATTER_OPTIONS,
				name: '양성자센터',
				data: [],
			},
		],
	};

	constructor({ elementId, options }) {
		super({ elementId, options: { ...PatientsClass.BASE_OPTIONS, ...options } });
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...PatientsClass.BASE_OPTIONS, ...options };
		super.setOptions(this.options);
	}

	setData(response) {
		const _list = {
			mainBuilding: [],
			annexBuilding: [],
			cancerCenter: [],
			protonTherapyCenter: [],
		};

		const _min = new Date(response[0].time);
		_min.setHours(8, 0, 0, 0);
		const _max = new Date(response[0].time);
		_max.setHours(22, 0, 0, 0);
		response.forEach((el) => {
			const x = new Date(el.time).getTime();
			if (el.data?.mainBuilding) {
				_list['mainBuilding'] = [..._list['mainBuilding'], [x, el.data?.mainBuilding]];
			}
			if (el.data?.annexBuilding) {
				_list['annexBuilding'] = [..._list['annexBuilding'], [x, el.data?.annexBuilding]];
			}
			if (el.data?.cancerCenter) {
				_list['cancerCenter'] = [..._list['cancerCenter'], [x, el.data?.cancerCenter]];
			}
			if (el.data?.protonTherapyCenter) {
				_list['protonTherapyCenter'] = [..._list['protonTherapyCenter'], [x, el.data?.protonTherapyCenter]];
			}
		});

		const __xAxisData = Array.from({ length: 8 }, (_, index) => (index * 2 + 8).toString().padStart(2, '0'));

		const _xAxisData = this.options.xAxis.map((el, i) => {
			if (i === 0) {
				return { ...el, data: __xAxisData };
			}
			return { min: _min.getTime(), max: _max.getTime(), ...el };
		});

		const _seriesData = PatientsClass.BASE_OPTIONS.series.map((el) => {
			const title = PatientsClass.NAME_INFO[el.name || '본관'];
			return { ...el, data: _list[title] };
		});

		const _options = { xAxis: _xAxisData, series: _seriesData };

		this.setOptions(_options);
	}
}
