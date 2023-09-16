import HomeworkPlugin from "./main"
import { App, PluginSettingTab, Setting } from 'obsidian'

export interface HomeworkSettings {
    homeworkPagePath: string;
}
  
export const DEFAULT_SETTINGS: HomeworkSettings = {
    homeworkPagePath: "",
}

export class HomeworkSettingTab extends PluginSettingTab {
    plugin: HomeworkPlugin;

    constructor(app: App, plugin: HomeworkPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        this.containerEl.createEl("h3", {text: "Homework Settings" })

        new Setting(containerEl)
        .setName("Homework File")
        .setDesc("The file to store your homework.")
        .addText((text) =>
            text
            .setPlaceholder("")
            .setValue(this.plugin.settings.homeworkPagePath)
            .onChange(async (value) => {
                this.plugin.settings.homeworkPagePath = value;
                await this.plugin.saveSettings();
            })
        );
    }
}