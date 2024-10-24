import { createContext } from "preact";
import HomeworkModal from "src/homework-modal";

import Header from "./header";

interface Props {
    modal: HomeworkModal
}

export const PluginContext = createContext<Props | null>(null);

export default function ModalComponent(props: Props) {
    return (
        <div className={"homework-modal"}>
            <PluginContext.Provider value={props}>
                <Header />
                
            </PluginContext.Provider>
        </div>
    );
}