import HomeworkManagerPlugin from './main';
import { v1 as uuidv1 } from 'uuid';

export interface Task {
    id: string;
    order: number;
    parentId: string;
    name: string;
    date?: Date;
    page?: string;
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

interface PluginData {
    deleteFinishedTasks: boolean;
    homework: {
        views: View[],
        subjects: Subject[],
        tasks: Task[]    
    }
    legacy?: {}
}

const DEFAULT_DATA: PluginData = {
    deleteFinishedTasks: true,
    homework: {
        views: [],
        subjects: [],
        tasks: [],    
    }
}

export class DataManager {
    plugin: HomeworkManagerPlugin
    data: PluginData;

    constructor(plugin: HomeworkManagerPlugin) {
        this.plugin = plugin;

        this.load();
    }

    async load() {
		const foundData = Object.assign({}, await this.plugin.loadData());

        // Migrate legacy data
        if (foundData.homework === undefined) {
            await this.migrateData(foundData);
        } else {
            this.data = Object.assign({}, DEFAULT_DATA, foundData);
        }

		await this.save();
	}

	async save() {
		await this.plugin.saveData(this.data);
	}

    // Convert legacy versions (1.0.0, 1.0.1) to new data structure
    async migrateData(foundData: any) {
        console.log("Legacy data found! Converting...");
    
        let newData = Object.assign({}, DEFAULT_DATA)
        newData.legacy = foundData;
    
        this.data = newData;

        const legacyData: any = Object.assign({}, this.data.legacy);

        const viewId = await this.addView("View 1");

        Object.keys(legacyData).forEach(async (subjectName: string, subjectIndex: number) => {
            const subjectId = await this.addSubject(viewId, subjectName, undefined, subjectIndex);
    
            const legacySubject = legacyData[subjectName];
    
            Object.keys(legacySubject).forEach(async (taskName: string, taskIndex: number) => {
                const page = legacySubject[taskName].page

                const newTask = await this.addTask(
                    subjectId, 
                    taskName, 
                    undefined,
                    taskIndex, 
                    legacySubject[taskName].page, 
                    new Date(legacySubject[taskName].date));
            });
        });
    }

    async addView(name: string, id = uuidv1(), order = this.data.homework.views.length) {
        const view = {} as View;
        view.id = id;
        view.name = name;
        view.order = order;

        this.data.homework.views.push(view);

        await this.save();

        return id;
    }

    async addSubject(parentId: string, name: string, id = uuidv1(), order = this.data.homework.subjects.length) {
        const subject = {} as Subject;
        subject.id = id;
        subject.parentId = parentId;
        subject.name = name;
        subject.order = order;

        this.data.homework.subjects.push(subject);

        await this.save();

        return id;
    }

    async addTask(parentId: string, name: string, id = uuidv1(), order = this.data.homework.tasks.length, page?: string, date?: Date) {
        const task = {} as Task;
        task.id = id;
        task.parentId = parentId;
        task.order = order;
        task.name = name;
        task.page = page;
        task.date = date;

        this.data.homework.tasks.push(task);

        await this.save();

        return id;
    }

    // //---------------------------------
    // // Deleting
    // //---------------------------------
    // async deleteView(id: string) {
    //     const foundView = this.plugin.data.views.findIndex((object) => object.id === id);

    //     if (foundView === undefined)
    //         return;

    //     this.plugin.data.views.splice(foundView, 1);

    //     const foundViewsSubjects = this.plugin.data.subjects.filter((object) => object.parentId === id);

    //     for (const subject of foundViewsSubjects) {
    //         await this.deleteSubject(subject.id);
    //     }

    //     await this.plugin.writeData();
    // }

    // async deleteSubject(id: string) {
    //     const foundSubject = this.plugin.data.subjects.findIndex((object) => object.id === id);

    //     if (foundSubject === undefined) 
    //         return;

    //     this.plugin.data.subjects.splice(foundSubject, 1);
        
    //     const foundSubjectsTasks = this.plugin.data.tasks.filter((object) => object.parentId === id);
        
    //     for (const task of foundSubjectsTasks) {
    //         await this.deleteTask(task.id);
    //     }

    //     await this.plugin.writeData();
    // }

    // async deleteTask(id: string) {
    //     const task = this.plugin.data.tasks.findIndex((object) => object.id === id);

    //     if (task === undefined)
    //         return;

    //     this.plugin.data.tasks.splice(task, 1);

    //     await this.plugin.writeData();
    // }
}