import HomeworkManagerPlugin from "src/main";
import Header from "./components/header";
import { useState } from "preact/hooks";
import { createContext } from "preact";
import { App } from "obsidian";
import HomeworkModal from "src/elements/homework-modal";
import Body from "./components/body";

export const HomeworkModalContext = createContext<any>(undefined);

export default function ModalComponent({ modal, plugin, app}: { modal: HomeworkModal, plugin: HomeworkManagerPlugin, app: App }) {
    const [editing, setEditing] = useState(false);

    const views = plugin.data.views;
    const subjects = plugin.data.subjects;
    const tasks = plugin.data.tasks;

    const fistView = views.find((object) => object.order === 0);

    if (fistView === undefined) {
        console.log("Could not find any views to display.");
        this.modal.close();
        this.plugin.fetchData();
    }

    const [currentView, setView] = useState(fistView);

    return (
        <div className={"homework"}>
            <HomeworkModalContext.Provider value={ {modal, plugin, views, subjects, tasks, app, editing, currentView, setView, setEditing}}>
                <Header/>
                {/* <Body/> */}
            </HomeworkModalContext.Provider>
        </div>    
    );
}