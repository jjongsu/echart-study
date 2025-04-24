import BasicClass from './lib/classes/basicClass.js';
import CTClass from './lib/classes/ctClass.js';
import BloodClass from './lib/classes/bloodClass.js';
import SankeyClass from './lib/classes/sankeyClass.js';
import OperateClass from './lib/classes/operateClass.js';
import PatientsClass from './lib/classes/patientsClass.js';

// 조직도
fetch('../public/jsonData/treemap.json')
	.then((res) => {
		if (!res.ok) {
			throw new Error('json 파일 읽기 실패!');
		}

		return res.json();
	})
	.then(({ response }) => {
		new BasicClass({
			elementId: 'section-0',
			options: {
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
						data: response,
						roam: false,
						scaleLimit: {
							min: 1,
							max: 1,
						},
					},
				],
			},
		});
	});

fetch('../public/jsonData/cttest.json')
	.then((res) => {
		if (!res.ok) {
			throw new Error('json 파일 읽기 실패!');
		}

		return res.json();
	})
	.then(({ response }) => {
		const stackCommonOptions = { type: 'bar', stack: 'total', yAxisIndex: 0, barWidth: '100%' };
		const lineOptions = { type: 'line', yAxisIndex: 1 };

		new CTClass({
			elementId: 'section-1',
			options: {
				tooltip: {
					trigger: 'axis',
				},
				legend: {
					data: ['병동', '신환', '재환', '달성률'],
				},
				xAxis: [
					{
						type: 'category',
						splitLine: {
							show: false,
						},
						data: response.map(
							(el) => `${new Date(el.name).getHours().toString().padStart(2, '0')}:${new Date(el.name).getMinutes().toString().padStart(2, '0')}`
						),
					},
				],
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
				series: [
					{
						...stackCommonOptions,
						name: '병동',
						data: response.map((el) => ({ name: el.name, value: el.data.wardPatients })),
						// data: response.map((el) => ({ name: el.name, value: el.data.wardPatients })),
					},
					{
						...stackCommonOptions,
						name: '신환',
						data: response.map((el) => ({ name: el.name, value: el.data.newPatients })),
						// data: response.map((el) => el.data.newPatients),
					},
					{
						...stackCommonOptions,
						name: '재환',
						data: response.map((el) => ({ name: el.name, value: el.data.followUpPatients })),
						// data: response.map((el) => el.data.followUpPatients),
					},
					{
						...lineOptions,
						name: '달성률',
						data: response.map((el) => ({ name: el.name, value: el.data.rate })),
						// data: response.map((el) => el.data.rate),
					},
				],
			},
		});
	});

fetch('../public/jsonData/bloodtest.json')
	.then((res) => {
		if (!res.ok) {
			throw new Error('json 파일 읽기 실패!');
		}

		return res.json();
	})
	.then(({ response }) => {
		const stackCommonOptions = { type: 'bar', yAxisIndex: 0 };
		const lineOptions = { type: 'line', yAxisIndex: 1 };

		new CTClass({
			elementId: 'section-2-1',
			options: {
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
				xAxis: [
					{
						type: 'category',
						splitLine: {
							show: false,
						},
						data: response.map(
							(el) => `${new Date(el.name).getHours().toString().padStart(2, '0')}:${new Date(el.name).getMinutes().toString().padStart(2, '0')}`
						),
					},
				],
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
						...stackCommonOptions,
						name: '신환',
						data: response.map((el) => ({ name: el.name, value: el.data.newPatients })),
						// data: response.map((el) => el.data.newPatients),
					},
					{
						...stackCommonOptions,
						name: '재환',
						data: response.map((el) => ({ name: el.name, value: el.data.followUpPatients })),
						// data: response.map((el) => el.data.followUpPatients),
					},
					{
						...lineOptions,
						name: '달성률',
						yAxis: 1,
						data: response.map((el) => ({ name: el.name, value: el.data.rate })),
						// data: response.map((el) => el.data.rate),
					},
				],
			},
		});
	});

