import HomeworkPlugin from './main';
import { Workspace, App, Modal, Notice, Setting, TFile  } from 'obsidian';
import { loadHomeworkData, saveHomeworkData}  from './data';
import { SuggestFileModal } from './suggestModal';

export default class HomeworkModal extends Modal {
	plugin: HomeworkPlugin;
    headingClass: HTMLDivElement;
    subjectsClass: HTMLDivElement;
    data: any;
    editMode: Boolean;

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
        this.editMode = false;

		const headingText = this.headingClass.createEl("h1", { text: "Homework", cls: "heading_text" });
        const editButton = this.headingClass.createEl("button", {text: "✎", cls: "heading_add", parent: headingText });

        this.loadSubjects();

        editButton.addEventListener("click", (click) => {
            this.editMode = !this.editMode;
            this.loadSubjects();

            if (this.editMode)
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

        if (this.editMode) {
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
                        this.data[newSubjectName] = {};
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

            if (this.editMode) {
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
                    let page = "";
        
                    let promptClass = subjectClass.createEl("div", { cls: "promptClass" });
        
                    let promptName = new Setting(promptClass)
                    .setName("New Task")
                    .addText((text) =>
                        text.onChange((value) => {
                            taskName = value
                    }));

                    const suggestButton = promptClass.createEl("button", {text: "File" });

                    suggestButton.addEventListener("click", (click) => {
                        new SuggestFileModal(this.app, (result) => {
                            page = result.path;
                            suggestButton.setText(result.name);
                        }).open();
                    });

                    const dateField = promptClass.createEl("input", {type: "date"});
        
                    let confirmName = new Setting(promptClass)
                    .addButton((btn) =>
                        btn
                        .setButtonText("✓")
                        .setCta()
                        .onClick(() => {  
                            promptClass.empty();

                            this.data[subjectKey][taskName] = {
                                page : page,
                                date : dateField.value,
                            };

                            saveHomeworkData(this.data);

                            this.createTask(subjectClass, subjectKey, taskName);
                    }));	
                });
            }

            for (const taskKey in this.data[subjectKey]) {
                this.createTask(subjectClass, subjectKey, `${taskKey}`)
            }
        }
    }

    createTask(subjectClass : HTMLDivElement, subjectKey : string, taskName : string) {
        let taskClass = subjectClass.createEl("div", { cls: "task" });
		
		let taskButton = taskClass.createEl("button", {cls: "task_check" });

        let filePath = this.data[subjectKey][taskName].page;

        let taskText;

        if (filePath == "") {
            taskText = taskClass.createEl("label", { text: taskName, cls: "task_label", parent: taskButton});
        }
        else {
            taskText = taskClass.createEl("button", { text: taskName, cls: "task_text", parent: taskButton});
        }
		
        let date = this.data[subjectKey][taskName].date;

        let yearIndex = date.indexOf("-");
        let monthIndex = date.indexOf("-", yearIndex + 1);
        let dayIndex = date.indexOf("-", monthIndex + 1);

        let year = date.slice(0, yearIndex);
        let month = date.slice(yearIndex + 1, monthIndex);
        let day = date.slice(monthIndex + 1);

        if (month != "")
            month += "/";

        if (day != "")
            day += "/";

        let newDate = day + month + year;

        taskClass.createEl("label", { text: newDate, cls: "task_date" });

        taskText.addEventListener("click", (click => {
            if (filePath != "") {
                let file = this.app.vault.getAbstractFileByPath(filePath);

                if (file instanceof TFile)
                {
                    this.app.workspace.getLeaf().openFile(file);
                    this.close();
                }       
            }
        }))
		
		taskButton.addEventListener("click", (click) => {
            Reflect.deleteProperty(this.data[subjectKey], taskName);
            saveHomeworkData(this.data);
            
            taskClass.empty();
		});
    }
}