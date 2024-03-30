import { View } from "src/data-editor";
import { IconButton } from "./icon-button";
import { useState } from 'preact/hooks'
import { MenuItem } from "./menu-item";

interface Props {
    onEditClick?: Function;
    onMenuClick?: (viewId?: number, source?: "manage-views" | "add-task" | "add-subject") => any;
};

export default function Header({onEditClick, onMenuClick, ...props}: Props) {
    const views = this.props.data;
    const view = this.props.data[this.props.currentView]; 
    const editing = this.props.editing;

    const [showDropdownMenu, setDropdownMenu] = useState(false);
    const [currentView, setCurrentView] = useState(0);

    const onDropdownClick = () => {
        setDropdownMenu(!showDropdownMenu);
    }

    if (editing || this.props.currentView !== currentView) {
        setDropdownMenu(false);
    }

    setCurrentView(this.props.currentView)

    let dropdownMenu = (
        <div className="menu mod-tab-list" id="menu">
            {views.map((view: View, index: number)  => (
                index !== this.props.currentView && 
                <MenuItem 
                    onClick={() => {onMenuClick?.(index)}} 
                    title={view.name} icon='layers' 
                    attributeMessage="Switch to view" attributePosition="right"/>
            ))}

            <div className="menu-separator"/>

            <MenuItem 
                onClick = {() => {onMenuClick?.(undefined, "manage-views")}}
                title="Manage views" icon='pencil' attributeMessage="Add, delete, sort, or rename your views" attributePosition="right"/>

            <div className="menu-separator"/>

            <MenuItem 
                onClick = {() => {onMenuClick?.(undefined, "add-task")}}
                title="Add task" icon='plus' attributeMessage="Creates a task without a subject" attributePosition="right"/>

            <MenuItem 
                onClick = {() => {onMenuClick?.(undefined, "add-subject")}}
                title="Add subject" icon='copy-plus' attributeMessage="Creates a subject in the current view" attributePosition="right"/>
        </div>
    )

    return (
        <>
            <div id="header"> 
                <div id= "left-column">
                    {!editing && <IconButton icon='chevron-down' attributeMessage="Options" attributePosition="top" onClick={onDropdownClick}/> }
                    
                    <h1>{view.name}</h1>    
                </div>
                
                <IconButton icon='pencil' onClick={onEditClick}/>
            </div>
            <div>
                {showDropdownMenu && dropdownMenu}
            </div>
        </>
    );
}