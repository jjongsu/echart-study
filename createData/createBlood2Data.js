const fs = require('fs');

const startTime = new Date();
startTime.setHours(8);
startTime.setMinutes(0);
startTime.setMilliseconds(0);

const intervalMinutes = 30;
const totalCount = 30;

const response = [];

function getRandomInt(min = 1, max = 10) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 0; i < totalCount; i++) {
	const currentTime = new Date(startTime.getTime() + i * intervalMinutes * 60000);

	const formattedTime = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(
		2,
		'0'
	)} ${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
	const value = getRandomInt();

	response.push({
		time: formattedTime,
		data: [
			{ name: 'center1F', value: getRandomInt() },
			{ name: 'center2F', value: getRandomInt() },
			{ name: 'cancer1F', value: getRandomInt() },
			{ name: 'cancer2F', value: getRandomInt() },
		],
	});
}

const output = {
	response: response,
};

fs.writeFileSync('./jsonData/blood2test.json', JSON.stringify(output, null, 2), 'utf8');

console.log('blood2test.json 파일이 생성되었습니다!', output);
