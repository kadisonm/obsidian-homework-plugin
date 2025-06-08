import TickawayPlugin from './main';
import { App, Modal } from 'obsidian';
import { render } from "preact";
import { useState } from 'preact/hooks';
import ModalComponent from "src/ui/modal";


export default class MainModal extends Modal {
	plugin: TickawayPlugin

	constructor(app: App, plugin: TickawayPlugin) {
		super(app);
		this.plugin = plugin;
	}

    async onOpen() {
		this.containerEl.addClass("tickaway");
		render(<ModalComponent modal={this} data={this.plugin.data} project={this.plugin.data.getLastProject().id} />, this.contentEl);
	}

	async onClose() {
        render(null, this.contentEl);
	}

	closeModal() {
		this.close();
	}
}