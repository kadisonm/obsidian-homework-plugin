import HomeworkManagerPlugin from '../main';
import { App, Modal } from 'obsidian';

import { render } from "preact";

import Homework from "src/ui/homework/homework";

export default class HomeworkModal extends Modal {
	plugin: HomeworkManagerPlugin;

	constructor(app: App, plugin: HomeworkManagerPlugin) {
		super(app);
		this.plugin = plugin;
	}

    async onOpen() {
		this.containerEl.addClass("homework-manager");
        render(<Homework data={this.plugin.data.views}/>, this.contentEl);
	}

	async onClose() {
        render(null, this.contentEl);
	}
}