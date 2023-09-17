export namespace HomeworkData {
    export async function readData() {
        const jsonPath = this.app.vault.configDir + "/plugins/Obsidian-Homework-Plugin/homeworkData.json";
        const result = await this.app.vault.adapter.read(jsonPath);
        const data = JSON.parse(result);
    
        return data;
    }

    export function writeData(data: string) {
        const jsonPath = this.app.vault.configDir + "/plugins/Obsidian-Homework-Plugin/homeworkData.json";
    
        this.app.vault.adapter.write(jsonPath, data);
    }
}