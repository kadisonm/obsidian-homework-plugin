// Legacy v1.1.1
export interface View extends Item {
    readonly type: "View";
}

// Legacy v1.1.1
export interface Subject extends Item {
    readonly type: "Subject";
}

// Legacy v1.1.1
export interface Task extends Item {
    readonly type: "Task";
    date?: Date;
    page?: string;
}