import HomeworkPlugin from './main';
import { App, Modal, TFile, Notice, setIcon } from 'obsidian';
import { SuggestFileModal } from './file-modal';
import ViewManagerModal from './view-modal';

//let headerGet = this.headerDiv.getElementsByClassName("header-title");

export default class HomeworkModal extends Modal {
	plugin: HomeworkPlugin;

    divHeader: HTMLDivElement;
    divViewSelector: HTMLDivElement;
    divBody: HTMLDivElement;

    currentView: string;
    editMode: boolean;
    creating: boolean;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);
		this.plugin = plugin;
        this.editMode = false;
        this.creating = false;
	}

	onOpen() {
		const {contentEl} = this;
        contentEl.addClass("homework-manager");
        this.divHeader = contentEl.createEl("div", { attr: {"id": "header"}});
        this.divViewSelector = contentEl.createEl("div");
        this.divBody = contentEl.createEl("div", { attr: {"id": "body"} });

        this.changeView(0);
	}

	onClose() {   
		const {contentEl} = this;
		contentEl.empty();
	}

    changeView(viewIndex: number) {
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
        
        // Create dropdown button to switch views
        const views = this.plugin.data.views;

        const dropdownButton = headerLeft.createEl("span", {cls: "clickable-icon"});
        setIcon(dropdownButton, "chevron-down");

        if (this.plugin.data.settings.showTooltips) {
            dropdownButton.setAttribute("aria-label", "Views");
            dropdownButton.setAttribute("data-tooltip-position", "top");
        }

        let dropdownList: HTMLDivElement | undefined = undefined;

        dropdownButton.addEventListener("click", (click) => {
            if (dropdownList == undefined) {
                dropdownList = this.divViewSelector.createEl("div", {cls: "menu mod-tab-list", attr: {"id": "menu"}});

                // Add button for each view
                if (views.length > 1) {
                    views.forEach((viewOption, index) => {
                        if (index != viewIndex) {
                            const viewButton = dropdownList?.createEl("div", {cls: "menu-item"});
                            const viewButtonIcon = viewButton?.createEl("div", {cls: "menu-item-icon"})!;
                            setIcon(viewButtonIcon, "layers");
                            viewButton?.createEl("div", {cls: "menu-item-title", text: viewOption.name});
                            
                            viewButton?.addEventListener("click", (click) => {
                                this.editMode = false;
                                this.changeView(index);
                            }); 
                        }
                    });   
                    
                    dropdownList.createEl("div", {cls: "menu-separator"});
                }
                
                // Manage views button
                const manageButton = dropdownList.createEl("div", {cls: "menu-item"});
                const manageButtonIcon = manageButton.createEl("div", {cls: "menu-item-icon"});
                setIcon(manageButtonIcon, "pencil");
                manageButton.createEl("div", {cls: "menu-item-title", text: "Manage views"});

                manageButton?.addEventListener("click", (click) => {
                    // Open modal
                    this.changeView(viewIndex);
                    new ViewManagerModal(this.app, this.plugin).open();
                }); 
            } else {
                dropdownList?.remove();
                dropdownList = undefined;
            }
        });

        // Set the view title
        const viewName = views[viewIndex].name;
		headerLeft.createEl("h1", { text: viewName });

        // Add top-level task
        const newTaskButton = headerLeft.createEl("span", {cls: "clickable-icon"});
        setIcon(newTaskButton, "plus");

        if (this.plugin.data.settings.showTooltips) {
            newTaskButton.setAttribute("aria-label", "Add new task without subject");
            newTaskButton.setAttribute("data-tooltip-position", "top");
        }

        newTaskButton.addEventListener("click", (click) => {
            // TODO: Call create task function and list the source (Subject/Top)
        });

        // ------------------- RIGHT HEADER ------------------- //

        // Create the edit button
        const editButton = this.divHeader.createEl("span", {cls: "clickable-icon", attr: {"id": "edit-button"}});
        const editIcon = this.editMode ? "book-open" : "pencil";
        setIcon(editButton, editIcon);
        const attributeMessage = this.editMode ? "Switch to view mode" : "Switch to edit mode\nFor editing, reordering or deleting tasks/subjects"

        if (this.plugin.data.settings.showTooltips) {
            editButton.setAttribute("aria-label", attributeMessage);
            editButton.setAttribute("data-tooltip-position", "top");    
        }

        editButton.addEventListener("click", (click) => {
            this.editMode = !this.editMode;
            this.changeView(viewIndex);
        });
    }

    createReadMode(viewIndex: number) {
        this.divBody.empty();

        const subjects = this.plugin.data.views[viewIndex].subjects;

        subjects.forEach((subject: any) => {
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

            tasks.forEach((task: any) => {
                const taskDiv = subjectDiv.createEl("div", {attr: {"id": "task"}});
                const leftDiv = taskDiv.createEl("div");
                const rightDiv = taskDiv.createEl("div");

                // Checkbox
                const check = leftDiv.createEl("div", {attr: {"id": "check"}});

                check.addEventListener("click", (click) => {
                    // TODO: Remove the task from data
                    this.changeView(viewIndex);
                });

                // Task name
                rightDiv.createEl("p", {text: task.name});

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
}
