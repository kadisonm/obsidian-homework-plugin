import HomeworkPlugin from './main';
import { create } from 'domain';
import { App, Modal, Notice, Setting, TAbstractFile, TFile  } from 'obsidian';


export default class HomeworkModal extends Modal {
	plugin: HomeworkPlugin;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const {contentEl} = this;

		let headingClass = contentEl.createEl("div", { cls: "HeadingSection" });
		let headingText = headingClass.createEl("h1", { text: "Homework", cls: "heading_text" });
		let newSubject = headingClass.createEl("button", {text: " Add Subject ", cls: "heading_add", parent: headingText });

		newSubject.addEventListener("click", (click) => {
            let newSubjectName = "";

            let promptClass = contentEl.createEl("div", { cls: "promptClass" });

            let promptName = new Setting(promptClass)
            .setName("New Subject")
            .addText((text) =>
                text.onChange((value) => {
				newSubjectName = value
            }));

            let confirmName = new Setting(promptClass)
            .addButton((btn) =>
                btn
                .setButtonText("✓")
                .setCta()
                .onClick(() => {
                    
                    promptClass.empty();
                    this.createSubject(newSubjectName);
            }));
		});
	}

	createSubject(name: string) {
		const {contentEl} = this;

        let subject = contentEl.createEl("div", { cls: "subject" });

		let subjectName = subject.createEl("div", {text: name, cls: "subject_name" });
		let newTaskButton = subject.createEl("button", {text: "＋", cls: "subject_add", parent: subjectName });

		let file = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.homeworkPagePath}`);

		if (file instanceof TFile) {
			this.writeSubjectFile(file, name);
		}

		newTaskButton.addEventListener("click", (click) => {
            let toDoName = "";

            let promptClass = subject.createEl("div", { cls: "promptClass" });

            let promptName = new Setting(promptClass)
            .setName("New Task")
            .addText((text) =>
                text.onChange((value) => {
                toDoName = value
            }));

            let confirmName = new Setting(promptClass)
            .addButton((btn) =>
                btn
                .setButtonText("✓")
                .setCta()
                .onClick(() => {  
                    promptClass.empty();

                    this.createTask(toDoName, subject, name);
            }));
		});
    }

    createTask(name: string, subject: HTMLDivElement, subjectName: string) {
        let task = subject.createEl("div", { cls: "task" });
		
		let taskButton = task.createEl("button", {cls: "task_check" });
		let taskContainer = task.createEl("label", { text: name, cls: "task_container", parent: taskButton});

		let file = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.homeworkPagePath}`);

		if (file instanceof TFile) {
			this.writeTaskFile(file, subjectName, name);
		}
		
		taskButton.addEventListener("click", (click) => {
			task.empty();

			if (file instanceof TFile) {
				this.removeTaskFile(file, subjectName, name);
			}
		});
    }

	writeSubjectFile(file: TFile, name: string ) {
		this.app.vault.read(file).then((fileContent) => {
			let subjectString = "&" + name + "&";

			let newFileContent = fileContent + subjectString;
			
			this.app.vault.modify(file, newFileContent);
		});
	}

	writeTaskFile(file: TFile, subject: string, name: string ) {
		this.app.vault.read(file).then((fileContent) => {
			let subjectName = "&" + subject + "&";
			let position = fileContent.search(subjectName);

			if (position != -1) {
				let toDoString = "+" + name + "+"
				let newPosition = position + subjectName.length;
				let newFileContent = fileContent.slice(0, newPosition) + toDoString + fileContent.slice(newPosition);
				
				this.app.vault.modify(file, newFileContent) 
			}
		});
	}

	removeSubjectFile(file: TFile, name: string ) {
		this.app.vault.read(file).then((fileContent) => {
			let subjectString = "&" + name + "&";

			let newFileContent = fileContent + subjectString;
			
			this.app.vault.modify(file, newFileContent);
		});
	}

	removeTaskFile(file: TFile, subject: string, name: string ) {
		this.app.vault.read(file).then((fileContent) => {
			let subjectName = "&" + subject + "&";
			let startPosition = fileContent.search(subjectName);
			
			if (startPosition != -1) {
				let endPosition = fileContent.indexOf("&", startPosition + subjectName.length);

				if (endPosition = -1)
					endPosition = fileContent.length - 1;

				let refinedString = fileContent.substring(startPosition + subjectName.length, endPosition);

				let toDoString = "+" + name + "+"

				let taskPosition = 0;

				if (refinedString.length > toDoString.length) {
					taskPosition = refinedString.indexOf(name) - 1;
				}

				if (taskPosition != -1)
				{
					new Notice("Found task");
					let taskStart = startPosition + subjectName.length + taskPosition;
					let taskEnd = taskStart + toDoString.length;

					let newFileContent = fileContent.substring(0, taskStart) + fileContent.substring(taskEnd);

					this.app.vault.modify(file, newFileContent) 
				}
			}
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}