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
		name: formattedTime,
		data: { rate, newPatients, followUpPatients },
	});
}

const output = {
	response: response,
};

fs.writeFileSync('./public/jsonData/bloodtest.json', JSON.stringify(output, null, 2), 'utf8');

console.log('bloodtest.json 파일이 생성되었습니다!', output);
