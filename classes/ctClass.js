import BasicClass from './basicClass.js';

export default class CTClass extends BasicClass {
	constructor({ elementId, options }) {
		super({ elementId, options });

		this.data = options.data ?? [];
	}
}
