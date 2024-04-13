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

    // Convert legacy versions (1.0.0, 1.1.0) to new data structure
    convertFromLegacy(legacyData: any) {
        const newData = Object.assign({}, DEFAULT_DATA);

        newData.views.push({
            id: uuidv1(),
            order: 0,
            name: "View 1",
        });

        Object.keys(legacyData).forEach((subjectName: string, subjectIndex: number) => {
            const currentSubjectId = uuidv1();

            newData.subjects.push({
                id: currentSubjectId,
                parentId: "V0",
                order: subjectIndex,
                name: subjectName
            });

            const legacySubject = legacyData[subjectName];

            Object.keys(legacySubject).forEach((taskName: string, taskIndex: number) => {
                newData.tasks.push({
                    id: uuidv1(),
                    parentId: currentSubjectId,
                    order: taskIndex,
                    name: taskName,
                    page: legacySubject[taskName].page,
                    date: legacySubject[taskName].date,
                });
            });
        });

		console.log("Found legacy data and converted.\n\nLegacy", legacyData, "\n\nConverted", newData)

        return newData;
    }

    formatData(data: any) {
        const newData = Object.assign({}, DEFAULT_DATA, data);

        newData.views.forEach((object: View, index: number) => {
            const newObject = Object.assign({}, object);

            Object.keys(newObject).forEach((key) => {
                const view = {} as View;

                if (!view.hasOwnProperty(key))
                  delete newObject[key];
            });

            newData.subjects[index] = newObject
            console.log(newData.views[index])
        });

        newData.subjects.forEach((object: Subject, index: number) => {
            newData.subjects[index] = Object.assign({}, object);
        });

        newData.tasks.forEach((object: Task, index: number) => {
            newData.tasks[index] = Object.assign({}, object);
        });

        return newData;
    }



    // async addSubject(viewIndex: number, subjectName: string) {
    //     const view = this.plugin.data.views[viewIndex];

    //     if (!view) {
    //         return;
    //     }

    //     view.subjects.push({
    //         "name": subjectName,
    //         "tasks": []
    //     });

    //     await this.plugin.writeData();
    // }

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