import { App, PluginSettingTab, Setting } from "obsidian";
import HomeworkManagerPlugin from "./main";

export interface HomeworkManagerData {
    settings: {
        deleteFinishedTasks: boolean;
        showTooltips: boolean;
    }
    views: Array<any>
}

export const DEFAULT_DATA: HomeworkManagerData = {
    settings: {
        deleteFinishedTasks: true,
        showTooltips: true,
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

        // Delete finished tasks
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
        
        // Show Tooltips
        new Setting(containerEl)
            .setName('Show tooltips')
            .setDesc('Show tooltips when hovering over buttons.')
            .addToggle((toggle) => {
                toggle
                .setValue(this.plugin.data.settings.showTooltips)
                .onChange(async (val) => {
                    this.plugin.data.settings.showTooltips = val;
                    await this.plugin.writeData();
                })
            })
	}
}