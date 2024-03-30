import { View } from "src/data-editor";
import { IconButton } from "src/ui/components/icon-button";
import { useState } from 'preact/hooks'
import { MenuItem } from "src/ui/components/menu-item";

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

    // Disable dropdown menu on view change or editing
    if (editing || this.props.currentView !== currentView) {
        setDropdownMenu(false);
    }

    setCurrentView(this.props.currentView)

    // Set edit button icon depending on mode
    const editIcon = editing ? "book-open" : "pencil";

    // If dropdown button is clicked then hide/show the menu
    const onDropdownClick = () => {
        setDropdownMenu(!showDropdownMenu);
    }

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
                
                <IconButton icon={editIcon} onClick={onEditClick}/>
            </div>
            <div>
                {showDropdownMenu && dropdownMenu}
            </div>
        </>
    );
}