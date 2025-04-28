import Controller from './controller.js';
import { CompanyOrgClass, CTClass, Blood1Class, Blood2Class, SankeyClass, OperateClass, PatientsClass, VisitorClass } from './lib/classes/index.js';

const controller = new Controller();
await controller.getData();
controller.setData();
controller.createDragEvent();
controller.makeBiggerEvent();
controller.createResizeEvent();
// // 조직도
// fetch('../public/jsonData/treemap.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then(({ response }) => {
// 		const compayClass = new CompanyOrgClass({ elementId: 'graph-0' });
// 		compayClass.setData(response);
// 	});

// fetch('../public/jsonData/cttest.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then((res) => {
// 		const response = res.response.filter((_, i) => i < 16);

// 		const ctGraph = new CTClass({ elementId: 'graph-1' });
// 		ctGraph.setData(response);

// 		// // test 시간 변경에 따른 데이터 추가
// 		// window.setTimeout(() => {
// 		// 	const _response = res.response.filter((_, i) => i < 18 && i > 3);
// 		// 	ctGraph.setData(_response);
// 		// }, 2000);
// 	});

// fetch('../public/jsonData/bloodtest.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then(({ response }) => {
// 		const blood1Class = new Blood1Class({ elementId: 'graph-2-1' });
// 		blood1Class.setData(response);
// 	});

// fetch('../public/jsonData/blood2test.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then(({ response }) => {
// 		const blood2Class = new Blood2Class({ elementId: 'graph-2-2' });
// 		blood2Class.setData(response);
// 	});

// fetch('../public/jsonData/sankey.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then(({ response }) => {
// 		const sankeyClass = new SankeyClass({ elementId: 'graph-3' });
// 		sankeyClass.setData(response);
// 	});

// fetch('../public/jsonData/operateData.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then(({ response }) => {
// 		const operateClass = new OperateClass({ elementId: 'graph-4' });
// 		operateClass.setData(response);
// 	});

// fetch('../public/jsonData/patients.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then(({ response }) => {
// 		const patientsClass = new PatientsClass({ elementId: 'graph-5' });
// 		patientsClass.setData(response);
// 	});

// fetch('../public/jsonData/visitors.json')
// 	.then((res) => {
// 		if (!res.ok) {
// 			throw new Error('json 파일 읽기 실패!');
// 		}

// 		return res.json();
// 	})
// 	.then(({ response }) => {
// 		const visitorClass = new VisitorClass({ elementId: 'graph-6' });
// 		visitorClass.setData(response);
// 	});
