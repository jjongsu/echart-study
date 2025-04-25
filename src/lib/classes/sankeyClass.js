import BasicClass from './basicClass.js';

export default class SankeyClass extends BasicClass {
	/** 기본 옵션 */
	static BASE_OPTIONS = {
		series: [
			{
				type: 'sankey',
				layout: 'none',
				emphasis: {
					focus: 'trajectory',
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

	constructor({ elementId, options }) {
		super({ elementId, options: { ...SankeyClass.BASE_OPTIONS, ...options } });
	}

	setOptions(options) {
		if (!options) return;
		this.options = { ...SankeyClass.BASE_OPTIONS, ...options };
		super.setOptions(this.options);
	}

	setData(response) {
		const _data = response.map((el) => ({ name: el.source }));
		const _links = response.reduce((a, b) => {
			const _data = b.targets.map((el) => ({ source: b.source, ...el }));
			return [...a, ..._data];
		}, []);

		const _seriesData = SankeyClass.BASE_OPTIONS.series.map((el) => ({ ...el, data: _data, links: _links }));
		const _options = { series: _seriesData };

		this.setOptions(_options);
	}
}
