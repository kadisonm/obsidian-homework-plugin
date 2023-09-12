import { create } from 'domain';
import { App, Modal, Notice, Setting  } from 'obsidian';

export default class HomeworkModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;

		var headingClass = contentEl.createEl("div", { cls: "HeadingSection" });
		var headingText = headingClass.createEl("h1", { text: "Homework", cls: "heading_text" });
		var newSubject = headingClass.createEl("button", {text: " Add Subject ", cls: "heading_add", parent: headingText });

		// Set up Subject
		

		this.createSubject("test2");
	
	}

	createSubject(name: string) {
		const {contentEl} = this;

        var subject = contentEl.createEl("div", { cls: "subject" });

		var subjectName = subject.createEl("div", {text: name, cls: "subject_name" });
		var newTaskButton = subject.createEl("button", {text: "＋", cls: "subject_add", parent: subjectName });

		newTaskButton.addEventListener("click", (click) => {
			new Notice('This is a notice!');

            var toDoName = "";

            var promptClass = contentEl.createEl("div", { cls: "promptClass" });

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