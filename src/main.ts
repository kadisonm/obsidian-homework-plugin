import { Plugin } from 'obsidian';
import { SettingsTab, defaultLogo } from "./settings";
import { DataManager } from './data-manager';
import MainModal from './main-modal'

export default class TickawayPlugin extends Plugin {
	data: DataManager;

	async onload() {
		this.data = new DataManager(this);

		this.addSettingTab(new SettingsTab(this.app, this));
		
		// Open modal ribbon button
		this.addRibbonIcon(defaultLogo, 'Open homework', (evt: MouseEvent) => {
			new MainModal(this.app, this).open();
		});

		// Open modal
		this.addCommand({
			id: 'open-homework',
			name: 'Open homework',
			callback: () => {
				new MainModal(this.app, this).open();
			}
		});
	}

	async onunload() {
		await this.data.save();
	}
}