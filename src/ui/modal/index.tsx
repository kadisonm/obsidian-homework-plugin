import { createContext, PreactContext, ContainerNode  } from "preact";
import HomeworkModal from "src/main-modal";

import Header from "./header";
import Body from "./body";
import { DataManager } from "src/data-manager";
import { useState, StateUpdater } from "preact/hooks";
import MainModal from "src/main-modal";

interface Props {
    modal: HomeworkModal;
    data: DataManager;
    currentProject: string;
}

export const ModalContext = createContext<MainModal | null>(null);
export const DataContext = createContext<DataManager | null>(null);
export const ProjectContext = createContext<any>(null);

const pipe = (value: any, ...fns: Function[]) => {
    return fns.reduce((acc, fn) => fn(acc), value);
};

export default function ModalComponent({modal, data, currentProject}: Props) {
    const [project, setProject] = useState("Test")

    const providers = (children: any) => pipe(
        children,
        (c: ContainerNode) => <ModalContext.Provider value={modal}>{c}</ModalContext.Provider>,
        (c: ContainerNode) => <DataContext.Provider value={data}>{c}</DataContext.Provider>,
        (c: ContainerNode) => <ProjectContext.Provider value={{ project, setProject }}>{c}</ProjectContext.Provider>
    );

    return providers(
        <div class={"tickaway-modal"}>
            <Header />
            <Body />
        </div>
    );
}