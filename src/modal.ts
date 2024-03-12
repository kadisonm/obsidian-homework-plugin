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

        this.changeView(this.plugin.data.views[0]);
	}

	onClose() {   
		const {contentEl} = this;
		contentEl.empty();
	}

    changeView(view:any) {
        this.createHeader(view);
    }

    createHeader(view: any) {
        // Clear existing header
        this.divHeader.empty();
        this.divViewSelector.empty();

        // ------------------- LEFT HEADER ------------------- //
        const headerLeft = this.divHeader.createEl("div");

        // Create dropdown button to switch views
        const dropdownButton = headerLeft.createEl("span", {cls: ["homework-manager-icon-button", "clickable-icon"]});
        setIcon(dropdownButton, "chevron-down");

        let dropdownList: HTMLDivElement | undefined = undefined;

        dropdownButton.addEventListener("click", (click) => {
            if (dropdownList == undefined) {
                dropdownList = this.divViewSelector.createEl("div", {cls: ["homework-manager-menu", "menu mod-tab-list"]});

                for (const object of this.plugin.data.views) {
                    if (object !== view) {
                        const objectName = Object.keys(object)[0];
                        const viewButton = dropdownList.createEl("div", {cls: ["homework-manager-menu-item", "menu-item"], text: objectName});

                        viewButton.addEventListener("click", (click) => {
                            this.changeView(object);
                        });
                    }
                } 
            } else {
                dropdownList?.remove();
                dropdownList = undefined;
            }
        });

        // Set the view title
        let viewName = Object.keys(view)[0];
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
