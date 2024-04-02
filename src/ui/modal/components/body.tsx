import { Subject, Task} from "src/data-editor";
import { IconButton } from "src/ui/components/icon-button";
import { HomeworkModalContext } from "..";
import { useContext } from 'preact/hooks';
import TaskComponent from "./task";

export default function Body() {
    const props = useContext(HomeworkModalContext);

    const taskLinkClicked = () => {
        console.log('test')
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
                            <p onClick={taskLinkClicked} className={task.page && "homework-link"} aria-label="Go to linked file" data-tooltip-position="right">
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