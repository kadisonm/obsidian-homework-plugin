import HomeworkPlugin from '../main';
import { App, Modal, setIcon, Setting } from 'obsidian';

export default class ViewManagerModal extends Modal {
	plugin: HomeworkPlugin;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const {contentEl} = this;

		
		const title = contentEl.createEl("h1", { text: "View Manager" });

		new Setting(contentEl)
		.addButton((btn) =>
			btn
			.setButtonText("Done")
			.setCta()
			.onClick(() => {
				this.close();
			}));
	}

	onClose() {   
		const {contentEl} = this;
		contentEl.empty();
	}
}