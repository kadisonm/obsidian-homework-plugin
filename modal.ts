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

		this.loadSubjects();

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
                    this.createSubject(newSubjectName, true);
            }));
		});
	}

	loadSubjects() {
		let file = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.homeworkPagePath}`);

		if (file instanceof TFile) {
			this.app.vault.read(file).then((fileContent) => {
				let currentSubjectIndex = 0

				while (true) {
					// Find data

					if (fileContent.length == 0)
						break;

					let firstSubjectStart = fileContent.indexOf("&", currentSubjectIndex);
					let firstSubjectEnd = fileContent.indexOf("&", firstSubjectStart + 1);

					if (firstSubjectEnd != -1) {
						let subjectName = fileContent.substring(firstSubjectStart + 1, firstSubjectEnd);

						let nextSubject = fileContent.indexOf("&", firstSubjectEnd + 1);

						if (nextSubject == -1)
							nextSubject = fileContent.length;

						let subjectTasks = fileContent.substring(firstSubjectEnd + 1, nextSubject);

						//Display Data

						let subject = this.createSubject(subjectName, false);
					
						if (subjectTasks.length > 0)
						{
							let amountOfTasks = 0;

							for (let i = 0; i < subjectTasks.length; i++) {
								let letter = subjectTasks[i];

								if (letter == "+")
								{
									amountOfTasks++;
								}
							}

							amountOfTasks /= 2;

							let taskIndex = 0;

							for (let i = 0; i < amountOfTasks; i++) {
								let taskStart = subjectTasks.indexOf("+", taskIndex);
								let taskEnd = subjectTasks.indexOf("+", taskStart + 1);

								let taskName = subjectTasks.substring(taskStart + 1, taskEnd);

								this.createTask(taskName, subject, subjectName, false);

								taskIndex = taskEnd + 1;

								if (taskIndex == subjectTasks.length)
									break;
							}
						}
						
						currentSubjectIndex = nextSubject;

						if (currentSubjectIndex == fileContent.length)
							break;	
					}	
					else {
						break;
					}
				}
			});
		}
	}

	createSubject(name: string, newData: boolean) {
		const {contentEl} = this;

		if (newData)
		{
			let file = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.homeworkPagePath}`);

			if (file instanceof TFile) {
				this.writeSubjectFile(file, name);
			}		
		}
	
		let subject = contentEl.createEl("div", { cls: "subject" });

		let subjectName = subject.createEl("div", {text: name, cls: "subject_name" });
		let newTaskButton = subject.createEl("button", {text: "＋", cls: "subject_add", parent: subjectName });
		let removeSubjectButton = subject.createEl("button", {text: "X", cls: "subject_add", parent: subjectName });

		removeSubjectButton.addEventListener("click", (click) => {
			let file = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.homeworkPagePath}`);

			if (file instanceof TFile) {
				subject.empty();
				this.removeSubjectFile(file, name);
			}	
		});
		
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

					this.createTask(toDoName, subject, name, true);
			}));	
		});

		return subject;
    }

    createTask(name: string, subject: HTMLDivElement, subjectName: string, newData: boolean) {
        let task = subject.createEl("div", { cls: "task" });
		
		let taskButton = task.createEl("button", {cls: "task_check" });
		let taskContainer = task.createEl("label", { text: name, cls: "task_container", parent: taskButton});

		let file = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.homeworkPagePath}`);

		if (newData)
		{
			if (file instanceof TFile) {
				this.writeTaskFile(file, subjectName, name);
			}	
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

			let subjectStart = fileContent.indexOf("&", position + 1);
			let subjectEnd = fileContent.indexOf("&", subjectStart + 1);

			if (subjectEnd == -1)
				subjectEnd = fileContent.length;

			if (position != -1) {
				let toDoString = "+" + name + "+"
				let newFileContent = fileContent.slice(0, subjectEnd) + toDoString + fileContent.slice(subjectEnd);
				
				this.app.vault.modify(file, newFileContent) 
			}
		});
	}

	removeSubjectFile(file: TFile, subject: string ) {
		this.app.vault.read(file).then((fileContent) => {
			let subjectName = "&" + subject + "&";
			let subjectStart = fileContent.search(subjectName);

			if (subjectStart != -1) {
				let subjectNameEnd = fileContent.indexOf("&", subjectStart + 1);

				if (subjectNameEnd != -1) {
					let subjectEnd = fileContent.indexOf("&", subjectNameEnd + 1);;

					if (subjectEnd == -1) {
						subjectEnd = fileContent.length;
					}

					let subjectString = fileContent.substring(subjectStart, subjectEnd)

					let newFileContent = fileContent.replace(subjectString, "")

					this.app.vault.modify(file, newFileContent);
				}
			}
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