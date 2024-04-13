import HomeworkManagerPlugin from '../main';
import { App, Modal } from 'obsidian';
import { render } from "preact";
import ModalComponent from "src/ui/modal";

export default class HomeworkModal extends Modal {
	plugin: HomeworkManagerPlugin;

	constructor(app: App, plugin: HomeworkManagerPlugin) {
		super(app);
		this.plugin = plugin;
	}

    async onOpen() {
		this.containerEl.addClass("homework-manager");
        //render(<ModalComponent modal={this} plugin={this.plugin} app={this.app}/>, this.contentEl);
	}

	async onClose() {
        //render(null, this.contentEl);
	}

	closeModal() {
		this.close();
	}
}