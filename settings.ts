import HomeworkPlugin from "./main"
import { App, PluginSettingTab, Setting } from 'obsidian'

export interface HomeworkSettings {
    homeworkPageLink: string;
}
  
export const DEFAULT_SETTINGS: HomeworkSettings = {
    homeworkPageLink: "",
}

export class HomeworkSettingTab extends PluginSettingTab {
    plugin: HomeworkPlugin;

    constructor(app: App, plugin: HomeworkPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        this.containerEl.createEl("h3", {text: "Homework Settings" })

        new Setting(containerEl)
        .setName("Homework File")
        .setDesc("The file to store your homework.")
        .addText((text) =>
            text
            .setPlaceholder("")
            .setValue(this.plugin.settings.homeworkPageLink)
            .onChange(async (value) => {
                this.plugin.settings.homeworkPageLink = value;
                await this.plugin.saveSettings();
            })
        );
    }
}