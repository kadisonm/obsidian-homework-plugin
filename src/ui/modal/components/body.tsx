import { Subject, Task} from "src/data-editor";
import { IconButton } from "src/ui/components/icon-button";
import { HomeworkModalContext } from "..";
import { useContext } from 'preact/hooks';
import TaskComponent from "./task";

export default function Body() {
    const props = useContext(HomeworkModalContext);

    return (
        <div id="body">
            {props.views[props.currentView].subjects.map((subject: Subject, index: number)  => (
                <div id="subject">
                <h2>{subject.name}</h2>

                {subject.tasks.map((task: Task, index: number)  => (
                    <TaskComponent task={task}/>
                ))}
                </div>
            ))}
        </div>
    );
}