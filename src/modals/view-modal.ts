import HomeworkPlugin from '../main';
import { App, Modal, setIcon, Setting } from 'obsidian';

export default class ViewManagerModal extends Modal {
	plugin: HomeworkPlugin;
	public onClosing: () => void;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const {contentEl} = this;

		
		const title = contentEl.createEl("h1", { text: "View Manager" });

		this.plugin.data.views.forEach((view) => {

			const viewContainer = contentEl.createDiv("view-container");

			viewContainer.style.display = "flex";
			viewContainer.style.flexDirection = "row";

			const viewTitle = viewContainer.createEl("input", { value: view.name, type: "text", cls: "hidden-textbox subject-box" });

			viewTitle.addEventListener("change", () => {
				view.name = viewTitle.value;
				this.plugin.writeData();
			});

			const deleteButton = viewContainer.createEl("button", { cls: "delete-button hidden-textbox" });

			setIcon(deleteButton, "trash-2");

			deleteButton.addEventListener("click", () => {
				this.plugin.data.views = this.plugin.data.views.filter((v) => v !== view);
				this.plugin.writeData();
				this.onClose();
				this.onOpen();
			});
		});

		const newViewContainer = contentEl.createEl("form");

		const newViewer = newViewContainer.createEl("input", { type: "text", cls: "hidden-textbox subject-box", placeholder: "New View" });

		newViewContainer.addEventListener("submit", (event) => {
			event.preventDefault();
			this.plugin.data.views.push({ name: newViewer.value, subjects: [], tasks: [] });
			this.plugin.writeData();
			this.onClose();
			this.onOpen();
		});

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
		this.onClosing();
		contentEl.empty();
	}
}
