import TickawayPlugin from './main';
import { v1 as uuidv1 } from 'uuid';

interface Item {
    name?: string;
    id: string;
}

export interface Project extends Item {
    readonly type: "Project";
    children: string[];
}

export interface Section extends Item {
    readonly type: "Section";
    children: string[];
    parent: string;
    sort: string;
}

export interface Task extends Item {
    readonly type: "Task";
    children: string[];
    parent: string;
    date?: Date;
    page?: string;
    description?: string;
}

export interface SubTask extends Item {
    readonly type: "SubTask";
    parent: string;
    date?: Date;
    description?: string;
}

interface PluginData {
    settings: {
        hideFinishedTasks: boolean,
        showTooltips: boolean,
        version: string
    },
    items: Array<Project | Section | Task | SubTask>;  
    legacy?: {}
}

const DEFAULT_DATA: PluginData = {
    settings: {
        hideFinishedTasks: true,
        showTooltips: true,
        version: "2.0.0"
    },
    items: [],
    legacy: {}
}

export class DataManager {
    plugin: TickawayPlugin
    data: PluginData;

    constructor(plugin: TickawayPlugin) {
        this.plugin = plugin;

        this.load();
    }

    async load() {
		const foundData = Object.assign({}, await this.plugin.loadData());

        // TODO: Migrate legacy data

        this.data = Object.assign({}, DEFAULT_DATA, foundData);

		await this.save();
	}

	async save() {
		await this.plugin.saveData(this.data);
	}

    hasChildren(item: Item): Boolean{
        return "children" in item;
    }

    getItem(itemId: string) {
        return this.data.items.find(({ id }) => id === itemId);
    }

    getItemIndex(itemId: string) {
        const index = this.data.items.findIndex(({ id }) => id === itemId)

        return index !== -1 ? index : undefined;
    }

    createItem<Type extends Project | Section | Task | SubTask>(args: Partial<Type> = {}) {
        const item = {...args} as Type;

        item.id = uuidv1();
        
        if (item.type === "Section" || item.type === "Task") {
            item.parent = item.parent === undefined ? "root" : item.parent; 
            item.children = [];

            const parent = this.data.items.find(({ id }) => id === item.parent) as Project | Section | Task;
            parent?.children.push(item.id);
        }

        this.data.items.push(item);

        return item.id;
    }

    deleteItem(itemId: string) {
        const itemIndex = this.getItemIndex(itemId);

        if (!itemIndex) return;

        const item = this.data.items[itemIndex]

        if (item.type === "Section" || item.type === "Task") {
            for (const childId in item.children) {
                const childIndex = this.getItemIndex(childId);

                if (childIndex !== undefined) {
                    this.data.items.splice(childIndex, 1);
                }  
            }
        }
        
        this.data.items.splice(itemIndex, 1);
    }

    changeItemParent(itemId: string, parentId: string) {
        const item = this.getItem(itemId)

        if (item && "parent" in item) {
            const ogParent = this.getItem(item.parent);

            if (ogParent && "children" in ogParent)
                ogParent.children.remove(itemId);

            item.parent = parentId;

            const parent = this.getItem(parentId)

            if (parent && "children" in parent)
                parent.children.push(itemId);
        }
    }

    reorderItem(itemId: string, targetIndex: number) {
        const item = this.getItem(itemId)

        if (item && "parent" in item) {
            const parent = this.getItem(item.parent);

            if (parent && "children" in parent) {
                const currentIndex = parent.children.findIndex(item => item === itemId);
                
                if (currentIndex === -1) return;

                const [deletedItem] = parent.children.splice(currentIndex, 1);

                const clampedIndex = Math.clamp(targetIndex, 0, parent.children.length);

                parent.children.splice(clampedIndex, 0, deletedItem);
            }
                
        }
    }
}