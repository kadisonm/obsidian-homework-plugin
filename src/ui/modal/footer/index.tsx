import { ActionButton } from "src/ui/components/action-button";
import CreationModal from "src/creation-modal";
import { ModalContext, ProjectContext, DataContext } from "..";
import { useContext } from "preact/hooks";

export default function Footer() {
    const {projectId, setProjectId} = useContext(ProjectContext);
    const modal = useContext(ModalContext);

    console.log(modal);
    console.log(projectId);

    const newSection = () => {
        if (modal) {
            console.log(projectId);
            new CreationModal(modal.app, modal.plugin, "Section", projectId, () => {
                print("Set id")
                setProjectId(projectId);
            }).open();
        }
            
    };

    const newTask = () => {

    };

    return (
        <div class={"footer"}>
            <ActionButton title="Add section" icon={"folder"} onClick={newSection}/>
            <ActionButton title="Add task" icon={"circle-check"} onClick={newTask}/>
        </div>
    );
}