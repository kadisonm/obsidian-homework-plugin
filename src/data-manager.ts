import HomeworkManagerPlugin from './main';
import { v1 as uuidv1 } from 'uuid';

interface Item {
    name?: string;
    id: string;
    children: string[];
    parent: string;
}

export interface View extends Item {
    readonly type: "View";
}

export interface Subject extends Item {
    readonly type: "Subject";
}

export interface Task extends Item {
    readonly type: "Task";
    date?: Date;
    page?: string;
}

interface PluginData {
    deleteFinishedTasks: boolean;
    homework: {
        id: string;
        children: string[];
        items: Array<View | Subject | Task>;  
    }
    legacy?: {}
}

const DEFAULT_DATA: PluginData = {
    deleteFinishedTasks: true,
    homework: {
        id: "root",
        children: [],
        items: []
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

        const view = await this.createItem<Subject>(
            {
                name: "View 1", 
                parent: "root",
            }
        );

        Object.keys(legacyData).forEach(async (subjectName: string, subjectIndex: number) => {
            const subject = await this.createItem<Subject>(
                {
                    name: subjectName, 
                    parent: view,
                }
            );
    
            const legacySubject = legacyData[subjectName];
    
            Object.keys(legacySubject).forEach(async (taskName: string, taskIndex: number) => {
                const page = legacySubject[taskName].page;
                const dueDate = new Date(legacySubject[taskName].date);

                await this.createItem<Task>(
                    {
                        name: taskName, 
                        page: page,
                        date: dueDate,
                        parent: subject,
                    }
                );
            });
        });
    }

    async createItem<Type extends View | Subject | Task>(args: Partial<Type> = {}) {
        const item = {...args} as Type;

        item.id = uuidv1();
        item.parent = item.parent === undefined ? "root" : item.parent;
        item.children = [];

        const parent = item.parent === "root" ? this.data.homework : this.data.homework.items.find(({ id }) => id === item.parent);

        this.data.homework.items.push(item);

        parent?.children.push(item.id);

        return item.id;
    }

    async deleteItem(id: string) {
        const searchId = id;

        const item = this.data.homework.items.findIndex(({ id }) => id === searchId);

        for (const childId in this.data.homework.items[item].children) {
            const child = this.data.homework.items.find(({ id }) => id === childId);

            if (child !== undefined) {
                child.parent = "root";
            }
        }

        if (item !== undefined) {
            this.data.homework.items.splice(item, 1);
        }
    }

    async changeItemParent(id: string, parent: string) {
        const searchId = id;
        const itemIndex = this.data.homework.items.findIndex(({ id }) => id === searchId);
        const item = this.data.homework.items[itemIndex];

        // To-do: Make a function to replace this item finding process
        const ogParentId = item.parent;
        const ogParentIndex = this.data.homework.items.findIndex(({ id }) => id === ogParentId);
        this.data.homework.items[ogParentIndex].children.remove(id);

        item.parent = parent;

        const parentIndex = this.data.homework.items.findIndex(({ id }) => id === parent);
        this.data.homework.items[parentIndex].children.push(id);
    }
}