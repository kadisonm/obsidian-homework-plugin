import { Plugin } from 'obsidian';

import HomeworkModal from './modal'

export default class HomeworkPlugin extends Plugin {

	async onload() {
		// Open homework ribbon button
		const ribbonToggle = this.addRibbonIcon('book', 'Open homework', (evt: MouseEvent) => {
			new HomeworkModal(this.app, this).open();
		});

		// Perform additional things with the ribbon
		ribbonToggle.addClass('my-plugin-ribbon-class');

		// Open homework command
		this.addCommand({
			id: 'open-homework',
			name: 'Open homework',
			callback: () => {
				new HomeworkModal(this.app, this).open();
			}
		});
	}
}