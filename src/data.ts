export async function loadHomeworkData() {
    const jsonPath = this.app.vault.configDir + "/plugins/Obsidian-Homework-Plugin/homeworkData.json";
    const result = await this.app.vault.adapter.read(jsonPath);
    //this.data = JSON.parse(result);

    return JSON.parse(result);
}

export function saveHomeworkData(data : Object) {
    const jsonPath = this.app.vault.configDir + "/plugins/Obsidian-Homework-Plugin/homeworkData.json";

    this.app.vault.adapter.write(jsonPath, JSON.stringify(data));
}