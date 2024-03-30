import HomeworkManagerPlugin from "src/main";
import Header from "./components/header";
import SubjectList from "./components/subject-list";
import { useState } from "preact/hooks";
import { View } from "src/data-editor";

interface Props {
    plugin: HomeworkManagerPlugin;
    views?: View[];
    editing?: boolean;
    currentView?: number;
};

export default function Homework(props: Props) {
    this.props.views = props.plugin.data.views;

    let setEditing: Function;
    [props.editing, setEditing] = useState(false);

    let setView: Function;
    [props.currentView, setView] = useState(0);

    const onEditClick = () => {
        setEditing(!this.props.editing);
    };

    const onMenuClick = (viewId?: number, source?: "manage-views" | "add-task" | "add-subject") => {
        if (viewId !== undefined) {
            if (this.props.views[viewId]) {
                console.log("set view to", viewId)
                setView(viewId);
            }

            return;
        }

        if (source === "manage-views") {

        } else if (source === "add-task") {

        } else if (source === "add-subject") {

        }
    };

    return (
        <div className={"homework"}>
            <Header onEditClick={onEditClick} onMenuClick={onMenuClick} {...props} />

            <div id="body">
                <SubjectList {...props}/>
            </div>
        </div>
    );
}