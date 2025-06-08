import { createContext } from "preact";
import HomeworkModal from "src/main-modal";

import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import { DataManager } from "src/data-manager";
import MainModal from "src/main-modal";
import { useState } from 'preact/hooks';

interface Props {
    modal: HomeworkModal;
    data: DataManager;
    project: string;
}

export const ModalContext = createContext<MainModal | null>(null);
export const DataContext = createContext<DataManager | null>(null);
export const ProjectContext = createContext<any>(null);

function Providers(data: Props, children: any) {
    const [projectId, setProjectId] = useState(data.project);

    return (
        <ModalContext.Provider value={data.modal}>
            <DataContext.Provider value={data.data}>
                <ProjectContext.Provider value={{projectId, setProjectId}}>
                    {children}
                </ProjectContext.Provider>
            </DataContext.Provider>
        </ModalContext.Provider>
    )
}

export default function ModalComponent(data: Props) {
    return Providers(data, (
        <div class={"tickaway-modal"}>
            <Header/>
            <Body/>
            <Footer/>
        </div>
    ));
}