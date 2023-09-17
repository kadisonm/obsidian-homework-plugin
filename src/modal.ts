import HomeworkPlugin from './main';
import { App, Modal, Notice, Setting  } from 'obsidian';

let editMode = false;

export default class HomeworkModal extends Modal {
	plugin: HomeworkPlugin;
    headingClass: HTMLDivElement;
    subjectsClass: HTMLDivElement;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);

        const {contentEl} = this;

		this.plugin = plugin;
        this.headingClass = contentEl.createEl("div", { cls: "HeadingSection" });
        this.subjectsClass = contentEl.createEl("div");
	}

	onOpen() {
		const {contentEl} = this;

		const headingText = this.headingClass.createEl("h1", { text: "Homework", cls: "heading_text" });
        const editButton = this.headingClass.createEl("button", {text: "✎", cls: "heading_add", parent: headingText });

        this.loadSubjects();

        editButton.addEventListener("click", (click) => {
            editMode = !editMode;
            this.loadSubjects();

            if (editMode)
                editButton.setText("🕮"); 
            else
                editButton.setText("✎"); 
        });
	}

	onClose() {   
		const {contentEl} = this;
		contentEl.empty();
	}

    addSubjectData(subjectName: string) {
        this.plugin.data = Object.assign({}, this.plugin.data, {...this.plugin.data, [subjectName] : []}); 
        this.plugin.saveHomeworkData();
        this.loadSubjects();
    }

    loadSubjects()
    {
        this.subjectsClass.empty();

        if (editMode) {
            const newSubjectButton = this.subjectsClass.createEl("button", {text: " Add Subject ", cls: "heading_add" });

            newSubjectButton.addEventListener("click", (click) => {
                let newSubjectName = "";

                const promptClass = this.headingClass.createEl("div", { cls: "promptClass" });

                const promptName = new Setting(promptClass)
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
                        this.addSubjectData(newSubjectName);           
                        promptClass.empty();
                }));
            });    
        }
        
        for (const subjectKey in this.plugin.data)
        {
            let subjectClass = this.subjectsClass.createEl("div", { cls: "subject" });

            let subjectName = subjectClass.createEl("div", {text: subjectKey, cls: "subject_name" });
            
            if (editMode) {
                let removeSubjectButton = subjectClass.createEl("button", {text: "X", cls: "subject_add", parent: subjectName });

                removeSubjectButton.addEventListener("click", (click) => {
                    Reflect.deleteProperty(this.plugin.data, subjectKey);
                    this.plugin.saveHomeworkData();

                    subjectClass.empty();
                });
            }
            else {
                let newTaskButton = subjectClass.createEl("button", {text: "＋", cls: "subject_add", parent: subjectName });
            }
        }
    }
}