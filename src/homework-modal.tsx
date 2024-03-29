import HomeworkManagerPlugin from './main';
import { App, Modal } from 'obsidian';

import { render } from "preact";

import { Homework } from "./ui/homework";

export default class HomeworkModal extends Modal {
	preactElement: HTMLDivElement;
	plugin: HomeworkManagerPlugin;

	constructor(app: App, plugin: HomeworkManagerPlugin) {
		super(app);
		this.plugin = plugin;
	}

    async onOpen() {
		this.containerEl.addClass("homework-manager");

		const views = this.plugin.data.views;
		const viewName = views[0].name;

		this.preactElement = this.contentEl.createDiv("div");
        render(<Homework name = {viewName}/>, this.preactElement);
	}

	async onClose() {
        render(null, this.preactElement);
	}
}