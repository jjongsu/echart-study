import { Blood0Class, CompanyOrgClass, CTClass, OperateClass, PatientsClass, SankeyClass, VisitorClass } from './lib/classes/index.js';
import { filterJsonData } from './lib/utils/helper.js';

export default class Controller {
	/** graph를 새로 생성해서 해당 데이터를 넣어주기 위한 class들 모음 */
	graphInstance = {};
	/** 받아온 전체 fetch data (모달에서 전체 데이터 기준으로 그림) */
	responseData = {};
	/** 대시보드에서 그리는 graph data */
	graphData = {};
	/** 10번 setData 반복 변수 */
	repeat = 0;
	/** fetching data 변수 */
	isFetching = true;
	/** 현재 모달로 띄워서 그리고 있는 graph */
	currentModalGraph;

	constructor() {
		const _preFixSrc = '../public/jsonData';
		this.info = [
			{ src: `${_preFixSrc}/treemap.json`, classInstance: CompanyOrgClass, title: '조직도', currentIndex: 0, id: 'orgChart' },
			{ src: `${_preFixSrc}/cttest.json`, classInstance: CTClass, title: 'CT검사', currentIndex: 1, id: 'ctScan' },
			{ src: `${_preFixSrc}/blood0test.json`, classInstance: Blood0Class, title: '채혈검사', currentIndex: 2, id: 'bloodTest' },
			{ src: `${_preFixSrc}/sankey.json`, classInstance: SankeyClass, title: '이동현황', currentIndex: 3, id: 'movementStatus' },
			{ src: `${_preFixSrc}/operateData.json`, classInstance: OperateClass, title: '검사/수술 운영', currentIndex: 4, id: 'testSurgeryOps' },
			{ src: `${_preFixSrc}/patients.json`, classInstance: PatientsClass, title: '병동별 환자 유입/유출', currentIndex: 5, id: 'wardPatientFlow' },
			{ src: `${_preFixSrc}/visitors.json`, classInstance: VisitorClass, title: '방문 환자 수', currentIndex: 6, id: 'visitorCount' },
		];
	}

	async _fetchData({ src, currentIndex, classInstance, id }) {
		const res = await fetch(src);
		if (!res.ok) {
			throw new Error(`${src} 파일 읽기 실패!`);
		}

		const { response } = await res.json();
		const companyClass = new classInstance({ elementId: `graph-${currentIndex}` });

		this.graphData[id] = response;
		this.responseData[id] = response;
		this.graphInstance[id] = companyClass;

		return companyClass;
	}

	async getData() {
		await Promise.all(this.info.map((config) => this._fetchData(config)));
		this.isFetching = false;
	}

	createIntervalEvent() {
		const intervalEvent = setInterval(() => {
			this.setData();
			this.repeat += 1;

			if (this.repeat >= 11) {
				clearInterval(intervalEvent);
			}
		}, 1000);
	}

	setData() {
		for (const [key, classInstance] of Object.entries(this.graphInstance)) {
			this.graphData[key] = filterJsonData(this.responseData[key], this.repeat, key === 'wardPatientFlow');

			// 검사/수술 운영 관련 data filter
			if (key === 'testSurgeryOps' && this.repeat < 10) {
				this.graphData[key] = this.graphData[key].map((el, i) => {
					if (this.graphData[key].length - 1 === i) {
						return { ...el, data: { expectNum: el.data.expectNum } };
					}
					return el;
				});
			}
			// 이동현황 관련 highlight
			if (key === 'movementStatus' && !!this.repeat) classInstance?.setHighlight?.(this.repeat >= 10);
			else classInstance.setData(this.graphData[key]);
		}
	}

	createDragEvent() {
		if (this.isFetching) return;
		const gridItems = document.querySelectorAll('.grid-item');
		let draggedItem = null;

		gridItems.forEach((item) => {
			item.addEventListener('dragstart', () => {
				draggedItem = item;
				item.classList.add('dragging-item');
				item.parentElement.classList.add('dragging-container');
			});

			item.addEventListener('dragend', () => {
				draggedItem = null;
				item.classList.remove('dragging-item');
				item.parentElement.classList.remove('dragging-container');
			});

			item.addEventListener('dragover', (e) => {
				e.preventDefault();
			});

			item.addEventListener('drop', (e) => {
				e.preventDefault();
				if (draggedItem && draggedItem !== item) {
					this._dragSwap(draggedItem, item);
				}
			});
		});

		this.setDraggable();
	}

	// center-section class를 가지고 있는 것을 제외하고 draggable true
	setDraggable() {
		const gridItems = document.querySelectorAll('.grid-item');

		gridItems.forEach((item) => {
			if (item.classList.contains('center-section')) {
				item.setAttribute('draggable', false);
			} else {
				item.setAttribute('draggable', true);
			}
		});
	}

