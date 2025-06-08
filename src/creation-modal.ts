import TickawayPlugin from './main';
import { App, ButtonComponent, Modal, setIcon, Setting } from 'obsidian';
import { render } from "preact";
import { StringTypes } from './data-manager';
import { Section } from './data-manager';

export default class CreationModal extends Modal {
	plugin: TickawayPlugin
    type: StringTypes
    parent: string
    finished: () => void;

	constructor(app: App, plugin: TickawayPlugin, type: StringTypes, parent: string, finished: () => void) {
		super(app);
		this.plugin = plugin;
        this.type = type;
        this.parent = parent;
        this.finished = finished;
	}

    async createSection() {
        const {contentEl} = this;

        const title = contentEl.createEl("h1", { text: "Add new section" });

        const inputText = contentEl.createEl("input", {type: "text", placeholder: "Enter section name"});
        inputText.focus();

        const buttonDiv = contentEl.createEl("div");
        buttonDiv.addClass("creation-modal-footer");

        new Setting(contentEl)
		.addButton((btn) =>
			btn
			.setButtonText("Done")
			.setCta()
			.onClick(() => {
                this.plugin.data.addItem(new Section(inputText.value.trim(), this.parent, ""));
                this.finished();
				this.close();
			}));
    }

    async onOpen() {
		const {contentEl} = this;

        if (this.type === "Section") {
            this.createSection();
        }
	}

	async onClose() {
		this.contentEl.empty();
	}
}