import HomeworkPlugin from './main';
import { create } from 'domain';
import { App, Modal, Notice, Setting, TAbstractFile, TFile  } from 'obsidian';

const dataPath = `.obsidian/plugins/obsidian-homework-plugin/homeworkData.json`;
let homeworkData = {};

export default class HomeworkModal extends Modal {
	plugin: HomeworkPlugin;

	constructor(app: App, plugin: HomeworkPlugin) {
		super(app);
		this.plugin = plugin;
	}

	onOpen() {
		const {contentEl} = this;

        homeworkData = this.readData();

        Object.assign({}, homeworkData, {"English": []});

        this.writeData(JSON.stringify(homeworkData));
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

    readData() : string {
        let file = this.app.vault.getAbstractFileByPath(dataPath);

        if (file instanceof TFile) {
            this.app.vault.read(file).then((fileContent) => {
                return fileContent;
            });
        }

        return "";
    }

    writeData(data: string) {
        let file = this.app.vault.getAbstractFileByPath(dataPath);

        if (file instanceof TFile) {
            this.app.vault.modify(file, data);
        }
    }
}