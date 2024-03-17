import HomeworkManagerPlugin from './main';
import { App, Modal, TFile, Notice, setIcon } from 'obsidian';
import { SuggestFileModal } from './file-modal';
import ViewManagerModal from './view-modal';

//let headerGet = this.headerDiv.getElementsByClassName("header-title");

export default class HomeworkModal extends Modal {
	plugin: HomeworkManagerPlugin;

    divHeader: HTMLDivElement;
    divViewSelector: HTMLDivElement;
    divTopLevel: HTMLDivElement;
    divBody: HTMLDivElement;

    currentView: string;
    editMode: boolean;
    creating: boolean;

	constructor(app: App, plugin: HomeworkManagerPlugin) {
		super(app);
		this.plugin = plugin;
        this.editMode = false;
        this.creating = false;
	}

	async onOpen() {
		const {contentEl} = this;
        await this.plugin.fetchData();

        contentEl.addClass("homework-manager");
        this.divHeader = contentEl.createEl("div", { attr: {"id": "header"}});
        this.divViewSelector = contentEl.createEl("div");
        this.divTopLevel = contentEl.createEl("div", {cls: "homework-manager-hidden", attr: {"id": "subjectPrompt"}});
        this.divBody = contentEl.createEl("div", { attr: {"id": "body"} });

        this.changeView(0);
	}

	onClose() {   
		const {contentEl} = this;
		contentEl.empty();
	}

    changeView(viewIndex: number) {
        if (!this.plugin.data.views[viewIndex]) {
            console.log("Cannot find requested view in data.");
            viewIndex = 0;
        }

        this.createHeader(viewIndex);

        if (this.editMode) {
            this.createEditMode(viewIndex);
        } else {
            this.createReadMode(viewIndex);
        }
    }

    createHeader(viewIndex: number) {
        // Clear existing header
        this.divHeader.empty();
        this.divViewSelector.empty();

        // ------------------- LEFT HEADER ------------------- //
        const headerLeft = this.divHeader.createEl("div", {attr: {"id": "left-column"}});
        
        const views = this.plugin.data.views;

        const dropdownButton = this.createIconButton(headerLeft, undefined, "chevron-down", {message: "View options"});

        let dropdownList: HTMLDivElement | undefined = undefined;

        dropdownButton.addEventListener("click", (click) => {
            if (dropdownList == undefined) {
                dropdownList = this.divViewSelector.createEl("div", {cls: "menu mod-tab-list", attr: {"id": "menu"}});

                // Add button for each view
                if (views.length > 1) {
                    views.forEach((viewOption, index) => {
                        if (index != viewIndex && dropdownList) {
                            const viewButton = this.createMenuButton(
                                dropdownList, 
                                undefined, 
                                { icon: "layers", text: viewOption.name}, 
                                {message: "Switch to view", position: "right"});

                            viewButton?.addEventListener("click", (click) => {
                                this.editMode = false;
                                this.changeView(index);
                            }); 
                        }
                    });   
                    
                    dropdownList.createEl("div", {cls: "menu-separator"});
                }
                
                // Manage views button
                const manageButton = this.createMenuButton(
                    dropdownList, 
                    undefined, 
                    { icon: "pencil", text: "Manage views"}, 
                    {message: "Add, delete, sort, or rename your views", position: "right"});

                manageButton?.addEventListener("click", (click) => {
                    // Open modal
                    this.changeView(viewIndex);
                    new ViewManagerModal(this.app, this.plugin).open();
                }); 

                dropdownList.createEl("div", {cls: "menu-separator"});

                // Add Task Button
                const taskButton = this.createMenuButton(
                    dropdownList, 
                    undefined, 
                    { icon: "plus", text: "Add task"}, 
                    {message: "Creates a task without a subject", position: "right"});

                taskButton?.addEventListener("click", async (click) => {
                    // TODO: Add task to top level
                });

                // Add Subject Button
                const subjectButton = this.createMenuButton(
                    dropdownList, 
                    undefined, 
                    { icon: "copy-plus", text: "Add subject"},
                    {message: "Creates a subject in the current view", position: "right"});

                subjectButton?.addEventListener("click", async (click) => {
                    dropdownList?.remove();
                    dropdownList = undefined;
                    const subjectName = await this.addSubjectPrompt();

                    if (subjectName !== undefined) {
                        await this.plugin.dataEditor.addSubject(viewIndex, subjectName);
                        this.changeView(viewIndex);    
                    }
                });  
            } else {
                dropdownList?.remove();
                dropdownList = undefined;
            }
        });

        // Set the view title
        const viewName = views[viewIndex].name;
		headerLeft.createEl("h1", { text: viewName });

        // ------------------- RIGHT HEADER ------------------- //

        // Create the edit button
        const editIcon = this.editMode ? "book-open" : "pencil";
        const attributeMessage = this.editMode ? "Switch to view mode" : "Switch to edit mode\nFor editing, reordering or deleting tasks/subjects"
        const editButton = this.createIconButton(this.divHeader, {attr: {"id": "edit-button"}}, editIcon, {message: attributeMessage});

        editButton.addEventListener("click", (click) => {
            this.editMode = !this.editMode;
            this.changeView(viewIndex);
        });
    }

