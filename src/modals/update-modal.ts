import HomeworkManagerPlugin from '../main';
import { App, Modal } from 'obsidian';

export default class UpdateModal extends Modal {
    plugin: HomeworkManagerPlugin;

    constructor(app: App, plugin: HomeworkManagerPlugin) {
        super(app);
        this.plugin = plugin;
    }

    async onOpen() {
        const {contentEl} = this;
        await this.plugin.fetchData();

        contentEl.addClass("update-modal");

        contentEl.createEl('h1', { text: 'Homework Manager: v1.1.0!' });
        
        contentEl.createEl('p', { text: `❗ This update requires the reformatting of user data. If you run into any issues or have lost any data, please create an issue on the GitHub. ❗` });

        contentEl.createEl('hr');

        contentEl.createEl('li', { text: `📂 Views: You can switch between different views, each with its own set of tasks. This makes it easy to separate work-related to-dos from personal tasks.` });
        contentEl.createEl('li', { text: `✏️ Editing tasks & subjects: Update names, due dates, and files.` });
        contentEl.createEl('li', { text: `🔀 Reordering tasks: Arrange tasks the way you like.` });
        contentEl.createEl('li', { text: `📌 Auto-sorting subjects: Subjects can now automatically sort to the top based on the number of tasks they have. This feature can be enabled in the settings.` });
        
        contentEl.createEl('hr');

        contentEl.createEl('b', { text: `Big thanks to HerrChaos for implementing sorting subjects, editing tasks/subjects and reordering tasks.` });
    }

    onClose() {   
        const {contentEl} = this;
        contentEl.empty();
    }
}