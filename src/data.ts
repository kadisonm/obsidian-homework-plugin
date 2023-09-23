import { normalizePath, Notice } from 'obsidian';

export async function loadHomeworkData() {
    const jsonPath = this.app.vault.configDir + "/plugins/homework-manager/homeworkData.json";
    const normalisedPath = normalizePath(jsonPath);

    let exists = await this.app.vault.adapter.exists(jsonPath);

    if (!exists) {
        await this.app.vault.create(jsonPath, "{}");
    }

    const result = await this.app.vault.adapter.read(jsonPath);

    return JSON.parse(result);
}

export function saveHomeworkData(data : Object) {
    const jsonPath = this.app.vault.configDir + "/plugins/homework-manager/homeworkData.json";
    this.app.vault.adapter.write(jsonPath, JSON.stringify(data));
}