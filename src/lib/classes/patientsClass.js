import BasicClass from './basicClass.js';

export default class PatientsClass extends BasicClass {
	/** response data 기준으로 parsing하는데 도와주는 상수 */
	static NAME_INFO = { 본관: 'mainBuilding', 별관: 'annexBuilding', 암병원: 'cancerCenter', 양성자센터: 'protonTherapyCenter' };
	/** 그래프에 들어가는 scatter 옵션 */
	static SCATTER_OPTIONS = { type: 'scatter', symbolSize: 5, yAxisIndex: 0, xAxisIndex: 1 };
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		legend: {
			data: ['본관', '별관', '암병원', '양성자센터'],
			icon: 'circle',
		},
		xAxis: [
			{
				type: 'category',
				splitLine: {
					show: false,
				},
				boundaryGap: false,
				data: [],
				axisLabel: {},
				axisTick: {
					show: false,
				},
			},
			{
				type: 'value',
				splitLine: {
					show: false,
				},
				axisLabel: {
					show: false,
				},
				min: 8 * 60,
				max: 22 * 60,
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
				// data: mainBuildingList,
				data: [],
			},
			{
				...PatientsClass.SCATTER_OPTIONS,
				name: '별관',
				// data: annexBuildingList,
				data: [],
			},
			{
				...PatientsClass.SCATTER_OPTIONS,
				name: '암병원',
				// data: cancerCenterList,
				data: [],
			},
			{
				...PatientsClass.SCATTER_OPTIONS,
				name: '양성자센터',
				// data: protonTherapyCenterList,
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

		response.forEach((el) => {
			const [_hour, _min] = el.time?.split(' ')?.[1]?.split(':') || [8, 0];
			const x = Number(_hour) * 60 + Number(_min);
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
			return el;
		});

		const _seriesData = PatientsClass.BASE_OPTIONS.series.map((el) => {
			const title = PatientsClass.NAME_INFO[el.name || '본관'];
			return { ...el, data: _list[title] };
		});

		const _options = { xAxis: _xAxisData, series: _seriesData };

		this.setOptions(_options);
	}
}
