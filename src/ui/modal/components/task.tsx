import { TFile, Notice } from "obsidian";
import { Task } from "src/data-editor";
import { useContext } from 'preact/hooks';
import { HomeworkModalContext } from "..";

export default function TaskComponent({ task }: {task: Task}) {
    const props = useContext(HomeworkModalContext);

    const onLinkClick = () => {
        const file = props.app.vault.getAbstractFileByPath(task.page);

        if (file instanceof TFile)
        {
            props.app.workspace.getLeaf().openFile(file);
            props.modal.close();
            return;
        }

        new Notice("Linked file cannot be found.");
    }

    return (
        <div id="task">
            {/* Left Div */}
            <div>
                <div id="check"/>
            </div>
            
            {/* Right Div */}
            <div>
                <p onClick={onLinkClick} className="homework-manager-link" aria-label="Go to linked file" data-tooltip-position="right">
                    {task.name}
                </p>
            </div>
        </div>
    );
}