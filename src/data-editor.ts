import HomeworkManagerPlugin from './main';
import { v1 as uuidv1 } from 'uuid';

export interface HomeworkManagerData {
    settings: {
        deleteFinishedTasks: boolean;
    }
    views: View[],
    subjects: Subject[],
    tasks: Task[]
}

export const DEFAULT_DATA: HomeworkManagerData = {
    settings: {
        deleteFinishedTasks: true,
    },
    views: [],
    subjects: [],
    tasks: [],
}

export interface Task {
    id: string;
    order: number;
    parentId: string;
    name: string;
    date: string;
    page: string;
}

export interface Subject {
    id: string;
    order: number;
    parentId: string;
    name: string;
}

export interface View {
    id: string;
    order: number;
    name: string;
}

export class DataEditor {
    plugin: HomeworkManagerPlugin

    constructor(plugin: HomeworkManagerPlugin) {
		this.plugin = plugin;
	}

    // Convert legacy versions (1.0.0, 1.0.1) to new data structure
    async convertFromLegacy(legacyData: any) {
        const viewId = await this.addView("View 1");

        Object.keys(legacyData).forEach(async (subjectName: string, subjectIndex: number) => {
            const subjectId = await this.addSubject(viewId, subjectName, undefined, subjectIndex);

            const legacySubject = legacyData[subjectName];

            Object.keys(legacySubject).forEach(async (taskName: string, taskIndex: number) => {
                const newTask = await this.addTask(
                    subjectId, 
                    taskName, 
                    undefined,
                    taskIndex, 
                    legacySubject[taskName].page, 
                    legacySubject[taskName].date);
            });
        });

		console.log("Found legacy data and converted.\n\nLegacy", legacyData, "\n\nConverted", this.plugin.data)
    }

    // Rebuild structure to make sure new updates are reflected
    async formatData(foundData: HomeworkManagerData) {
        for (const key in foundData.settings) {
            if (!(key in DEFAULT_DATA.settings)) {
                delete (foundData.settings as any)[key];
            }
        }

        this.plugin.data.settings = Object.assign({}, DEFAULT_DATA.settings, foundData.settings);

        foundData.views.forEach(async (view: View) => {
            await this.addView(view.name, view.id, view.order);
        });

        foundData.subjects.forEach(async (subject: Subject) => {
            await this.addSubject(subject.parentId, subject.name, subject.id, subject.order);
        });

        foundData.tasks.forEach(async (task: Task) => {
            await this.addTask(task.parentId, task.name, task.id, task.order, task.page, task.date);
        });
    }

    async addView(name: string, id = uuidv1(), order = this.plugin.data.views.length) {
        const view = {} as View;
        view.id = id;
        view.name = name;
        view.order = order;

        this.plugin.data.views.push(view);
        await this.plugin.writeData();

        return id;
    }

    async addSubject(parentId: string, name: string, id = uuidv1(), order = this.plugin.data.subjects.length) {
        const subject = {} as Subject;
        subject.id = id;
        subject.parentId = parentId;
        subject.name = name;
        subject.order = order;

        this.plugin.data.subjects.push(subject);
        await this.plugin.writeData();

        return id;
    }

    async addTask(parentId: string, name: string, id = uuidv1(), order = this.plugin.data.tasks.length, page = "", date = "") {
        const task = {} as Task;
        task.id = id;
        task.parentId = parentId;
        task.order = order;
        task.name = name;
        task.page = page;
        task.date = date;

        this.plugin.data.tasks.push(task);
        await this.plugin.writeData();

        return id;
    }

    // async removeSubject(viewIndex: number, subjectIndex: number) {
    //     const view = this.plugin.data.views[viewIndex];

    //     if (!view.subjects[subjectIndex]) {
    //         return;
    //     }

    //     view.subjects.splice(subjectIndex, 1);

    //     await this.plugin.writeData();
    // }

    // async moveSubject(viewIndex: number, subjectIndex: number) {
    //     const view = this.plugin.data.views[viewIndex];

    //     if (!view.subjects[subjectIndex]) {
    //         return;
    //     }

    //     const subject = view.subjects[subjectIndex]

    //     // Delete old view
    //     view.subjects.splice(subjectIndex, 1);

    //     // Add new view at index
    //     view.subjects.splice(viewIndex, 0, subject);

    //     await this.plugin.writeData();
    // }

    // async addTask(viewIndex: number, taskOptions: {name:string, date:string, page:string}, subjectIndex?: number) {
    //     const view = this.plugin.data.views[viewIndex];

    //     if (!view) {
    //         return;
    //     }

    //     if (subjectIndex !== undefined) {
    //         const subject = view.subjects[subjectIndex];
 
    //         if (subject) {
    //             subject.tasks.push(taskOptions); 
    //         }
    //     } else {
    //         if (view.tasks) {
    //             view.tasks.push(taskOptions);
    //         }
    //     }

    //     await this.plugin.writeData();
    // }

    // async removeTask(viewIndex: number, taskIndex: number, subjectIndex?: number) {
    //     const view = this.plugin.data.views[viewIndex];

    //     if (!view) {
    //         return;
    //     }

    //     if (subjectIndex !== undefined) {
    //         const subject = view.subjects[subjectIndex];
 
    //         if (subject) {
    //             subject.tasks.splice(taskIndex, 1); 
    //         }
    //     } else {
    //         if (view.tasks) {
    //             view.tasks.splice(taskIndex, 1);
    //         }
    //     }

    //     await this.plugin.writeData();
    // }

    // async moveTask() {
        
    // }
}