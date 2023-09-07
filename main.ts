import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface HomeworkSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: HomeworkSettings = {
	mySetting: 'default'
}

var homework = [
	{
	  name: "How to Take Smart Notes",
	  completed: false,
	},
];

export default class HomeworkPlugin extends Plugin {
	settings: HomeworkSettings;

	async onload() {
		await this.loadSettings();
		//new Notice('This is a notice!');

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
		
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });

		// Adds setting tab
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class HomeworkModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;

		contentEl.createEl("h1", { text: "Homework" });

		// Set up Subject
		const subject = contentEl.createEl("div", { cls: "subject" });

		var subjectName = subject.createEl("div", {text: "Subject", cls: "subject_name" });

		// Subject Task Add Button

		var button = subject.createEl("button", {text: "＋", cls: "subject_add", parent: subjectName });

		button.addEventListener("click", (click) => {
			new Notice('This is a notice!');
		});
		
		// Display Tasks
		const task = contentEl.createEl("div", { cls: "task" });
			
		task.createEl("input", {type: "checkbox", cls: "task_checkbox" });
		task.createEl("div", { text: "Test Name", cls: "task_name" });
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: HomeworkPlugin;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
