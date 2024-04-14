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

        await this.plugin.writeData();
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

        await this.plugin.writeData();
    }

    //---------------------------------
    // Adding
    //---------------------------------
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

    //---------------------------------
    // Deleting
    //---------------------------------
    async deleteView(id: string) {
        const foundView = this.plugin.data.views.findIndex((object) => object.id === id);

        if (foundView === undefined)
            return;

        this.plugin.data.views.splice(foundView, 1);

        const foundViewsSubjects = this.plugin.data.subjects.filter((object) => object.parentId === id);

        for (const subject of foundViewsSubjects) {
            await this.deleteSubject(subject.id);
        }

        await this.plugin.writeData();
    }

    async deleteSubject(id: string) {
        const foundSubject = this.plugin.data.subjects.findIndex((object) => object.id === id);

        if (foundSubject === undefined) 
            return;

        this.plugin.data.subjects.splice(foundSubject, 1);
        
        const foundSubjectsTasks = this.plugin.data.tasks.filter((object) => object.parentId === id);
        
        for (const task of foundSubjectsTasks) {
            await this.deleteTask(task.id);
        }

        await this.plugin.writeData();
    }

    async deleteTask(id: string) {
        const task = this.plugin.data.tasks.findIndex((object) => object.id === id);

        if (task === undefined)
            return;

        this.plugin.data.tasks.splice(task, 1);

        await this.plugin.writeData();
    }
}