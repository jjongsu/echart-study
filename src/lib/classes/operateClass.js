import BasicClass from './basicClass.js';

export default class OperateClass extends BasicClass {
	constructor({ elementId, options }) {
		super({ elementId, options });

		this.data = options.data ?? [];
	}
}
