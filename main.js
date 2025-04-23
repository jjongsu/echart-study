import BasicClass from './classes/basicClass.js';
import CTClass from './classes/ctClass.js';
import BloodClass from './classes/bloodClass.js';

// // 조직도
// fetch('./jsonData/treemap.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then(({ response }) => {
// 		new BasicClass({
// 			elementId: 'section-0',
// 			options: {
// 				title: {
// 					text: '조직도',
// 					show: false,
// 				},
// 				grid: {
// 					left: '15%',
// 					right: '15%',
// 				},
// 				tooltip: {
// 					formatter: function (info) {
// 						const { name: cellName, value: cellCount } = info.data;

// 						const tooltipString = `<div class="tooltip-title-treemap">${cellName} <span style="font-weight: bold;">${cellCount}</span></div>`;

// 						return tooltipString;
// 					},
// 				},
// 				series: [
// 					{
// 						type: 'treemap',
// 						visibleMin: 300,
// 						label: {
// 							show: true,
// 							formatter: '{b}',
// 						},
// 						itemStyle: {
// 							borderColor: '#fff',
// 						},
// 						data: response,
// 						roam: false,
// 						scaleLimit: {
// 							min: 1,
// 							max: 1,
// 						},
// 					},
// 				],
// 			},
// 		});
// 	});

// fetch('./jsonData/cttest.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then(({ response }) => {
// 		const stackCommonOptions = { type: 'bar', stack: 'total', yAxisIndex: 0, barWidth: '100%' };
// 		const lineOptions = { type: 'line', yAxisIndex: 1 };

// 		new CTClass({
// 			elementId: 'section-1',
// 			options: {
// 				tooltip: {
// 					trigger: 'axis',
// 				},
// 				legend: {
// 					data: ['병동', '신환', '재환', '달성률'],
// 				},
// 				xAxis: [
// 					{
// 						type: 'category',
// 						splitLine: {
// 							show: false,
// 						},
// 						data: response.map(
// 							(el) => `${new Date(el.name).getHours().toString().padStart(2, '0')}:${new Date(el.name).getMinutes().toString().padStart(2, '0')}`
// 						),
// 					},
// 				],
// 				yAxis: [
// 					{
// 						type: 'value',
// 						name: '',
// 						min: 0,
// 						max: 1000,
// 						interval: 500,
// 					},
// 					{
// 						type: 'value',
// 						name: '달성률',
// 						min: 0,
// 						max: 100,
// 						show: false,
// 					},
// 				],
// 				series: [
// 					{
// 						...stackCommonOptions,
// 						name: '병동',
// 						data: response.map((el) => ({ name: el.name, value: el.data.wardPatients })),
// 						// data: response.map((el) => ({ name: el.name, value: el.data.wardPatients })),
// 					},
// 					{
// 						...stackCommonOptions,
// 						name: '신환',
// 						data: response.map((el) => ({ name: el.name, value: el.data.newPatients })),
// 						// data: response.map((el) => el.data.newPatients),
// 					},
// 					{
// 						...stackCommonOptions,
// 						name: '재환',
// 						data: response.map((el) => ({ name: el.name, value: el.data.followUpPatients })),
// 						// data: response.map((el) => el.data.followUpPatients),
// 					},
// 					{
// 						...lineOptions,
// 						name: '달성률',
// 						data: response.map((el) => ({ name: el.name, value: el.data.rate })),
// 						// data: response.map((el) => el.data.rate),
// 					},
// 				],
// 			},
// 		});
// 	});

const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a'];

const days = ['본관 F1', '본관 F2', '암병원 F1', '암병원 F2'];
const data = [
	[0, 0, 5],
	[0, 1, 1],
	[0, 2, 0],
	[0, 3, 0],
	[0, 4, 0],
	[0, 5, 0],
	[0, 6, 0],
	[1, 0, 7],
	[1, 1, 0],
	[1, 2, 0],
	[1, 3, 0],
	[1, 4, 0],
	[1, 5, 0],
	[1, 6, 0],
	[2, 0, 1],
	[2, 1, 1],
	[2, 2, 0],
	[2, 3, 0],
	[2, 4, 0],
	[2, 5, 0],
	[2, 6, 0],
	[3, 0, 7],
	[3, 1, 3],
	[3, 2, 0],
	[3, 3, 0],
	[3, 4, 0],
	[3, 5, 0],
	[3, 6, 0],
	[4, 0, 1],
	[4, 1, 3],
	[4, 2, 0],
	[4, 3, 0],
	[4, 4, 0],
	[4, 5, 1],
	[4, 6, 0],
	[5, 0, 2],
	[5, 1, 1],
	[5, 2, 0],
	[5, 3, 3],
	[5, 4, 0],
	[5, 5, 0],
	[5, 6, 0],
	[6, 0, 1],
	[6, 1, 0],
	[6, 2, 0],
	[6, 3, 0],
	[6, 4, 0],
	[6, 5, 0],
	[6, 6, 0],
].map(function (item) {
	return [item[1], item[0], item[2] || '-'];
});

fetch('./jsonData/bloodtest.json')
	.then((res) => {
		if (!res.ok) {
			throw new Error('json 파일 읽기 실패!');
		}

		return res.json();
	})
	.then(({ response }) => {
		const stackCommonOptions = { type: 'bar', yAxisIndex: 0 };
		const lineOptions = { type: 'line', yAxisIndex: 1 };

		new BloodClass({
			elementId: 'section-2-1',
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
					data: hours,
					splitArea: {
						show: true,
					},
				},
				yAxis: {
					type: 'category',
					data: days,
					splitArea: {
						show: true,
					},
				},
				visualMap: {
					min: 0,
					max: 10,
					calculable: true,
					orient: 'horizontal',
					left: 'center',
					bottom: '15%',
				},
				series: [
					{
						name: 'Punch Card',
						type: 'heatmap',
						data: data,
						label: {
							show: true,
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
