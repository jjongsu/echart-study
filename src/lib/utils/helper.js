/**
 * 그려질 부분에 대한 데이터만 추출하는 함수
 * @param {*} json fetching으로 받아온 데이터
 * @param {number} repeat setData 반복 횟수
 * @param {boolean | undefined} isAdd 축적하는 형태
 * @returns
 */
export const filterJsonData = (json, repeat, isAdd = false) => {
	// time관련 json파일이 아닌 경우 그대로 새팅
	if (!json || !json.length || !json?.[0]?.time) return json;

	const targetHour1 = new Date(json[0].time);
	targetHour1.setMinutes((repeat % 2) * 30);
	targetHour1.setHours(8 + Math.trunc(repeat / 2));
	const targetHour2 = new Date(json[0].time);
	targetHour2.setMinutes((repeat % 2) * 30);
	targetHour2.setHours(17 + Math.trunc(repeat / 2));

	const filteredData = json.filter(({ time }) => {
		const targetTime = new Date(time).getTime();
		const isUpper = isAdd ? true : targetHour1.getTime() <= targetTime;
		const isUnder = targetHour2.getTime() > targetTime;
		return isUpper && isUnder;
	});

	return filteredData;
};

export function generateSVGPathQuadratic(points, width = 100, height = 60) {
	// 정규화
	const maxX = Math.max(...points.map((p) => p[0]));
	const maxY = Math.max(...points.map((p) => p[1]));

	const scaled = points.map(([x, y]) => [(x / maxX) * width, height - (y / maxY) * height]);

	// 시작점
	let d = `M ${scaled[0][0]},${scaled[0][1]}`;

	// quadratic 곡선 추가
	for (let i = 1; i < scaled.length - 1; i++) {
		const [x0, y0] = scaled[i];
		const [x1, y1] = scaled[i + 1];
		const ctrlX = x0;
		const ctrlY = y0;
		const midX = (x0 + x1) / 2;
		const midY = (y0 + y1) / 2;
		d += ` Q ${ctrlX},${ctrlY} ${midX},${midY}`;
	}

	// 마지막 점까지 연결
	const last = scaled[scaled.length - 1];
	d += ` T ${last[0]},${last[1]}`;

	return `
	  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
		<path d="${d}" fill="none" stroke="#5470C6" stroke-width="2"/>
	  </svg>
	`;
}
