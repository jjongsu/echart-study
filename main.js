import BasicClass from "./classes/basicClass.js";
import CTClass from "./classes/ctClass.js";
import BloodClass from "./classes/bloodClass.js";

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

fetch("./jsonData/blood2test.json")
    .then((res) => {
        if (!res.ok) {
            throw new Error("json 파일 읽기 실패!");
        }

        return res.json();
    })
    .then(({ response }) => {
        const titleIndex = {
            0: { en: "cancer2F", ko: "암병원 2F" },
            1: { en: "cancer1F", ko: "암병원 1F" },
            2: { en: "center2F", ko: "본관 2F" },
            3: { en: "center1F", ko: "본관 1F" },
        };
        const title = Object.values(titleIndex).map((el) => el.ko);
        const timeData = response.map(
            (el) => `${new Date(el.time).getHours().toString().padStart(2, "0")}:${new Date(el.time).getMinutes().toString().padStart(2, "0")}`
        );

        const heatmapData = response.reduce((a, b, i) => {
            const _data = [];
            for (let index = 0; index < 4; index++) {
                const elementData = [i, index, b.data[titleIndex[index].en] || "-"];
                _data.push(elementData);
            }
            return [...a, ..._data];
        }, []);
        new BloodClass({
            elementId: "section-2-1",
            options: {
                tooltip: {
                    position: "top",
                },
                grid: {
                    height: "50%",
                    top: "10%",
                },
                xAxis: {
                    type: "category",
                    data: timeData,
                    splitArea: {
                        show: true,
                    },
                },
                yAxis: {
                    type: "category",
                    data: title,
                    splitArea: {
                        show: true,
                    },
                },
                visualMap: {
                    //   type: "continuous",
                    //   min: 0,
                    //   max: 10,
                    //   calculable: true,
                    //   top: "center",
                    //   inRange: {
                    //     color: ["#104361", "#1D3F73", "#293A84", "#363696", "#4331A7", "#4F2DB9", "#5C28CA", "#6924DC", "#751FED", "#821BFF", "#a50026"],
                    //   },
                    type: "piecewise",
                    splitNumber: 10,
                    min: 0,
                    max: 10,
                    top: "top",
                    calculable: true,
                    realtime: false,
                    inRange: {
                        color: ["#104361", "#1D3F73", "#293A84", "#363696", "#4331A7", "#4F2DB9", "#5C28CA", "#6924DC", "#751FED", "#821BFF", "#a50026"],
                    },
                    showLabel: false,
                    itemGap: 0,
                    itemSymbol: "rect",
                },
                series: [
                    {
                        type: "heatmap",
                        data: heatmapData,
                        label: {
                            show: false,
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                        },
                    },
                ],
            },
        });
    });
