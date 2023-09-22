import HomeworkPlugin from './main';
import { Workspace, App, Modal, Notice, Setting, TFile  } from 'obsidian';
import { loadHomeworkData, saveHomeworkData}  from './data';
import { SuggestFileModal } from './suggestModal';
import { icons } from './icons';

export default class HomeworkModal extends Modal {
	plugin: HomeworkPlugin;
    headingClass: HTMLDivElement;
    loadClass: HTMLDivElement;
    data: any;
    editMode: Boolean;
    creating: Boolean;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);

        const {contentEl} = this;

		this.plugin = plugin;
        this.headingClass = contentEl.createEl("div");
        this.loadClass = contentEl.createEl("div");
	}

	async onOpen() {
		const {contentEl} = this;

        this.data = await loadHomeworkData();
        this.editMode = false;
        this.creating = false;

		const headingText = this.headingClass.createEl("h1", { text: "Homework", cls: "title" });
        const editButton = this.headingClass.createEl("div", {cls: "edit-button" });
       
        this.loadSubjects();

        editButton.addEventListener("click", (click) => {
            this.editMode = !this.editMode;
            this.loadSubjects();

            if (this.editMode) {
                editButton.style.backgroundImage = `url(${icons['book-open']})`; 
            }
            else {
                editButton.style.backgroundImage = `url(${icons['pen-line']})`; 
            }
        });
	}

	onClose() {   
		const {contentEl} = this;
		contentEl.empty();
	}

    async loadSubjects()
    {
        this.loadClass.empty();

        if (this.editMode) {
            const addSubjectButton = this.loadClass.createEl("div", { cls: "add-subject-button" });
            addSubjectButton.createEl('div', { cls: "new-subject-image"});
            addSubjectButton.createEl("p", { text: "Add a subject" });

            addSubjectButton.addEventListener("click", (click) => {
                if (this.creating == false) {
                    this.creating = true;

                    let newSubjectName = "";

                    const promptClass = this.loadClass.createEl("div", { cls: "promptClass" });

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
                            this.creating = false;      
                            promptClass.empty();
                    }));    
                } 
            });    
        }
        
        for (const subjectKey in this.data) {
            let newSubjectClass = this.loadClass.createEl("div", { cls: "subject" });

            let subjectName = newSubjectClass.createEl("div", {text: subjectKey, cls: "subject_name" });

            if (this.editMode) {
                let removeSubjectButton = newSubjectClass.createEl("div", {cls: "subject-remove", parent: subjectName });

                newSubjectClass.insertBefore(removeSubjectButton, subjectName);
                
                removeSubjectButton.addEventListener("click", (click) => {
                    Reflect.deleteProperty(this.data, subjectKey);
                    saveHomeworkData(this.data);

                    newSubjectClass.empty();
                });
            }
            else {
                let newTaskButton = newSubjectClass.createEl("button", {text: "＋", cls: "subject_add", parent: subjectName });

                newTaskButton.addEventListener("click", (click) => {
                    if (this.creating == false) {
                        this.creating = true;

                        let taskName = "";
                        let page = "";
            
                        let promptClass = newSubjectClass.createEl("div", { cls: "promptClass" });
            
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

                                this.createTask(newSubjectClass, subjectKey, taskName);
                                this.creating = false;
                        }));	
                    }   
                });
            }

            for (const taskKey in this.data[subjectKey]) {
                this.createTask(newSubjectClass, subjectKey, `${taskKey}`)
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