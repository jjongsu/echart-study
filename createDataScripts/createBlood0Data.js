const fs = require('fs');

const startTime = new Date();
startTime.setHours(8);
startTime.setMinutes(0);
startTime.setMilliseconds(0);

const intervalMinutes = 30;
const totalCount = 30;

const response = [];

function getRandomInt(min = 50, max = 180) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateXYPoints() {
	const points = [];
	for (let x = 0; x <= 100; x += 10) {
		const y = Math.random() * 100; // 0 ~ 100 사이의 랜덤 숫자
		points.push([x, y]);
	}
	return points;
}

for (let i = 0; i < totalCount; i++) {
	const currentTime = new Date(startTime.getTime() + i * intervalMinutes * 60000);

	const formattedTime = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(
		2,
		'0'
	)} ${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

	const rate = parseFloat((Math.random() * 70).toFixed(2));
	const newPatients = getRandomInt();
	const followUpPatients = getRandomInt();

	response.push({
		time: formattedTime,
		data1: { rate, newPatients, followUpPatients },
		data2: { center1F: getRandomInt(1, 10), center2F: getRandomInt(1, 10), cancer1F: getRandomInt(1, 10), cancer2F: getRandomInt(1, 10) },
		tooltip: { center1F: generateXYPoints(), center2F: generateXYPoints(), cancer1F: generateXYPoints(), cancer2F: generateXYPoints() },
	});
}

const output = {
	response: response,
};

fs.writeFileSync('./public/jsonData/blood0test.json', JSON.stringify(output, null, 2), 'utf8');

console.log('bloodtest.json 파일이 생성되었습니다!', output);
