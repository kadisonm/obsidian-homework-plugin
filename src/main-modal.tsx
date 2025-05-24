import TickawayPlugin from './main';
import { App, Modal } from 'obsidian';
import { render } from "preact";
import ModalComponent from "src/ui/modal";


export default class MainModal extends Modal {
	plugin: TickawayPlugin

	constructor(app: App, plugin: TickawayPlugin) {
		super(app);
		this.plugin = plugin;
	}

    async onOpen() {
		this.containerEl.addClass("homework-manager");
		render(<ModalComponent modal={this} />, this.contentEl);
	}

	async onClose() {
        render(null, this.contentEl);
	}

	closeModal() {
		this.close();
	}
}