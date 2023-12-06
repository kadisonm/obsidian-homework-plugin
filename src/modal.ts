import HomeworkPlugin from './main';
import { App, Modal, TFile, Notice, setIcon } from 'obsidian';
import { SuggestFileModal } from './suggestModal';

export default class HomeworkModal extends Modal {
	plugin: HomeworkPlugin;
    headingClass: HTMLDivElement;
    loadClass: HTMLDivElement;
    editMode: Boolean;
    creating: Boolean;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);

        const {contentEl} = this;

		this.plugin = plugin;
        this.headingClass = contentEl.createEl("div", { cls: "header" });
        this.loadClass = contentEl.createEl("div");
	}

	async onOpen() {
		const {contentEl} = this;

        await this.plugin.loadHomework();

        this.editMode = false;
        this.creating = false;

		const headingText = this.headingClass.createEl("h1", { text: "Homework", cls: "header-title" });
        const editButton = this.headingClass.createEl("div", {cls: "header-edit-button" });
        setIcon(editButton, "pencil");
       
        this.loadSubjects();

        editButton.addEventListener("click", (click) => {
            if (this.creating == false)
            {
                this.editMode = !this.editMode;
                this.loadSubjects();

                if (this.editMode) {
                    setIcon(editButton, "book-open");
                }
                else {
                    setIcon(editButton, "pencil");
                }   
            }
            else {
                new Notice("Please complete prompt first.");
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
            const subjectsHeading = this.loadClass.createEl("div", { cls: "subjects-heading" });
            const addSubjectButton = subjectsHeading.createEl("div", { cls: "add-subject" });
            addSubjectButton.createEl("p", { text: "Add a subject" });

            addSubjectButton.addEventListener("click", (click) => {
                if (this.creating == false) {
                    this.creating = true;

                    const promptClass = subjectsHeading.createEl("div", {cls: "subject-prompt"});

                    promptClass.createEl("p", {text: "New subject"});

                    const inputText = promptClass.createEl("input", {type: "text", cls: "subject-prompt-input"});
                    inputText.focus();

                    function onPromptFinish(object : HomeworkModal) {
                        if (inputText.value.match(".*[A-Za-zА-Яа-я0-9].*")) {
                            if (inputText.value.length <= 32) {
                                if (!object.plugin.data[inputText.value]) {
                                    object.plugin.data[inputText.value] = {};
                                }      
                            } 
                            else {
                                new Notice("Must be under 32 characters.");
                            }                       
                        }
                        else {
                            new Notice("Must not contain special characters.");
                        }

                        object.plugin.saveHomework();
                            
                        object.loadSubjects();  
                        object.creating = false;      

                        return;
                    }

                    inputText.addEventListener('keydown', (event) => {
                        if (event.key == 'Enter'){
                            onPromptFinish(this);
                        }
                    });

                    const confirmSubject = promptClass.createEl("div", {cls: "subject-prompt-confirm"});
                    setIcon(confirmSubject, "check");

                    confirmSubject.addEventListener("click", (click) => {
                        onPromptFinish(this);
                    });   
                }
                else {
                    new Notice("Already creating new subject.");
                }
            });    
        }
        
        for (const subjectKey in this.plugin.data) {
            let newSubjectClass = this.loadClass.createEl("div", { cls: "subject" });

            let subjectHeading = newSubjectClass.createEl("div", { cls: "subject-heading" });
            let subjectName = subjectHeading.createEl("div", {text: subjectKey, cls: "subject-heading-name" });

            if (this.editMode) {
                let removeSubjectButton = subjectHeading.createEl("div", {cls: "subject-heading-remove" });
                setIcon(removeSubjectButton, "minus");

                subjectHeading.insertBefore(removeSubjectButton, subjectName);
                
                removeSubjectButton.addEventListener("click", (click) => {
                    Reflect.deleteProperty(this.plugin.data, subjectKey);
                    this.plugin.saveHomework();

                    newSubjectClass.empty();
                });
            }
            else {
                let newTaskButton = subjectHeading.createEl("div", {cls: "subject-heading-add" });
                setIcon(newTaskButton, "plus");

                newTaskButton.addEventListener("click", (click) => {
                    if (this.creating == false) {
                        this.creating = true;

                        let page = "";
            
                        const promptClass = newSubjectClass.createEl("div", { cls: "task-prompt" });

                        const flexClassTop = promptClass.createEl("div", { cls: "task-prompt-flextop" });
                        const inputText = flexClassTop.createEl("input", {type: "text", cls: "task-prompt-flextop-input"});
                        const confirmTask = flexClassTop.createEl("div", {cls: "task-prompt-flextop-confirm"});
                        setIcon(confirmTask, "check");
                        inputText.focus();

                        const flexClassBottom = promptClass.createEl("div", { cls: "task-prompt-flexbottom" });
                        const suggestButton = flexClassBottom.createEl("div", {text: "File", cls: "task-prompt-flexbottom-suggest"});
                        const dateField = flexClassBottom.createEl("input", {type: "date", cls: "task-prompt-flexbottom-date"});
                        
                        suggestButton.addEventListener("click", (click) => {
                            new SuggestFileModal(this.app, (result) => {
                                page = result.path;
                                suggestButton.setText(result.name);
                            }).open();
                        });

                        function onPromptFinish(object : HomeworkModal) {
                            if (inputText.value.match(".*[A-Za-zА-Яа-я0-9].*")) {
                                if (inputText.value.length <= 100) {
                                    if (!object.plugin.data[subjectKey][inputText.value]) {
                                        object.plugin.data[subjectKey][inputText.value] = {
                                            page : page,
                                            date : dateField.value,
                                        };
        
                                        object.createTask(newSubjectClass, subjectKey, inputText.value);    
                                    }
                                }
                                else {
                                    new Notice("Must be under 100 characters.");
                                }
                            }
                            else {
                                new Notice("Must not contain special characters.");
                            }

                            object.plugin.saveHomework();
                            object.creating = false;

                            promptClass.empty();
                        }

                        inputText.addEventListener('keydown', (event) => {
                            if (event.key == 'Enter'){
                                onPromptFinish(this);
                            }
                        });

                        confirmTask.addEventListener("click", (click) => {
                            onPromptFinish(this);
                        });
                    }
                    else {
                        new Notice("Already creating task.");
                    }
                });
            }

            if (!this.editMode) {
                for (const taskKey in this.plugin.data[subjectKey]) {
                    this.createTask(newSubjectClass, subjectKey, `${taskKey}`)
                }    
            }
        }
    }

    createTask(subjectClass : HTMLDivElement, subjectKey : string, taskName : string) {
        let taskClass = subjectClass.createEl("div", { cls: "task" });
		
		let taskButton = taskClass.createEl("div", {cls: "task-check" });

        let filePath = this.plugin.data[subjectKey][taskName].page;

        let taskText;

        if (filePath == "") {
            taskText = taskClass.createEl("div", { text: taskName, cls: "task-text", parent: taskButton});
        }
        else {
            taskText = taskClass.createEl("div", { text: taskName, cls: "task-link", parent: taskButton});
        }

        let dateValue = this.plugin.data[subjectKey][taskName].date;

        if (dateValue != "") {
            let date = new Date(this.plugin.data[subjectKey][taskName].date);
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
            Reflect.deleteProperty(this.plugin.data[subjectKey], taskName);
            this.plugin.saveHomework();
            
            taskClass.empty();
		});
    }
}
