import HomeworkManagerPlugin from "src/main";
import Header from "./components/header";
import { useState } from "preact/hooks";
import { createContext } from "preact";
import { App } from "obsidian";
import HomeworkModal from "src/elements/homework-modal";
import Body from "./components/body";

export const HomeworkModalContext = createContext<any>(undefined);

export default function ModalComponent({ modal, plugin, app}: { modal: HomeworkModal, plugin: HomeworkManagerPlugin, app: App }) {
    const views = plugin.data.views;
    const [editing, setEditing] = useState(false);
    const [currentView, setView] = useState(0);

    return (
        <div className={"homework"}>
            <HomeworkModalContext.Provider value={ {modal, plugin, app, views, editing, currentView, setView, setEditing}}>
                <Header/>
                <Body/>
            </HomeworkModalContext.Provider>
        </div>    
    );
}