	_dragSwap(el1, el2) {
		const el1Target = this.info.find((el) => el.currentIndex === Number(el1.id.split('-')[1]));
		const el2Target = this.info.find((el) => el.currentIndex === Number(el2.id.split('-')[1]));

		if (!el1Target || !el2Target) return;

		this.info = this.info.map((el) => {
			if (el.id === el1Target.id) return { ...el, currentIndex: el2Target.currentIndex };
			if (el.id === el2Target.id) return { ...el, currentIndex: el1Target.currentIndex };
			return el;
		});

		this.graphInstance[el1Target.id].myChart.dispose();
		this.graphInstance[el2Target.id].myChart.dispose();

		delete this.graphInstance[el1Target.id];
		delete this.graphInstance[el2Target.id];

		// title 변경
		const newEl1 = document.getElementById(`section-${el2Target.currentIndex}`);
		newEl1.querySelector('.graph-title').querySelector('p').innerText = el1Target.title;
		const newEl2 = document.querySelector(`#section-${el1Target.currentIndex}`);
		newEl2.querySelector('p').innerText = el2Target.title;

		// graph 변경
		this.graphInstance[el1Target.id] = new el1Target.classInstance({ elementId: 'graph-' + el2Target.currentIndex });
		this.graphInstance[el2Target.id] = new el2Target.classInstance({ elementId: 'graph-' + el1Target.currentIndex });

		if (el1Target.id === 'movementStatus') this.graphInstance[el1Target.id].setData(this.graphData[el1Target.id]);
		if (el2Target.id === 'movementStatus') this.graphInstance[el2Target.id].setData(this.graphData[el2Target.id]);

		this.setData();

		// setType에 따라서 크기 설정
		this.info.forEach((el) => {
			if (el.id === el1Target.id) {
				if (el1Target.currentIndex === 3) this.graphInstance[el2Target.id]?.setType?.('big');
				else this.graphInstance[el2Target.id]?.setType?.('small');
			}
			if (el.id === el2Target.id) {
				if (el2Target.currentIndex === 3) this.graphInstance[el1Target.id]?.setType?.('big');
				else this.graphInstance[el1Target.id]?.setType?.('small');
			}
		});
	}

	makeBiggerEvent() {
		if (this.isFetching) return;
		const gridItems = document.querySelectorAll('.grid-item');
		gridItems.forEach((element) => {
			const title = element.querySelector('p')?.innerText || '';
			const buttonElement = element.querySelector('button');

			buttonElement.addEventListener('click', (e) => this._biggerClick(e));
		});

		const smallBtn = document.getElementById('smaller');
		smallBtn.addEventListener('click', () => this._setModal());
	}

	_biggerClick(e) {
		if (e instanceof MouseEvent) {
			if (e.target instanceof HTMLButtonElement) {
				const buttonId = e.target.id.split('-')[1];

				this._setModal(Number(buttonId));
			}
		}
	}

	_setModal(currentIndex) {
		if (typeof currentIndex === 'undefined') {
			// 모달 닫기
			const modalElement = document.getElementById('modal');

			// css 변경하기 위한 클래스 변경
			modalElement.classList.remove('modal-open');
			modalElement.classList.add('modal-close');

			// graph 제거
			this.currentModalGraph?.myChart.dispose();

			// graph 넣기
			const graphGroup = document.getElementById('modal-graph-group');
			graphGroup.innerText = '';

			// modal 띄운 상태에서 추가한 resize 이벤트 제거
			this.removeResizeModalEvent();
		} else {
			// 모달 열기
			const modalElement = document.getElementById('modal');

			modalElement.classList.remove('modal-close');
			modalElement.classList.add('modal-open');

			// title 넣기
			const target = this.info.find((el) => el.currentIndex === currentIndex);
			const innerText = target?.title || '';
			document.getElementById('modal-text').innerText = innerText;

			// graph 넣기
			const graphGroup = document.getElementById('modal-graph-group');
			const newDiv = document.createElement('div');
			newDiv.id = 'modal-graph-0';
			newDiv.classList.add('graph-item');
			graphGroup.appendChild(newDiv);

			const graph = new target.classInstance({ elementId: newDiv.id });
			this.currentModalGraph = graph;
			graph.setData(this.responseData[target.id]);

			// modal 띄운 상태에서 resize 이벤트 추가
			this.createResizeModalEvent();
		}
	}

	createResizeEvent() {
		// chart resize event
		this.resizeWindowEvent = () => {
			Object.values(this.graphInstance).forEach((instance) => {
				instance.resize();
			});
		};

		window.addEventListener('resize', this.resizeWindowEvent);
	}

	removeResizeEvent() {
		window.removeEventListener('resize', this.resizeWindowEvent);
	}

	createResizeModalEvent() {
		this.resizeModalEvent = () => {
			this.currentModalGraph?.resize();
		};

		window.addEventListener('resize', this.resizeModalEvent);
	}

	removeResizeModalEvent() {
		window.removeEventListener('resize', this.resizeModalEvent);
	}

	makeSaveImgEvent() {
		const saveImgBtn = document.getElementById('save-img');
		saveImgBtn.addEventListener('click', () => {
			this.currentModalGraph?.getImage({});
		});
	}

	makeSavePdfEvent() {
		const savePdfBtn = document.getElementById('save-pdf');
		savePdfBtn.addEventListener('click', () => {
			this.currentModalGraph?.getPdf();
		});
	}
}
