import BasicClass from './basicClass.js';

export default class VisitorClass extends BasicClass {
	constructor({ elementId, options }) {
		super({ elementId, options });

		this.data = options.data ?? [];
	}
}
