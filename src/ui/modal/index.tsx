import { createContext } from "preact";
import HomeworkModal from "src/main-modal";

import Header from "./header";
import Body from "./body";

interface Props {
    modal: HomeworkModal
}

export const PluginContext = createContext<Props | null>(null);

export default function ModalComponent(props: Props) {
    return (
        <div className={"homework-modal"}>
            <PluginContext.Provider value={props}>
                <Header />
                <Body />
                
            </PluginContext.Provider>
        </div>
    );
}