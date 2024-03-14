import HomeworkPlugin from './main';
import { App, Modal, TFile, Notice, setIcon } from 'obsidian';
import { SuggestFileModal } from './suggestModal';

//let headerGet = this.headerDiv.getElementsByClassName("header-title");

export default class HomeworkModal extends Modal {
	plugin: HomeworkPlugin;

    divHeader: HTMLDivElement;
    divViewSelector: HTMLDivElement;

    currentView: string;
    subjectEditMode: boolean;
    creating: boolean;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);
		this.plugin = plugin;
        this.subjectEditMode = false;
        this.creating = false;
	}

	onOpen() {
		const {contentEl} = this;
        this.divHeader = contentEl.createEl("div", { cls: "homework-manager-header" });
        this.divViewSelector = contentEl.createEl("div");

        this.changeView(0);
	}

	onClose() {   
		const {contentEl} = this;
		contentEl.empty();
	}

    changeView(viewIndex: number) {
        this.createHeader(viewIndex);
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
                                this.changeView(index);
                            }); 
                        }
                    });   
                    
                    dropdownList.createEl("div", {cls: "menu-separator"});
                }
                
                // Add view button
                const addViewButton = dropdownList.createEl("div", {cls: ["homework-manager-menu-item", "menu-item"]});
                const addViewButtonIcon = addViewButton.createEl("div", {cls: ["menu-item-icon"]});
                setIcon(addViewButtonIcon, "plus");
                addViewButton.createEl("div", {cls: ["menu-item-title"], text: "Add view"});

                addViewButton?.addEventListener("click", (click) => {
                    
                }); 

                // Reorder view button
                const reorderViewButton = dropdownList.createEl("div", {cls: ["homework-manager-menu-item", "menu-item"]});
                const reorderViewButtonIcon = reorderViewButton.createEl("div", {cls: ["menu-item-icon"]});
                setIcon(reorderViewButtonIcon, "arrow-down-up");
                reorderViewButton.createEl("div", {cls: ["menu-item-title"], text: "Reorder views"});

                reorderViewButton?.addEventListener("click", (click) => {
                    
                }); 

                // Delete view button
                const deleteViewButton = dropdownList.createEl("div", {cls: ["homework-manager-menu-item-delete", "homework-manager-menu-item", "menu-item"]});
                const deleteViewButtonIcon = deleteViewButton.createEl("div", {cls: ["homework-manager-menu-item-delete-icon", "menu-item-icon"]});
                setIcon(deleteViewButtonIcon, "trash");
                deleteViewButton.createEl("div", {cls: ["menu-item-title"], text: "Delete view"});

                deleteViewButton?.addEventListener("click", (click) => {
                    
                }); 
            } else {
                dropdownList?.remove();
                dropdownList = undefined;
            }
        });

        // Set the view title
        let viewName = this.plugin.data.views[viewIndex].name;
		const headingText = headerLeft.createEl("h1", { text: viewName });

        // ------------------- RIGHT HEADER ------------------- //

        // Create the edit button
        const editButton = this.divHeader.createEl("span", {cls: ["homework-manager-icon-button", "clickable-icon"]});
        setIcon(editButton, "pencil");

        editButton.addEventListener("click", (click) => {
            this.subjectEditMode = !this.subjectEditMode;

            if (this.subjectEditMode) {
                setIcon(editButton, "book-open");
            }
            else {
                setIcon(editButton, "pencil");
            }  
        });
    }
}
