import { Subject, Task} from "src/data-editor";
import { IconButton } from "src/ui/components/icon-button";
import { HomeworkModalContext } from "..";
import { useContext } from 'preact/hooks';
import { Notice, TFile } from "obsidian";

export default function Body() {
    const props = useContext(HomeworkModalContext);

    const taskChecked = (subjectIndex: number, taskIndex: number) => {
        if (taskIndex != undefined && subjectIndex != undefined) {
            props.plugin.dataEditor.removeTask(props.currentView, taskIndex, subjectIndex);
            this.forceUpdate();
        }
    }

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

    function getDateElement(date: string) {
        if (!date) {
            return;
        }

        const taskDate = new Date(date);

        if (!taskDate.valueOf()) {
            return;
        }

        let formattedDate = taskDate.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        
        const today = new Date();

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        if (taskDate.toDateString() == today.toDateString()) {
            formattedDate = "Today";
        } else if (taskDate.toDateString() == tomorrow.toDateString()) {
            formattedDate = "Tomorrow";
        } else if (taskDate.toDateString() == yesterday.toDateString()) {
            formattedDate = "Yesterday";
        } 

        const overdue = today > taskDate && today.toDateString() !== taskDate.toDateString() ? "color:var(--text-error)": "";

        return <p id="date" style={overdue}>
            {formattedDate}
        </p>;
    }

    return (
        <div id="body">
            {props.views[props.currentView].subjects.map((subject: Subject, subjectIndex: number)  => (
                <div id="subject">
                    <div id="title"> 
                        <h2>{subject.name}</h2>
                        <IconButton icon={"plus"}/> 
                    </div>
                    
                    {subject.tasks.map((task: Task, taskIndex: number)  => (
                        <div id="task">
                            {/* Left Div */}
                            <div>
                                <div id="check" onClick={() => {taskChecked(subjectIndex, taskIndex)}}/>
                            </div>
                            
                            {/* Right Div */}
                            <div>
                                <p onClick={() => {taskLinkClicked(task.page)}} className={task.page && "homework-link"} aria-label="Go to linked file" data-tooltip-position="right">
                                    {task.name}
                                </p>

                                {getDateElement(task.date)}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}