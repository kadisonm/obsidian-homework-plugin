import { View } from "src/data-editor";
import { IconButton } from "src/ui/components/icon-button";
import { useState } from 'preact/hooks'
import { MenuItem } from "src/ui/components/menu-item";
import { HomeworkModalContext } from "..";
import { useContext } from 'preact/hooks';

export default function Header() {
    const props = useContext(HomeworkModalContext);

    const [showDropdownMenu, setDropdownMenu] = useState(false);

    // Disable dropdown menu on editing
    if (props.editing) {
        setDropdownMenu(false);
    }

    const onDropdownClick = () => {
        setDropdownMenu(!showDropdownMenu);
    }

    const onEditClick = () => {
        props.setEditing(!props.editing);
    }

    const onMenuClick = (source: 'switch-view' | 'manage-views' | 'add-task' | 'add-subject', view?: View) => {
        switch (source) {
            case 'switch-view': {
                if (view)
                    props.setView(view);
                break;
            } 
        }

        setDropdownMenu(false);
    }

    const views = props.views.sort((a: View, b: View) => a.order - b.order);

    return (
        <>
            <div id="header"> 
                <div id= "left-column">
                    {!props.editing && <IconButton icon='chevron-down' attributeMessage="Options" attributePosition="top" onClick={onDropdownClick}/> }
                    
                    <h1>{props.currentView.name}</h1>    
                </div>
                
                <IconButton icon={props.editing ? "book-open" : "pencil"} onClick={onEditClick}/>
            </div>
            <div>
                {showDropdownMenu && 
                    <div className="menu mod-tab-list" id="menu">

                        {views.map((view: View) => (
                            <MenuItem
                                currentView={view.id === props.currentView.id}
                                onClick={() => {onMenuClick('switch-view', view)}} 
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