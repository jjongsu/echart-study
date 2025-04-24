const fs = require('fs');

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(n) {
	return n.toString().padStart(2, '0');
}

function getTodayDateStr() {
	const now = new Date();
	return now.toISOString().slice(0, 10); // yyyy-MM-dd
}

function generateTimeStringsPerHour(minPerGroup = 15) {
	const dateStr = getTodayDateStr();
	const startHour = 8;
	const endHour = 22;
	const allTimes = [];

	for (let hour = startHour; hour <= endHour; hour++) {
		const group1 = new Set(); // 00~30
		const group2 = new Set(); // 31~59

		while (group1.size < minPerGroup || group2.size < minPerGroup) {
			const minute = getRandomInt(0, 59);
			const HH = pad(hour);
			const mm = pad(minute);
			const fullTime = `${dateStr} ${HH}:${mm}`;

			if (minute <= 30 && group1.size < minPerGroup) {
				group1.add(fullTime);
			} else if (minute > 30 && group2.size < minPerGroup) {
				group2.add(fullTime);
			}
		}

		allTimes.push(...group1, ...group2);
	}

	return [...allTimes].sort();
}

function generateData() {
	const buildings = ['mainBuilding', 'annexBuilding', 'cancerCenter', 'protonTherapyCenter'];
	const data = {};
	const numToInclude = getRandomInt(1, buildings.length);
	const selected = buildings.sort(() => 0.5 - Math.random()).slice(0, numToInclude);

	selected.forEach((b) => {
		data[b] = getRandomInt(100, 500);
	});

	return data;
}

function generateResponse() {
	const times = generateTimeStringsPerHour();
	return times.map((time) => ({
		time,
		data: generateData(),
	}));
}

const patientsData = {
	response: generateResponse(),
};

fs.writeFileSync('./public/jsonData/patients.json', JSON.stringify(patientsData, null, 2));
console.log('patients.json 파일이 생성되었습니다.');
