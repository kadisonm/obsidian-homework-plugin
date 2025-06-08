import TickawayPlugin from './main';
import { v1 as uuidv1 } from 'uuid';

type AllTypes = Project | Section | Task | SubTask;
type StringTypes = "Item" | "Project" | "Section" | "Task" | "SubTask"

abstract class Item {
    id: string;
    name: string;

    constructor(name: string) {
        this.id = uuidv1();
        this.name = name;
    }
}

class Project extends Item {
    type: "Project" = "Project";
    children: string[] = [];

    constructor(name: string) {
        super(name);
    }
}

class Section extends Item {
    type: "Section" = "Section";
    children: string[] = [];
    constructor(
        name: string,
        public parent: string,
        public sort: string
    ) {
        super(name);
    }
}

class Task extends Item {
    type: "Task" = "Task";
    children: string[] = [];
    constructor(
        name: string,
        public parent: string,
        public date?: Date,
        public page?: string,
        public description?: string
    ) {
        super(name);
    }
}

class SubTask extends Item {
    type: "SubTask" = "SubTask";
    constructor(
        id: string,
        name: string,
        public parent: string,
        public date?: Date,
        public description?: string
    ) {
        super(name);
    }
}

interface PluginData {
    settings: {
        hideFinishedTasks: boolean,
        showTooltips: boolean,
        version: string
    },
    lastProject?: string,
    items: AllTypes[];  
    legacy?: {}
}

const DEFAULT_DATA: PluginData = {
    settings: {
        hideFinishedTasks: true,
        showTooltips: true,
        version: "2.0.0"
    },
    lastProject: undefined,
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

        this.getLastProject();

		await this.save();
	}

	async save() {
		await this.plugin.saveData(this.data);
	}

    getLastProject(): Project {
        if (this.data.lastProject === undefined) {
            const project = this.getItemsOfType("Project")[0] as Project

            if (project) {
                this.data.lastProject = project.id;
                return project
            } else {
                const projectId = this.addItem(new Project("New Project"))
                this.data.lastProject = projectId;

                //console.log(this.getItem(projectId) as Project)

                return this.getItem(projectId) as Project;
            }
        } else {
            return this.getItem(this.data.lastProject) as Project;
        }
    }

    setLastProject(id: string) {
        this.data.lastProject = id;
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

    getItemsOfType(type: StringTypes) {
        const found: AllTypes[] = []

        for (const item of this.data.items) {
            if (item.type === type) {
                found.push(item)
            }
        }

        return found
    }

    addItem(item: AllTypes) {
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