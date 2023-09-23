import HomeworkPlugin from './main';
import { App, Modal, TFile, Notice } from 'obsidian';
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
            if (this.creating == false)
            {
                this.editMode = !this.editMode;
                this.loadSubjects();

                if (this.editMode) {
                    editButton.style.backgroundImage = `url(${icons['book-open']})`; 
                }
                else {
                    editButton.style.backgroundImage = `url(${icons['pen-line']})`; 
                }   
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
            const addSubjectButton = this.loadClass.createEl("div", { cls: "add-subject" });
            addSubjectButton.createEl('div', {cls: "add-subject-image"});
            addSubjectButton.createEl("p", { text: "Add a subject" });

            addSubjectButton.addEventListener("click", (click) => {
                if (this.creating == false) {
                    this.creating = true;

                    const promptClass = this.loadClass.createEl("div", {cls: "subject-prompt"});

                    promptClass.createEl("p", {text: "New subject"});

                    const inputText = promptClass.createEl("input", {type: "text", cls: "subject-prompt-input"});
                    inputText.focus();

                    inputText.addEventListener('keydown', (event) => {
                        if (event.key == 'Enter'){
                            if (inputText.value.match(".*[A-Za-z0-9].*")) {
                                if (inputText.value.length <= 32) {
                                    if (!this.data[inputText.value]) {
                                        this.data[inputText.value] = {};
                                    }      
                                } 
                                else {
                                    new Notice("Must be under 32 characters.");
                                }
                                                          
                            }
                            else {
                                new Notice("Must not contain special characters.");
                            }

                            saveHomeworkData(this.data);
                                
                            this.loadSubjects();  
                            this.creating = false;      
                            promptClass.empty();
                        }
                    });

                    const confirmSubject = promptClass.createEl("div", {cls: "subject-prompt-confirm"});

                    confirmSubject.addEventListener("click", (click) => {
                        if (inputText.value.match(".*[A-Za-z0-9].*")) {
                            if (!this.data[inputText.value])    
                                this.data[inputText.value] = {};
                        }
                        saveHomeworkData(this.data);
                        this.loadSubjects();  
                        this.creating = false;      
                        promptClass.empty();
                    });   
                } 
            });    
        }
        
        for (const subjectKey in this.data) {
            let newSubjectClass = this.loadClass.createEl("div", { cls: "subject" });

            let subjectName = newSubjectClass.createEl("div", {text: subjectKey, cls: "subject-name" });

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
                let newTaskButton = newSubjectClass.createEl("div", {cls: "subject-add", parent: subjectName });

                newTaskButton.addEventListener("click", (click) => {
                    if (this.creating == false) {
                        this.creating = true;

                        let page = "";
            
                        let promptClass = newSubjectClass.createEl("div", { cls: "task-prompt" });

                        const inputText = promptClass.createEl("input", {type: "text", cls: "task-prompt-input"});
                        inputText.focus();

                        const suggestButton = promptClass.createEl("button", {text: "File", cls: "task-prompt-suggest"});

                        suggestButton.addEventListener("click", (click) => {
                            new SuggestFileModal(this.app, (result) => {
                                page = result.path;
                                suggestButton.setText(result.name);
                            }).open();
                        });

                        const dateField = promptClass.createEl("input", {type: "date", cls: "task-prompt-date"});

                        inputText.addEventListener('keydown', (event) => {
                            if (event.key == 'Enter'){
                                if (inputText.value.match(".*[A-Za-z0-9].*")) {
                                    if (!this.data[subjectKey][inputText.value]) {
                                        this.data[subjectKey][inputText.value] = {
                                            page : page,
                                            date : dateField.value,
                                        };
        
                                        this.createTask(newSubjectClass, subjectKey, inputText.value);    
                                    }
                                }
    
                                saveHomeworkData(this.data);
                                this.creating = false;
    
                                promptClass.empty();
                            }
                        });

                        const confirmTask = promptClass.createEl("div", {cls: "task-prompt-confirm"});

                        confirmTask.addEventListener("click", (click) => {
                            if (inputText.value.match(".*[A-Za-z0-9].*")) {
                                if (!this.data[subjectKey][inputText.value]) {
                                    this.data[subjectKey][inputText.value] = {
                                        page : page,
                                        date : dateField.value,
                                    };
    
                                    this.createTask(newSubjectClass, subjectKey, inputText.value);    
                                }
                            }

                            saveHomeworkData(this.data);
                            this.creating = false;

                            promptClass.empty();
                        });
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
		
		let taskButton = taskClass.createEl("div", {cls: "task-check" });

        let filePath = this.data[subjectKey][taskName].page;

        let taskText;

        if (filePath == "") {
            taskText = taskClass.createEl("div", { text: taskName, cls: "task-text", parent: taskButton});
        }
        else {
            taskText = taskClass.createEl("div", { text: taskName, cls: "task-link", parent: taskButton});
        }

        let dateValue = this.data[subjectKey][taskName].date;

        if (dateValue != "") {
            let date = new Date(this.data[subjectKey][taskName].date);
            var dateArr = date.toDateString().split(' ');
            var dateFormat = dateArr[2] + ' ' + dateArr[1] + ' ' + dateArr[3];
            let taskDate = taskClass.createEl("div", { text: dateFormat, cls: "task-date", parent: taskText });    

            if (new Date() > date && new Date().toDateString() != date.toDateString()) {
                taskDate.style.color = "var(--text-error)";
            }
        }

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