import { Plugin } from 'obsidian';
import { SettingsTab, HomeworkManagerData, DEFAULT_DATA, defaultLogo } from "./settings";
import DataEditor from './data-editor';

import HomeworkModal from './homework-modal'

export default class HomeworkManagerPlugin extends Plugin {
	data: HomeworkManagerData;
	dataEditor: DataEditor;

	async onload() {
		await this.fetchData();

		this.dataEditor = new DataEditor(this);

		this.addSettingTab(new SettingsTab(this.app, this));

		// Open homework ribbon button
		const ribbonToggle = this.addRibbonIcon(defaultLogo, 'Open homework', (evt: MouseEvent) => {
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

	async onunload() {
		await this.writeData();
	}

	async fetchData() {
		const foundData = Object.assign({}, await this.loadData());
		let newData = foundData;

		// Check if legacy data and convert
		if (foundData.views === undefined) {
			let reformattedSubjects = new Array();

			for (const subjectKey in foundData) {
				let subject = {
					name: subjectKey,
					tasks: new Array<any>()
				}

				const oldSubject = foundData[subjectKey];

				for (const taskKey in oldSubject) {
					const task = {
						name: taskKey,
						page: oldSubject[taskKey].page,
      					date: oldSubject[taskKey].date
					}

					subject.tasks.push(task);
				}

				reformattedSubjects.push(subject);
			}

			const view = {
				name: "View 1",
				subjects: reformattedSubjects,
				tasks: new Array<any>()
			}

			newData = Object.assign({}, DEFAULT_DATA);
			newData.views.push(view);
		}

		this.data = newData;
		await this.writeData();
	}

	async writeData() {
		await this.saveData(this.data);
	}
}