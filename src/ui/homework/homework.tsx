import { View } from "src/data-editor";

import Header from "./components/header";
import SubjectList from "./components/subject-list";
import { useState } from "preact/hooks";

interface Props {
    data: View[];
    editing?: boolean;
    currentView?: number;
};

export default function Homework({data}: Props) {
    let setEditing: Function;
    [this.props.editing, setEditing] = useState(false);

    let setView: Function;
    [this.props.currentView, setView] = useState(0);

    const onEditClick = () => {
        setEditing(!this.props.editing);
    };

    const onMenuClick = (viewId?: number, source?: "manage-views" | "add-task" | "add-subject") => {
        if (viewId !== undefined) {
            if (data[viewId]) {
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

    console.log("refresh to view ", this.props.currentView)

    return (
        <div className={"homework"}>
            <Header onEditClick={onEditClick} onMenuClick={onMenuClick} {...this.props} />

            <div id="body">
                <SubjectList subjects={data[this.props.currentView].subjects} {...this.props}/>
            </div>
        </div>
    );
}