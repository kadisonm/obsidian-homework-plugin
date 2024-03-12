import { App, PluginSettingTab, Setting } from "obsidian";
import HomeworkManagerPlugin from "./main";

export interface HomeworkManagerData {
    settings: {
        deleteFinishedTasks: boolean;
    }
    views: Array<any>
}

export const DEFAULT_DATA: HomeworkManagerData = {
    settings: {
        deleteFinishedTasks: true,
    },
    views: new Array()
}

export const defaultLogo = "book";

export class SettingsTab extends PluginSettingTab {
	plugin: HomeworkManagerPlugin;

	constructor(app: App, plugin: HomeworkManagerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

        // Enable show accessed
        new Setting(containerEl)
            .setName('Delete finished tasks')
            .setDesc('Deletes finished tasks instead of marking them complete.')
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.data.settings.deleteFinishedTasks)
                .onChange(async (val) => {
                    this.plugin.data.settings.deleteFinishedTasks = val;
                    await this.plugin.writeData();
                })
            })
	}
}