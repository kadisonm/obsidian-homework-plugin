import HomeworkManagerPlugin from './main';

const currentVersion = "1.1.1"

export interface HomeworkManagerData {
    settings: {
        deleteFinishedTasks: boolean;
        showTooltips: boolean;
		autoSortForTaskQuantity: boolean;
        version: string;
    }
    views: Array<View>
}

export const DEFAULT_DATA: HomeworkManagerData = {
    settings: {
        deleteFinishedTasks: true,
        showTooltips: true,
		autoSortForTaskQuantity: true,
        version: currentVersion
    },
    views: new Array<View>()
}

class Task {
    name = "";
    date = "";
    page = "";
}

class Subject {
    name = "";
    tasks = new Array<Task>();
}

class View {
    name = "";
    subjects = new Array<Subject>();
    tasks = new Array<Task>();
}

export default class DataEditor {
    plugin: HomeworkManagerPlugin

    constructor(plugin: HomeworkManagerPlugin) {
		this.plugin = plugin;
	}

    // Make sure new updates are reflected
    formatData(data: any) {
        const newData = Object.assign({}, DEFAULT_DATA);
        newData.settings = { ...DEFAULT_DATA.settings, ...data.settings}
        newData.views = new Array<View>();

        const assign = (assignTo: View | Task | Subject, object: any) => {
            let filteredObject: any = {};
            
            for (const key in object) {
                if (key in assignTo) {
                    filteredObject[key] = object[key];
                }
            }
        
            return Object.assign(assignTo, filteredObject);
        };

        for (const view of data.views) {
            const newView = assign(new View(), view);
            newView.subjects = new Array<Subject>();
            newView.tasks = new Array<Task>();

            for (const task of view.tasks) {
                const newTask = assign(new Task(), task);
                newView.tasks.push(newTask);
            }

            for (const subject of view.subjects) {
                const newSubject = assign(new Subject(), subject);
                newSubject.tasks = new Array<Task>();

                for (const task of subject.tasks) {
                    const newTask = assign(new Task(), task);
                    newSubject.tasks.push(newTask);
                }

                newView.subjects.push(newSubject);
            }

            newData.views.push(newView);
        }

        if (newData.views.length === 0) {
            const newView = new View();
            newView.name = "View 1";
            newData.views.push(newView);
        }

        return newData;
    }

    // Convert legacy versions (1.0.0, 1.1.0) to new data structure
    convertFromLegacy(data: any) {
        const view = new View();
        view.name = "View 1";

        for (const subjectKey in data) {
            const subject = new Subject();
            subject.name = subjectKey;

            const oldSubject = data[subjectKey];

            for (const taskKey in data[subjectKey]) {
                const task = new Task();
                task.name = taskKey;
                task.page = oldSubject[taskKey].page;
                task.date = oldSubject[taskKey].date;
                subject.tasks.push(task);
            }

            view.subjects.push(subject);
        }

        const newData = Object.assign({}, DEFAULT_DATA);

        newData.views.push(view);
		console.log("Found data is legacy, converting now.\n\nLegacy", data, "\n\nConverted", newData)

        return newData;
    }

    async checkPluginUpdated() {
        const lastVersion = this.plugin.data.settings.version.split('.').slice(0, 2).join('.');
        const current = currentVersion.split('.').slice(0, 2).join('.');

        if (lastVersion == current) {
            return false
        }

        this.plugin.data.settings.version = currentVersion

        await this.plugin.writeData();

        return true
    }

    async addSubject(viewIndex: number, subjectName: string) {
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
        const view = this.plugin.data.views[viewIndex];

        if (!view.subjects[subjectIndex]) {
            return;
        }

        view.subjects.splice(subjectIndex, 1);

        await this.plugin.writeData();
    }

    async moveSubject(viewIndex: number, subjectIndex: number) {
        const view = this.plugin.data.views[viewIndex];

        if (!view.subjects[subjectIndex]) {
            return;
        }

        const subject = view.subjects[subjectIndex]

        // Delete old view
        view.subjects.splice(subjectIndex, 1);

        // Add new view at index
        view.subjects.splice(viewIndex, 0, subject);

        await this.plugin.writeData();
    }

    async addTask(viewIndex: number, taskOptions: {name:string, date:string, page:string}, subjectIndex?: number) {
        const view = this.plugin.data.views[viewIndex];

        if (!view) {
            return;
        }

        if (subjectIndex !== undefined) {
            const subject = view.subjects[subjectIndex];
 
            if (subject) {
                subject.tasks.push(taskOptions); 
            }
        } else {
            if (view.tasks) {
                view.tasks.push(taskOptions);
            }
        }

        await this.plugin.writeData();
    }

    async removeTask(viewIndex: number, taskIndex: number, subjectIndex?: number) {
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

    async moveTask(viewIndex: number, taskIndex: number, up: boolean, subjectIndex: number | undefined) {
        const view = this.plugin.data.views[viewIndex];
		
        if (subjectIndex !== undefined) {
			const subject = view.subjects[subjectIndex];

			if (subject && subject.tasks.length > 1 && ((up && taskIndex > 0) || (!up && taskIndex < subject.tasks.length - 1))) {
				subject.tasks[taskIndex] = subject.tasks.splice(taskIndex + (up ? -1 : 1), 1, subject.tasks[taskIndex])[0];
			}
		}
    }
}
