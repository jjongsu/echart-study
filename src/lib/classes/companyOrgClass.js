import BasicClass from './basicClass.js';

export default class CompanyOrgClass extends BasicClass {
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		title: {
			text: '조직도',
			show: false,
		},
		grid: {
			left: '15%',
			right: '15%',
		},
		tooltip: {
			formatter: function (info) {
				const { name: cellName, value: cellCount } = info.data;

				const tooltipString = `<div class="tooltip-title-treemap">${cellName} <span style="font-weight: bold;">${cellCount}</span></div>`;

				return tooltipString;
			},
		},
		series: [
			{
				type: 'treemap',
				visibleMin: 300,
				label: {
					show: true,
					formatter: '{b}',
				},
				itemStyle: {
					borderColor: '#fff',
				},
				data: [],
				roam: false,
				scaleLimit: {
					min: 1,
					max: 1,
				},
			},
		],
	};

	constructor({ elementId, options }) {
		super({ elementId, options: { ...CompanyOrgClass.BASE_OPTIONS, ...options } });
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...CompanyOrgClass.BASE_OPTIONS, ...options };
		super.setOptions(this.options);
	}

	setData(response) {
		const _seriesData = CompanyOrgClass.BASE_OPTIONS.series.map((el) => {
			return { ...el, data: response };
		});

		const _options = { series: _seriesData };

		this.setOptions(_options);

		return this;
	}
}
