import { App, SuggestModal, TFile } from "obsidian";

export default class SuggestFileModal extends SuggestModal<TFile> {
    result: TFile;
    onSubmit: (result: TFile) => void;

    constructor(app: App, onSubmit: (result: TFile) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    getSuggestions(query: string): TFile[] {
        const files = this.app.vault.getMarkdownFiles();

        return files.filter((file) =>
            file.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(file: TFile, el: HTMLElement) {
        el.createEl("div", { text: file.name });
        el.createEl("small", { text: file.parent?.name });
    }

    onChooseSuggestion(file: TFile, evt: MouseEvent | KeyboardEvent) {
        this.result = file;
        this.onSubmit(this.result);
    }
}