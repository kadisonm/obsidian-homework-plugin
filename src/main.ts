import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

import {DEFAULT_SETTINGS, HomeworkSettings, HomeworkSettingTab} from './settings'
import {HomeworkData} from './data'
import HomeworkModal from './modal'

export default class HomeworkPlugin extends Plugin {
	settings: HomeworkSettings
	data: {}

	async onload() {
		// Set up settings
		await this.loadSettings();

    	this.addSettingTab(new HomeworkSettingTab(this.app, this));

		// Open homework ribbon button
		const ribbonToggle = this.addRibbonIcon('book', 'Open Homework', (evt: MouseEvent) => {
			new HomeworkModal(this.app, this).open();
		});

		// Perform additional things with the ribbon
		ribbonToggle.addClass('my-plugin-ribbon-class');

		// Open homework command
		this.addCommand({
			id: 'open-homework',
			name: 'Open Homework',
			callback: () => {
				new HomeworkModal(this.app, this).open();
			}
		});

		this.loadHomeworkData();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	
	async saveSettings() {
		await this.saveData(this.settings);
	}

	async loadHomeworkData() {
		const jsonPath = this.app.vault.configDir + "/plugins/Obsidian-Homework-Plugin/homeworkData.json";
        const result = await this.app.vault.adapter.read(jsonPath);
        this.data = JSON.parse(result);
	}

	saveHomeworkData() {
		const jsonPath = this.app.vault.configDir + "/plugins/Obsidian-Homework-Plugin/homeworkData.json";
    
        this.app.vault.adapter.write(jsonPath, JSON.stringify(this.data));
	}
}