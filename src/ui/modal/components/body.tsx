import { Subject, Task} from "src/data-editor";
import { IconButton } from "src/ui/components/icon-button";
import { HomeworkModalContext } from "..";
import { useContext } from 'preact/hooks';
import { Notice, TFile } from "obsidian";

export default function Body() {
    const props = useContext(HomeworkModalContext);

    function taskLinkClicked(page: string) {
        if (page !== undefined) {
            const file = this.app.vault.getAbstractFileByPath(page);

            if (file instanceof TFile)
            {
                this.app.workspace.getLeaf().openFile(file);
                this.modal.closeModal();
                return;
            }

            new Notice("Linked file cannot be found.");
        }
    }

    return (
        <div id="body">
            {props.views[props.currentView].subjects.map((subject: Subject, index: number)  => (
                <div id="subject">
                    <div id="title"> 
                        <h2>{subject.name}</h2>
                        <IconButton icon={"plus"}/> 
                    </div>
                    
                    {subject.tasks.map((task: Task, index: number)  => (
                        <div id="task">
                            {/* Left Div */}
                            <div>
                                <div id="check"/>
                            </div>
                            
                            {/* Right Div */}
                            <div>
                                <p onClick={() => {taskLinkClicked(task.page)}} className={task.page && "homework-link"} aria-label="Go to linked file" data-tooltip-position="right">
                                    {task.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}