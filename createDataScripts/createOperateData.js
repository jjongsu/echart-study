const fs = require('fs');

const startTime = new Date();
startTime.setHours(8);
startTime.setMinutes(0);
startTime.setMilliseconds(0);

const intervalMinutes = 30;
const totalCount = 30;

const response = [];

let expectNum = 25;
let operateNum = 20;
let rate = 30;

for (let i = 0; i < totalCount; i++) {
	const currentTime = new Date(startTime.getTime() + i * intervalMinutes * 60000);

	const formattedTime = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(
		2,
		'0'
	)} ${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;

	const addNum1 = parseFloat((Math.random() * 3).toFixed(2));
	const addNum2 = parseFloat((Math.random() * 3).toFixed(2));

	expectNum += addNum1;
	operateNum += addNum2;
	rate += parseFloat((Math.random() * 3).toFixed(2));

	if (expectNum <= operateNum) {
		expectNum = operateNum + addNum1 + addNum2;
	}

	response.push({
		time: formattedTime,
		data: { rate: Number(rate.toFixed(2)), expectNum: Number(expectNum.toFixed(2)), operateNum: Number(operateNum.toFixed(2)) },
	});
}

const output = {
	response: response,
};

fs.writeFileSync('./public/jsonData/operateData.json', JSON.stringify(output, null, 2), 'utf8');

console.log('operateData.json 파일이 생성되었습니다!', output);
