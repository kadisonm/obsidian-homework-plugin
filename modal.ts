import { App, Modal, Notice, Setting  } from 'obsidian';

export default class HomeworkModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;

		contentEl.createEl("h1", { text: "Homework" });

		// Set up Subject
		var subject = contentEl.createEl("div", { cls: "subject" });

		var subjectName = subject.createEl("div", {text: "Subject", cls: "subject_name" });
		var subjectButton = subject.createEl("button", {text: "＋", cls: "subject_add", parent: subjectName });

        var promptClass = contentEl.createEl("div", { cls: "promptClass" });

		subjectButton.addEventListener("click", (click) => {
			new Notice('This is a notice!');

            var toDoName = "";

            var promptName = new Setting(promptClass)
            .setName("New Task")
            .addText((text) =>
                text.onChange((value) => {
                toDoName = value
            }));

            var confirmName = new Setting(promptClass)
            .addButton((btn) =>
                btn
                .setButtonText("✓")
                .setCta()
                .onClick(() => {
                    
                    promptClass.empty();
                    this.createTask(toDoName);
            }));
		});
	}

    createTask(name: string) {
        const {contentEl} = this;

        var task = contentEl.createEl("div", { cls: "task" });
		
		var taskButton = task.createEl("button", {cls: "task_check" });
		var taskContainer = task.createEl("label", { text: name, cls: "task_container", parent: taskButton});
		
		taskButton.addEventListener("click", (click) => {
			new Notice('Completed!');
		});
    }

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}