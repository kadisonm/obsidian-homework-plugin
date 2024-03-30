import HomeworkManagerPlugin from "src/main";
import Header from "./components/header";
import SubjectList from "./components/subject-list";
import { useState } from "preact/hooks";
import { createContext } from "preact";

export const HomeworkModalContext = createContext<any>(undefined);

export default function HomeworkModal({ plugin }: { plugin: HomeworkManagerPlugin }) {
    const views = plugin.data.views;
    const [editing, setEditing] = useState(false);
    const [currentView, setView] = useState(0);

    return (
        <div className={"homework"}>
            <HomeworkModalContext.Provider value={ {plugin, views, editing, currentView, setView, setEditing}}>
                <Header/>

                <div id="body">
                    {/* <SubjectList/> */}
                </div>
            </HomeworkModalContext.Provider>
        </div>    
    );
}