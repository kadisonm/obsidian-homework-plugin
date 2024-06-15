import HomeworkManagerPlugin from "src/main";
import { createContext } from "preact";
import { App } from "obsidian";
import HomeworkModal from "src/homework-modal";

export const HomeworkModalContext = createContext<any>(undefined);

export default function ModalComponent({ modal, plugin, app }: { modal: HomeworkModal, plugin: HomeworkManagerPlugin, app: App }) {
    return (
        <div className={"homework"}>
            <HomeworkModalContext.Provider value={ {modal, plugin} }>
                <h1>test</h1>
            </HomeworkModalContext.Provider>
        </div>    
    );
}