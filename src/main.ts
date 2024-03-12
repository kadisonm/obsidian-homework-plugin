import { Plugin } from 'obsidian';
import { SettingsTab, HomeworkManagerData, DEFAULT_DATA, defaultLogo } from "./settings";

import HomeworkModal from './modal'

export default class HomeworkManagerPlugin extends Plugin {
	data: HomeworkManagerData;

	async onload() {
		await this.fetchData();

		this.addSettingTab(new SettingsTab(this.app, this));

		// Open homework ribbon button
		const ribbonToggle = this.addRibbonIcon(defaultLogo, 'Open homework', (evt: MouseEvent) => {
			//new HomeworkModal(this.app, this).open();
		});

		// Perform additional things with the ribbon
		ribbonToggle.addClass('my-plugin-ribbon-class');

		// Open homework command
		this.addCommand({
			id: 'open-homework',
			name: 'Open homework',
			callback: () => {
				//new HomeworkModal(this.app, this).open();
			}
		});
	}

	async fetchData() {
		const foundData = Object.assign({}, await this.loadData());
		let newData = foundData;

		// Check if legacy data and convert
		if (foundData.data === undefined) {
			newData = Object.assign({}, DEFAULT_DATA);
			newData.data["View 1"] = foundData;
		}

		this.data = newData;
		this.writeData();
	}

	async writeData() {
		await this.saveData(this.data);
	}
}