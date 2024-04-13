import { Plugin } from 'obsidian';
import { SettingsTab, defaultLogo } from "./settings";
import { HomeworkManagerData } from './data-editor';
import { DataEditor, DEFAULT_DATA} from './data-editor';
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

		// Set data to be default
		this.data = Object.assign({}, DEFAULT_DATA);

		// Load data from file
		let foundData = Object.assign({}, await this.loadData());

		// Convert legacy or reformat data
        if (foundData.views === undefined) {
            await this.dataEditor.convertFromLegacy(foundData);
        } else {
			await this.dataEditor.formatData(foundData);
		}

		console.log(this.data)

		await this.writeData();
	}

	async writeData() {
		await this.saveData(this.data);
	}
}