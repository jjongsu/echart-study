import BasicClass from './basicClass.js';

export default class SankeyClass extends BasicClass {
	/** 기본 옵션 */
	static BASE_BIG_OPTIONS = {
		series: [
			{
				type: 'sankey',
				layout: 'none',
				nodeWidth: 50,
				nodeAlign: 'justify',
				draggable: false,
				right: '5%',
				emphasis: {
					disabled: false,
					focus: 'trajectory',
				},
				label: {
					position: 'insideTopLeft',
					color: '#FFFFFF',
					show: true,
				},
				selectedMode: 'single',
				select: {
					disabled: false,
				},
				data: [],
				links: [],
				lineStyle: {
					color: 'gradient',
					curveness: 0.5,
				},
			},
		],
	};

	static BASE_SMALL_OPTIONS = {
		series: [
			{
				type: 'sankey',
				layout: 'none',
				nodeWidth: 10,
				nodeAlign: 'justify',
				draggable: false,
				right: '5%',
				emphasis: {
					focus: 'trajectory',
				},
				label: {
					position: ['50%', '100%'],
					color: '#FFFFFF',
					show: false,
				},
				data: [],
				links: [],
				lineStyle: {
					color: 'gradient',
					curveness: 0.5,
				},
				tooltip: {
					trigger: 'item',
					formatter: function (params) {
						// tooltip에 hover한 항목의 이름과 값을 표시합니다.
						return params.name + ': ' + params.value;
					},
				},
			},
		],
	};

	constructor({ elementId, options }) {
		super({ elementId, options: { ...SankeyClass.BASE_OPTIONS, ...options } });
		this.type = 'big';
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...options };
		super.setOptions(this.options);
	}

	_getOptions() {
		if (this.type === 'small') {
			return SankeyClass.BASE_SMALL_OPTIONS;
		} else {
			return SankeyClass.BASE_BIG_OPTIONS;
		}
	}

	setData(response) {
		this.response = response;

		const _data = this.response.map((el) => ({ name: el.source }));
		const _links = this.response.reduce((a, b) => {
			const _data = b.targets.map((el) => ({ source: b.source, ...el }));
			return [...a, ..._data];
		}, []);

		const _seriesData = this._getOptions().series.map((el) => ({ ...el, data: _data, links: _links }));
		const _options = { series: _seriesData };

		this.setOptions(_options);
	}

	setType(type) {
		if (type === this.type) return;
		this.type = type;
		this.setData(this.response);
	}
}