    createReadMode(viewIndex: number) {
        this.divBody.empty();

        const subjects = this.plugin.data.views[viewIndex].subjects;

        // TODO: Create top level tasks

        // Create subjects and tasks
        subjects.forEach((subject: any, subjectIndex: number) => {
            // Create subject title
            const subjectDiv =  this.divBody.createEl("div", {attr: {"id": "subject"}});
            
            const titleDiv = subjectDiv.createEl("div", {attr: {"id": "title"}});
            titleDiv.createEl("h2", {text: subject.name});

            // Add subject new task button
            const newTaskButton = titleDiv.createEl("span", {cls: "clickable-icon"});
            setIcon(newTaskButton, "plus");

            if (this.plugin.data.settings.showTooltips) {
                newTaskButton.setAttribute("aria-label", "Add new task");
                newTaskButton.setAttribute("data-tooltip-position", "top");
            }

            newTaskButton.addEventListener("click", (click) => {
                // TODO: Call create task function and list the source (Subject/Top)
            });

            // Create tasks under subject
            const tasks = subject.tasks;

            tasks.forEach(async (task: any, taskIndex: number) => {
                const taskDiv = subjectDiv.createEl("div", {attr: {"id": "task"}});
                const leftDiv = taskDiv.createEl("div");
                const rightDiv = taskDiv.createEl("div");

                // Checkbox
                const check = leftDiv.createEl("div", {attr: {"id": "check"}});

                check.addEventListener("click", async (click) => {
                    await this.plugin.dataEditor.removeTask(viewIndex, subjectIndex, taskIndex);
                    this.changeView(viewIndex);
                });

                // Task name
                const taskName = rightDiv.createEl("p", {text: task.name});

                if (task.page !== "") {
                    taskName.addClass("homework-manager-link");

                    if (this.plugin.data.settings.showTooltips) {
                        taskName.setAttribute("aria-label", "Go to linked file");
                        taskName.setAttribute("data-tooltip-position", "right");
                    }

                    taskName.addEventListener("click", (click) => {
                        const file = this.app.vault.getAbstractFileByPath(task.page);
 
                        if (file instanceof TFile)
                        {
                            this.app.workspace.getLeaf().openFile(file);
                            this.close();
                            return;
                        }

                        new Notice("Linked file cannot be found.");
                    });
                }

                // Due date
                if (task.date.length > 0) {
                    const date = new Date(task.date);

                    let formattedDate = date.toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });

                    const today = new Date();

                    const yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);

                    const tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    if (date.toDateString() == today.toDateString()) {
                        formattedDate = "Today";
                    } else if (date.toDateString() == tomorrow.toDateString()) {
                        formattedDate = "Tomorrow";
                    } else if (date.toDateString() == yesterday.toDateString()) {
                        formattedDate = "Yesterday";
                    } 

                    const taskDate = rightDiv.createEl("p", {text: formattedDate, attr: {"id": "date"}});    

                    if (today > date && today.toDateString() !== date.toDateString()) {
                        taskDate.style.color = "var(--text-error)";
                    }
                }
            });
        });
    }

    createEditMode(viewIndex: number) {
        this.divBody.empty();

        this.divBody.createEl("h1", { text: "Edit mode" });
    }

    addSubjectPrompt(): Promise<string | undefined> {
        this.divTopLevel.empty();
        this.divTopLevel.removeClass("homework-manager-hidden");

        const inputText = this.divTopLevel.createEl("input", {type: "text", placeholder: "Enter subject name"});
        inputText.focus();

        const saveButton = this.createIconButton(this.divTopLevel, undefined, "check", "Confirm", "bottom");
        saveButton.addClass("homework-manager-hidden");

        const cancelButton = this.createIconButton(this.divTopLevel, undefined, "x", "Cancel", "bottom");

        inputText.addEventListener('keyup', (event) => {
            if (inputText.value.length > 0) {
                saveButton.removeClass("homework-manager-hidden");
            } else {
                saveButton.addClass("homework-manager-hidden");
            }
        });

        const hideDiv = () => {
            this.divTopLevel.empty();
            this.divTopLevel.addClass("homework-manager-hidden");
        }

        return new Promise<string | undefined>((resolve) => {
            inputText.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    if (inputText.value.length > 0) {
                        hideDiv();
                        resolve(inputText.value.trim());
                    }
                }
            });
    
            saveButton.addEventListener("click", () => {
                hideDiv();

                if (inputText.value.length > 0) {
                    resolve(inputText.value.trim());
                }
                    
                resolve(undefined);
            });
    
            cancelButton.addEventListener("click", () => {
                hideDiv();
                resolve(undefined);
            });
        });
    }

    createIconButton(
        div: HTMLDivElement, 
        elementInfo: string | DomElementInfo | undefined, 
        icon: string, 
        attribute?: {
            message: string, 
            position?: string
        }): HTMLSpanElement
    {    
        const button = div.createEl("span", elementInfo);
        button.addClass("clickable-icon");
        setIcon(button, icon);

        if (attribute?.message && this.plugin.data.settings.showTooltips) {
            button.setAttribute("aria-label", attribute.message);

            if (attribute.position) {
                button.setAttribute("data-tooltip-position", attribute.position);    
            } else {
                button.setAttribute("data-tooltip-position", "top");    
            }
        }

        return button;
    }

    createMenuButton(
        div: HTMLDivElement, 
        elementInfo: string | DomElementInfo | undefined,
        item: {
            icon?: string,
            text?: string,
        },
        attribute?: {
            message: string, 
            position?: string
        }): HTMLDivElement
    {    
        const button = div.createEl("div", elementInfo);
        button.addClass("menu-item");

        if (item.icon) {
            const buttonIcon = button.createEl("div", {cls: "menu-item-icon"});
            setIcon(buttonIcon, item.icon);    
        }
        
        if (item.text) {
            button.createEl("div", {cls: "menu-item-title", "text": item.text});
        }
        
        if (attribute?.message && this.plugin.data.settings.showTooltips) {
            button.setAttribute("aria-label", attribute.message);

            if (attribute.position) {
                button.setAttribute("data-tooltip-position", attribute.position);    
            } else {
                button.setAttribute("data-tooltip-position", "top");    
            }
        }

        return button;
    }
}