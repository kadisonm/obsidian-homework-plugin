import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

import {DEFAULT_SETTINGS, HomeworkSettings, HomeworkSettingTab} from './settings'
import HomeworkModal from './modal'

export default class HomeworkPlugin extends Plugin {
	settings: HomeworkSettings

	async onload() {
		// Set up settings
		await this.loadSettings();
    	this.addSettingTab(new HomeworkSettingTab(this.app, this));

		// Open homework ribbon button
		const ribbonToggle = this.addRibbonIcon('book', 'Open Homework', (evt: MouseEvent) => {
			new HomeworkModal(this.app).open();
		});

		// Perform additional things with the ribbon
		ribbonToggle.addClass('my-plugin-ribbon-class');

		// Open homework command
		this.addCommand({
			id: 'open-homework',
			name: 'Open Homework',
			callback: () => {
				new HomeworkModal(this.app).open();
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	
	async saveSettings() {
		await this.saveData(this.settings);
	}
}