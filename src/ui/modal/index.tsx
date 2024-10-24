import HomeworkManagerPlugin from "src/main";
import { createContext } from "preact";
import { App } from "obsidian";
import HomeworkModal from "src/homework-modal";

interface Props {
    modal: HomeworkModal
}

export const PluginContext = createContext<Props | null>(null);

export default function ModalComponent(props: Props) {
    return (
        <div className={"homework"}>
            <PluginContext.Provider value={props}>
                <h1>test</h1>
            </PluginContext.Provider>
        </div>    
    );
}