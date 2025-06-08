import { ActionButton } from "src/ui/components/action-button";

export default function Footer() {

    const newSection = () => {

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