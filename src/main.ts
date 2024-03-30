import { Plugin } from 'obsidian';
import { SettingsTab, defaultLogo } from "./settings";
import { HomeworkManagerData } from './data-editor';
import DataEditor from './data-editor';

import HomeworkModal from './elements/homework-modal'

export default class HomeworkManagerPlugin extends Plugin {
	data: HomeworkManagerData;
	dataEditor: DataEditor;

	async onload() {
		await this.fetchData();

		this.addSettingTab(new SettingsTab(this.app, this));

		// Open modal ribbon button
		const ribbonToggle = this.addRibbonIcon(defaultLogo, 'Open homework', (evt: MouseEvent) => {
			new HomeworkModal(this.app, this).open();
		});

		// Open modal
		this.addCommand({
			id: 'open-homework',
			name: 'Open homework',
			callback: () => {
				new HomeworkModal(this.app, this).open();
			}
		});
	}

	async onunload() {
		await this.writeData();
	}

	async fetchData() {
		this.dataEditor = new DataEditor(this);

		const foundData = Object.assign({}, await this.loadData());
		
		let newData = foundData;

		// Legacy data -> needs to convert
        if (foundData.views === undefined) {
            newData = this.dataEditor.convertFromLegacy(foundData);
        }

		newData = this.dataEditor.formatData(newData);

		this.data = newData;
		await this.writeData();
	}

	async writeData() {
		await this.saveData(this.data);
	}
}