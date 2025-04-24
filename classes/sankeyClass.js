import BasicClass from './basicClass.js';

export default class SankeyClass extends BasicClass {
	constructor({ elementId, options }) {
		super({ elementId, options });

		this.data = options.data ?? [];
	}
}
