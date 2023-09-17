import HomeworkPlugin from './main';
import { App, Modal, Notice, Setting  } from 'obsidian';
import {loadHomeworkData, saveHomeworkData} from './data'

let editMode = false;

export default class HomeworkModal extends Modal {
	plugin: HomeworkPlugin;
    headingClass: HTMLDivElement;
    subjectsClass: HTMLDivElement;
    data: any;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);

        const {contentEl} = this;

		this.plugin = plugin;
        this.headingClass = contentEl.createEl("div", { cls: "HeadingSection" });
        this.subjectsClass = contentEl.createEl("div");
	}

	async onOpen() {
		const {contentEl} = this;

        this.data = await loadHomeworkData();

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

    async loadSubjects()
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
                        this.data[newSubjectName] = new Array();
                        saveHomeworkData(this.data);
                        this.loadSubjects();        
                        promptClass.empty();
                }));
            });    
        }
        
        for (const subjectKey in this.data)
        {
            let subjectClass = this.subjectsClass.createEl("div", { cls: "subject" });

            let subjectName = subjectClass.createEl("div", {text: subjectKey, cls: "subject_name" });

            if (editMode) {
                let removeSubjectButton = subjectClass.createEl("button", {text: "X", cls: "subject_add", parent: subjectName });

                removeSubjectButton.addEventListener("click", (click) => {
                    Reflect.deleteProperty(this.data, subjectKey);
                    saveHomeworkData(this.data);

                    subjectClass.empty();
                });
            }
            else {
                let newTaskButton = subjectClass.createEl("button", {text: "＋", cls: "subject_add", parent: subjectName });

                newTaskButton.addEventListener("click", (click) => {
                    let taskName = "";
        
                    let promptClass = subjectClass.createEl("div", { cls: "promptClass" });
        
                    let promptName = new Setting(promptClass)
                    .setName("New Task")
                    .addText((text) =>
                        text.onChange((value) => {
                            taskName = value
                    }));
        
                    let confirmName = new Setting(promptClass)
                    .addButton((btn) =>
                        btn
                        .setButtonText("✓")
                        .setCta()
                        .onClick(() => {  
                            promptClass.empty();
                            
                            let array = new Array();
                            array = array.concat(this.data[subjectKey]);

                            array.push(taskName)

                            this.data[subjectKey] = array;
                            saveHomeworkData(this.data);

                            this.createTask(subjectClass, subjectKey, taskName);
                    }));	
                });
            }

            for (let i = 0; i < this.data[subjectKey].length; i++) {
                this.createTask(subjectClass, subjectKey, this.data[subjectKey][i])
            }
        }
    }

    createTask(subjectClass : HTMLDivElement, subjectKey : string, taskName : string) {
        let taskClass = subjectClass.createEl("div", { cls: "task" });
		
		let taskButton = taskClass.createEl("button", {cls: "task_check" });
		taskClass.createEl("label", { text: taskName, cls: "task_container", parent: taskButton});
		
		taskButton.addEventListener("click", (click) => {
            let array = new Array();
            array = array.concat(this.data[subjectKey]);
            array = array.filter(function(e) { return e !== taskName })

            this.data[subjectKey] = array;

            saveHomeworkData(this.data);
            
            taskClass.empty();
		});
    }
}