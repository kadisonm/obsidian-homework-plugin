import HomeworkManagerPlugin from './main';

export default class DataEditor {
    plugin: HomeworkManagerPlugin

    constructor(plugin: HomeworkManagerPlugin) {
		this.plugin = plugin;
	}

    addSubject(viewIndex: number, subjectName: string) {
        const view = this.plugin.data.views[viewIndex];

        if (!view) {
            return;
        }

        view.subjects.push({
            "name": subjectName,
            "tasks": []
        });

        this.plugin.writeData();
    }

    removeSubject(viewIndex: number, subjectIndex: number) {
        const view = this.plugin.data.views[viewIndex];

        if (!view.subjects[subjectIndex]) {
            return;
        }

        view.subjects.splice(subjectIndex, 1);

        this.plugin.writeData();
    }

    moveSubject() {

    }

    addTask() {

    }

    removeTask() {

    }

    moveTask() {

    }
}