fetch('../public/jsonData/blood2test.json')
	.then((res) => {
		if (!res.ok) {
			throw new Error('json 파일 읽기 실패!');
		}

		return res.json();
	})
	.then(({ response }) => {
		const titleIndex = {
			0: { en: 'cancer2F', ko: '암병원 2F' },
			1: { en: 'cancer1F', ko: '암병원 1F' },
			2: { en: 'center2F', ko: '본관 2F' },
			3: { en: 'center1F', ko: '본관 1F' },
		};
		const title = Object.values(titleIndex).map((el) => el.ko);
		const timeData = response.map(
			(el) => `${new Date(el.time).getHours().toString().padStart(2, '0')}:${new Date(el.time).getMinutes().toString().padStart(2, '0')}`
		);

		const heatmapData = response.reduce((a, b, i) => {
			const _data = [];
			for (let index = 0; index < 4; index++) {
				const elementData = [i, index, b.data[titleIndex[index].en] || '-'];
				_data.push(elementData);
			}
			return [...a, ..._data];
		}, []);
		new BloodClass({
			elementId: 'section-2-2',
			options: {
				tooltip: {
					position: 'top',
				},
				grid: {
					height: '50%',
					top: '10%',
				},
				xAxis: {
					type: 'category',
					data: timeData,
					splitArea: {
						show: true,
					},
				},
				yAxis: {
					type: 'category',
					data: title,
					splitArea: {
						show: true,
					},
				},
				visualMap: {
					type: 'piecewise',
					splitNumber: 10,
					min: 0,
					max: 10,
					top: 'top',
					calculable: true,
					realtime: false,
					inRange: {
						color: ['#104361', '#1D3F73', '#293A84', '#363696', '#4331A7', '#4F2DB9', '#5C28CA', '#6924DC', '#751FED', '#821BFF', '#a50026'],
					},
					showLabel: false,
					itemGap: 0,
					itemSymbol: 'rect',
				},
				series: [
					{
						type: 'heatmap',
						data: heatmapData,
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
			},
		});
	});

fetch('../public/jsonData/blood2test.json')
	.then((res) => {
		if (!res.ok) {
			throw new Error('json 파일 읽기 실패!');
		}

		return res.json();
	})
	.then(({ response }) => {
		const titleIndex = {
			0: { en: 'cancer2F', ko: '암병원 2F' },
			1: { en: 'cancer1F', ko: '암병원 1F' },
			2: { en: 'center2F', ko: '본관 2F' },
			3: { en: 'center1F', ko: '본관 1F' },
		};
		const title = Object.values(titleIndex).map((el) => el.ko);
		const timeData = response.map(
			(el) => `${new Date(el.time).getHours().toString().padStart(2, '0')}:${new Date(el.time).getMinutes().toString().padStart(2, '0')}`
		);

		const heatmapData = response.reduce((a, b, i) => {
			const _data = [];
			for (let index = 0; index < 4; index++) {
				const elementData = [i, index, b.data[titleIndex[index].en] || '-'];
				_data.push(elementData);
			}
			return [...a, ..._data];
		}, []);
		new BloodClass({
			elementId: 'section-2-2',
			options: {
				tooltip: {
					position: 'top',
				},
				grid: {
					height: '50%',
					top: '10%',
				},
				xAxis: {
					type: 'category',
					data: timeData,
					splitArea: {
						show: true,
					},
				},
				yAxis: {
					type: 'category',
					data: title,
					splitArea: {
						show: true,
					},
				},
				visualMap: {
					type: 'piecewise',
					splitNumber: 10,
					min: 0,
					max: 10,
					top: 'top',
					calculable: true,
					realtime: false,
					inRange: {
						color: ['#104361', '#1D3F73', '#293A84', '#363696', '#4331A7', '#4F2DB9', '#5C28CA', '#6924DC', '#751FED', '#821BFF', '#a50026'],
					},
					showLabel: false,
					itemGap: 0,
					itemSymbol: 'rect',
				},
				series: [
					{
						type: 'heatmap',
						data: heatmapData,
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
			},
		});
	});

fetch('../public/jsonData/sankey.json')
	.then((res) => {
		if (!res.ok) {
			throw new Error('json 파일 읽기 실패!');
		}

		return res.json();
	})
	.then(({ response }) => {
		const data = response.map((el) => ({ name: el.source }));
		const links = response.reduce((a, b) => {
			const _data = b.targets.map((el) => ({ source: b.source, ...el }));
			return [...a, ..._data];
		}, []);

		new SankeyClass({
			elementId: 'section-3',
			options: {
				series: {
					type: 'sankey',
					layout: 'none',
					emphasis: {
						focus: 'trajectory',
					},
					data,
					links,
					lineStyle: {
						color: 'gradient',
						curveness: 0.5,
					},
				},
			},
		});
	});

fetch('../public/jsonData/operateData.json')
	.then((res) => {
		if (!res.ok) {
			throw new Error('json 파일 읽기 실패!');
		}

		return res.json();
	})
	.then(({ response }) => {
		const barOptions = { type: 'bar' };
		const lineOptions = { type: 'line' };

		new OperateClass({
			elementId: 'section-4',
			options: {
				tooltip: {
					trigger: 'axis',
				},
				legend: {
					data: ['예상 검사/ 수술 수', '실행 검사 / 수술 수', '달성률'],
					icon: 'circle',
				},
				xAxis: [
					{
						type: 'category',
						splitLine: {
							show: false,
						},
						data: response.map(
							(el) => `${new Date(el.name).getHours().toString().padStart(2, '0')}:${new Date(el.name).getMinutes().toString().padStart(2, '0')}`
						),
					},
				],
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
				series: [
					{
						...barOptions,
						barGap: '60%',
						name: '예상 검사/ 수술 수',
						data: response.map((el) => ({ name: el.name, value: el.data.expectNum })),
						itemStyle: {
							color: '#47575c',
							borderRadius: [5, 5, 0, 0],
						},
						// data: response.map((el) => ({ name: el.name, value: el.data.expectNum })),
					},
					{
						...barOptions,
						name: '실행 검사 / 수술 수',
						barGap: '-60%',
						data: response.map((el) => ({ name: el.name, value: el.data.operateNum })),
						itemStyle: {
							color: '#21c8ff',
							borderRadius: [5, 5, 0, 0],
						},
						// data: response.map((el) => el.data.operateNum),
					},
					{
						...lineOptions,
						name: '달성률',
						data: response.map((el) => ({ name: el.name, value: el.data.rate })),
						itemStyle: {
							color: '#f5e076',
						},
						// data: response.map((el) => el.data.rate),
					},
				],
			},
		});
	});

fetch('../public/jsonData/patients.json')
	.then((res) => {
		if (!res.ok) {
			throw new Error('json 파일 읽기 실패!');
		}

		return res.json();
	})
	.then(({ response }) => {
		// const locationIndex = {
		// 	mainBuilding:0,
		// 	annexBuilding:1,
		// 	cancerCenter:2,
		// 	protonTherapyCenter:3,
		// }
		const mainBuildingList = [];
		const annexBuildingList = [];
		const cancerCenterList = [];
		const protonTherapyCenterList = [];
		response.forEach((el) => {
			const [_hour, _min] = el.time?.split(' ')?.[1]?.split(':') || [8, 0];
			const x = Number(_hour) * 60 + Number(_min);
			if (el.data?.mainBuilding) {
				mainBuildingList.push([x, el.data?.mainBuilding]);
			}
			if (el.data?.annexBuilding) {
				annexBuildingList.push([x, el.data?.annexBuilding]);
			}
			if (el.data?.cancerCenter) {
				cancerCenterList.push([x, el.data?.cancerCenter]);
			}
			if (el.data?.protonTherapyCenter) {
				protonTherapyCenterList.push([x, el.data?.protonTherapyCenter]);
			}
		});

		const xAxisData = Array.from({ length: 8 }, (_, index) => (index * 2 + 8).toString().padStart(2, '0'));

		const scatterOptions = { type: 'scatter', symbolSize: 5, yAxisIndex: 0, xAxisIndex: 1 };
		new PatientsClass({
			elementId: 'section-5',
			options: {
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
						data: xAxisData,
						axisLabel: {},
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
					},
				],
				yAxis: [
					{
						type: 'value',
						min: 100,
						max: 500,
						interval: 100,
						axisLabel: {
							formatter: function (value) {
								return `${value}`;
							},
						},
					},
				],
				series: [
					{
						...scatterOptions,
						name: '본관',
						data: mainBuildingList,
					},
					{
						...scatterOptions,
						name: '별관',
						data: annexBuildingList,
					},
					{
						...scatterOptions,
						name: '암병원',
						data: cancerCenterList,
					},
					{
						...scatterOptions,
						name: '양성자센터',
						data: protonTherapyCenterList,
					},
				],
			},
		});
	});
