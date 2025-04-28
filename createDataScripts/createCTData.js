const fs = require('fs');

const startTime = new Date();
startTime.setHours(8);
startTime.setMinutes(0);
startTime.setMilliseconds(0);

const intervalMinutes = 30;
const totalCount = 30;

const response = [];

function getRandomInt(min = 200, max = 330) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 0; i < totalCount; i++) {
	const currentTime = new Date(startTime.getTime() + i * intervalMinutes * 60000);

	const formattedTime = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(
		2,
		'0'
	)} ${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

	const rate = parseFloat((Math.random() * 30).toFixed(2));
	const wardPatients = getRandomInt();
	const newPatients = getRandomInt();
	const followUpPatients = getRandomInt();

	response.push({
		time: formattedTime,
		data: { rate, wardPatients, newPatients, followUpPatients },
	});
}

const output = {
	response: response,
};

fs.writeFileSync('./public/jsonData/cttest.json', JSON.stringify(output, null, 2), 'utf8');

console.log('cttest.json 파일이 생성되었습니다!', output);
