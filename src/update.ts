import { App, TFile, normalizePath } from 'obsidian';

const path = ".obsidian/plugins/homework-manager/temp"

export default async function asyncisUpdated(app: App) {
    let file = await app.vault.adapter.exists(normalizePath(path));

    if (file)
        return false

    await app.vault.create(path, "")
    return true
}