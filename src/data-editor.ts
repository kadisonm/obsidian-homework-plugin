import HomeworkManagerPlugin from './main';

export default class DataEditor {
    plugin: HomeworkManagerPlugin

    constructor(plugin: HomeworkManagerPlugin) {
		this.plugin = plugin;
	}

    async addSubject(viewIndex: number, subjectName: string) {
        await this.plugin.fetchData();
        const view = this.plugin.data.views[viewIndex];

        if (!view) {
            return;
        }

        view.subjects.push({
            "name": subjectName,
            "tasks": []
        });

        await this.plugin.writeData();
    }

    async removeSubject(viewIndex: number, subjectIndex: number) {
        await this.plugin.fetchData();
        const view = this.plugin.data.views[viewIndex];

        if (!view.subjects[subjectIndex]) {
            return;
        }

        view.subjects.splice(subjectIndex, 1);

        await this.plugin.writeData();
    }

    async moveSubject() {

    }

    async addTask() {

    }

    async removeTask(viewIndex: number, subjectIndex: number | undefined, taskIndex: number) {
        await this.plugin.fetchData();
        const view = this.plugin.data.views[viewIndex];

        if (!view) {
            return;
        }

        if (subjectIndex !== undefined) {
            const subject = view.subjects[subjectIndex];
 
            if (subject) {
                subject.tasks.splice(taskIndex, 1); 
            }
        } else {
            if (view.tasks) {
                view.tasks.splice(taskIndex, 1);
            }
        }

        await this.plugin.writeData();
    }

    async moveTask() {

    }
}