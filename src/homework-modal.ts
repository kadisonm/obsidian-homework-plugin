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
        this.divHeader = contentEl.createEl("div", { cls: "homework-manager-header" });
        this.divViewSelector = contentEl.createEl("div");
        this.divBody = contentEl.createEl("div");

        this.changeView(0);
	}

	onClose() {   
		const {contentEl} = this;
		contentEl.empty();
	}

    changeView(viewIndex: number) {
        this.createHeader(viewIndex);

        if (this.editMode) {
            this.createEditMode();
        } else {
            this.createReadMode();
        }
    }

    createHeader(viewIndex: number) {
        // Clear existing header
        this.divHeader.empty();
        this.divViewSelector.empty();

        // ------------------- LEFT HEADER ------------------- //
        const headerLeft = this.divHeader.createEl("div");

        // Create dropdown button to switch views
        const views = this.plugin.data.views;

        const dropdownButton = headerLeft.createEl("span", {cls: ["homework-manager-icon-button", "clickable-icon"]});
        setIcon(dropdownButton, "chevron-down");
        dropdownButton.setAttribute("aria-label", "Views");
        dropdownButton.setAttribute("data-tooltip-position", "top");

        let dropdownList: HTMLDivElement | undefined = undefined;

        dropdownButton.addEventListener("click", (click) => {
            if (dropdownList == undefined) {
                dropdownList = this.divViewSelector.createEl("div", {cls: ["homework-manager-menu", "menu mod-tab-list"]});

                if (views.length > 1) {
                    views.forEach((viewOption, index) => {
                        if (index != viewIndex) {
                            const viewButton = dropdownList?.createEl("div", {cls: ["homework-manager-menu-item", "menu-item"]});
                            const viewButtonIcon = viewButton?.createEl("div", {cls: ["menu-item-icon"]})!;
                            setIcon(viewButtonIcon, "layers");
                            const viewButtonTitle = viewButton?.createEl("div", {cls: ["menu-item-title"], text: viewOption.name});
                            
                            viewButton?.addEventListener("click", (click) => {
                                this.editMode = false;
                                this.changeView(index);
                            }); 
                        }
                    });   
                    
                    dropdownList.createEl("div", {cls: "menu-separator"});
                }
                
                // Manage views button
                const manageViewsButton = dropdownList.createEl("div", {cls: ["homework-manager-menu-item", "menu-item"]});
                const manageViewsButtonIcon = manageViewsButton.createEl("div", {cls: ["menu-item-icon"]});
                setIcon(manageViewsButtonIcon, "pencil");
                manageViewsButton.createEl("div", {cls: ["menu-item-title"], text: "Manage views"});

                manageViewsButton?.addEventListener("click", (click) => {
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
        let viewName = views[viewIndex].name;
		headerLeft.createEl("h1", { text: viewName });

        // Add top-level task
        const newTaskButton = headerLeft.createEl("span", {cls: ["homework-manager-header-task", "homework-manager-icon-button", "clickable-icon"]});
        newTaskButton.setAttribute("aria-label", "Add new task without subject");
        newTaskButton.setAttribute("data-tooltip-position", "top");
        setIcon(newTaskButton, "plus");

        newTaskButton.addEventListener("click", (click) => {
            // TODO: Call create task function and list the source (Subject/Top)
        });

        // ------------------- RIGHT HEADER ------------------- //

        // Create the edit button
        const editButton = this.divHeader.createEl("span", {cls: ["homework-manager-icon-button", "clickable-icon"]});
        const editIcon = this.editMode ? "book-open" : "pencil";
        setIcon(editButton, editIcon);
        const attributeMessage = this.editMode ? "Switch to view mode" : "Switch to edit mode\nFor editing, reordering or deleting tasks/subjects"
        editButton.setAttribute("aria-label", attributeMessage);
        editButton.setAttribute("data-tooltip-position", "top");

        editButton.addEventListener("click", (click) => {
            this.editMode = !this.editMode;
            this.changeView(viewIndex);
        });
    }

    createReadMode() {
        this.divBody.empty();

        this.divBody.createEl("h1", { text: "Read mode" });
        
    }

    createEditMode() {
        this.divBody.empty();

        this.divBody.createEl("h1", { text: "Edit mode" });
    }
}
