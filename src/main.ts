import { Plugin } from 'obsidian';
import { SettingsTab, defaultLogo } from "./settings";
import { DataManager } from './data';
import HomeworkModal from './elements/homework-modal'

export default class HomeworkManagerPlugin extends Plugin {
	data: DataManager;

	async onload() {
		this.data = new DataManager(this);

		this.addSettingTab(new SettingsTab(this.app, this));
		
		// Open modal ribbon button
		this.addRibbonIcon(defaultLogo, 'Open homework', (evt: MouseEvent) => {
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
		await this.data.save();
	}
}