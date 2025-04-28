export const filterJsonData = (json, repeat, isAdd = false) => {
	// time관련 json파일이 아닌 경우 그대로 새팅
	if (!json || !json.length || !json?.[0]?.time) return json;

	const targetHour1 = new Date(json[0].time);
	targetHour1.setMinutes((repeat % 2) * 30);
	targetHour1.setHours(8 + Math.trunc(repeat / 2));
	const targetHour2 = new Date(json[0].time);
	targetHour2.setMinutes((repeat % 2) * 30);
	targetHour2.setHours(17 + Math.trunc(repeat / 2));

	const filterdData = json.filter(({ time }) => {
		const targetTime = new Date(time).getTime();
		const isUpper = isAdd ? true : targetHour1.getTime() <= targetTime;
		const isUnder = targetHour2.getTime() > targetTime;
		return isUpper && isUnder;
	});

	return filterdData;
};
