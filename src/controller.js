import {
	Blood0Class,
	Blood1Class,
	Blood2Class,
	CompanyOrgClass,
	CTClass,
	OperateClass,
	PatientsClass,
	SankeyClass,
	VisitorClass,
} from './lib/classes/index.js';

export default class Controller {
	biggerSection = 'graph-3';
	/** sectionId를 가지고 있으면 modal을 띄운 상태 / null이면 모달을 띄우지 않은 상태 */
	modalState = null;
	/** graph를 새로 생성해서 해당 데이터를 넣어주기 위한 class들 모음 */
	graphInstance = {};
	/** fetch data */
	graphData = {};
	isFetching = true;
	currentModalGraph;

	static _preFixSrc = '../public/jsonData';
	static info = [
		{ src: `${this._preFixSrc}/treemap.json`, elementId: 'graph-0', classInstance: CompanyOrgClass, sectionId: 'section-0' },
		{ src: `${this._preFixSrc}/cttest.json`, elementId: 'graph-1', classInstance: CTClass, sectionId: 'section-1' },
		{ src: `${this._preFixSrc}/blood0test.json`, elementId: 'graph-2', classInstance: Blood0Class, sectionId: 'section-2' },
		// { src: `${this._preFixSrc}/bloodtest.json`, elementId: 'graph-2-1', classInstance: Blood1Class, sectionId: 'section-2' },
		// { src: `${this._preFixSrc}/blood2test.json`, elementId: 'graph-2-2', classInstance: Blood2Class, sectionId: 'section-2' },
		{ src: `${this._preFixSrc}/sankey.json`, elementId: 'graph-3', classInstance: SankeyClass, sectionId: 'section-3' },
		{ src: `${this._preFixSrc}/operateData.json`, elementId: 'graph-4', classInstance: OperateClass, sectionId: 'section-4' },
		{ src: `${this._preFixSrc}/patients.json`, elementId: 'graph-5', classInstance: PatientsClass, sectionId: 'section-5' },
		{ src: `${this._preFixSrc}/visitors.json`, elementId: 'graph-6', classInstance: VisitorClass, sectionId: 'section-6' },
	];
	static titleName = {
		'section-0': '조직도',
		'section-1': 'CT검사',
		'section-2': '체혈검사',
		'section-3': '이동현황',
		'section-4': '검사/수술 운영',
		'section-5': '병동별 환자 유입/유출',
		'section-6': '방문 환자 수',
	};

	/** 연결 관계를 통해서 확대 클릭 시 해당 text와 그래프 넣기 */
	connectInfo = Controller.info.reduce((a, b) => {
		const target = a.find((el) => el.sectionId.includes(b.sectionId));

		if (target) {
			return a.map((el) => {
				if (el.sectionId === b.sectionId) {
					return { ...target, elementId: [...target.elementId, b.elementId] };
				}
				return el;
			});
		}

		return [...a, { elementId: [b.elementId], sectionId: b.sectionId, buttonId: 'button-' + b.sectionId.split('-')[1] }];
	}, []);

	async _fetchData({ src, elementId, classInstance }) {
		const res = await fetch(src);
		if (!res.ok) {
			throw new Error(`${src} 파일 읽기 실패!`);
		}

		const { response } = await res.json();
		const compayClass = new classInstance({ elementId });

		this.graphData[elementId] = response;
		this.graphInstance[elementId] = compayClass;

		return compayClass;
	}

	async getData() {
		await Promise.all(Controller.info.map((config) => this._fetchData(config)));
		this.isFetching = false;
	}

	setData() {
		for (const [key, classInstance] of Object.entries(this.graphInstance)) {
			classInstance.setData(this.graphData[key]);
		}
	}

	createDragEvent() {
		if (this.isFetching) return;
		const gridItems = document.querySelectorAll('.grid-item');
		let draggedItem = null;

		gridItems.forEach((item) => {
			item.setAttribute('draggable', true);

			item.addEventListener('dragstart', () => {
				draggedItem = item;
				item.classList.add('dragging');
			});

			item.addEventListener('dragend', () => {
				draggedItem = null;
				item.classList.remove('dragging');
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
	}

	_dragSwap(el1, el2) {
		const parent = el1.parentNode;
		const el1Next = el1.nextSibling === el2 ? el1 : el1.nextSibling;
		parent.insertBefore(el1, el2);
		parent.insertBefore(el2, el1Next);
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
				const buttonId = e.target.id;

				const target = this.connectInfo.find((el) => el.buttonId === buttonId);

				if (!target) return;
				// console.log(this.graphInstance[target.elementId].myChart.dispose());
				this._setModal(target.sectionId);
			}
		}
	}

	_setModal(sectionId) {
		if (!sectionId) {
			// 모달 닫기
			this.modalState = null;

			const modalElement = document.getElementById('modal');

			// css 변경하기 위한 클래스 변경
			modalElement.classList.remove('modal-open');
			modalElement.classList.add('modal-close');

			// graph 제거
			this.currentModalGraph?.myChart.dispose();

			// graph 넣기
			const graphGroup = document.getElementById('modal-graph-group');
			graphGroup.innerText = '';
		} else {
			// 모달 열기
			this.modalState = sectionId;

			const modalElement = document.getElementById('modal');

			modalElement.classList.remove('modal-close');
			modalElement.classList.add('modal-open');

			// title 넣기
			const innerText = Controller.titleName[sectionId] || '';
			document.getElementById('modal-text').innerText = innerText;

			// graph 넣기
			const graphGroup = document.getElementById('modal-graph-group');
			const _info = Controller.info.filter((el) => el.sectionId === sectionId);
			_info.forEach((config, i) => {
				const newDiv = document.createElement('div');
				newDiv.id = 'modal-graph-' + i;
				newDiv.classList.add('graph-item');
				graphGroup.appendChild(newDiv);

				const graph = new config.classInstance({ elementId: newDiv.id });

				this.currentModalGraph = graph;
				graph.setData(this.graphData[config.elementId]);
			});
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

	makeSaveImgEvent() {
		const saveImgBtn = document.getElementById('save-img');
		saveImgBtn.addEventListener('click', () => {
			const imgElement = this.currentModalGraph.getImage({});
			console.log(imgElement);
		});
	}
}
