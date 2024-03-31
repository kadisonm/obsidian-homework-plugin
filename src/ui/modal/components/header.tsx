import { View } from "src/data-editor";
import { IconButton } from "src/ui/components/icon-button";
import { useState } from 'preact/hooks'
import { MenuItem } from "src/ui/components/menu-item";
import { HomeworkModalContext } from "..";
import { useContext } from 'preact/hooks';

export default function Header() {
    const props = useContext(HomeworkModalContext);

    const view = props.views[props.currentView]

    const [showDropdownMenu, setDropdownMenu] = useState(false);
    const [lastView, setLastView] = useState(0);

    // Disable dropdown menu on view change or editing
    if (props.editing || props.currentView !== lastView) {
        setDropdownMenu(false);
    }

    setLastView(props.currentView)

    const onDropdownClick = () => {
        setDropdownMenu(!showDropdownMenu);
    }

    const onEditClick = () => {
        props.setEditing(!props.editing);
    }

    const onMenuClick = (source: 'switch-view' | 'manage-views' | 'add-task' | 'add-subject', viewId?: number) => {
        switch (source) {
            case 'switch-view': {
                props.setView(viewId);
                break;
            } 
        }
    }

    return (
        <>
            <div id="header"> 
                <div id= "left-column">
                    {!props.editing && <IconButton icon='chevron-down' attributeMessage="Options" attributePosition="top" onClick={onDropdownClick}/> }
                    
                    <h1>{view.name}</h1>    
                </div>
                
                <IconButton icon={props.editing ? "book-open" : "pencil"} onClick={onEditClick}/>
            </div>
            <div>
                {showDropdownMenu && 
                    <div className="menu mod-tab-list" id="menu">
                    {props.views.map((view: View, index: number)  => (
                        index !== props.currentView && 
                        <MenuItem 
                            onClick={() => {onMenuClick('switch-view', index)}} 
                            title={view.name} icon='layers' 
                            attributeMessage="Switch to view" attributePosition="right"/>
                    ))}
        
                    <div className="menu-separator"/>
        
                    <MenuItem 
                        onClick = {() => {onMenuClick('manage-views')}}
                        title="Manage views" icon='pencil' attributeMessage="Add, delete, sort, or rename your views" attributePosition="right"/>
        
                    <div className="menu-separator"/>
        
                    <MenuItem 
                        onClick = {() => {onMenuClick('add-task')}}
                        title="Add task" icon='plus' attributeMessage="Creates a task without a subject" attributePosition="right"/>
        
                    <MenuItem 
                        onClick = {() => {onMenuClick('add-subject')}}
                        title="Add subject" icon='copy-plus' attributeMessage="Creates a subject in the current view" attributePosition="right"/>
                    </div>
                }
            </div>
        </>
    );
}