import { IconButton } from "src/ui/components/icon-button";
import { useState } from 'preact/hooks';
import { MenuItem } from "src/ui/components/menu-item";
import { useContext } from 'preact/hooks';
import { Project } from "src/data-manager";
import { DataContext, ProjectContext } from "src/ui/modal";

export default function Header() {
    const data = useContext(DataContext);
    const {currentProject, setCurrentProject} = useContext(ProjectContext);

    // To do: Turn this into a global component that can be used whenever no data could be found
    if (!data) {
        return (
            <>
                Error could not find user data or default project
            </>
        )
    }

    const projects = data.getItemsOfType("Project");
    const defaultProject = data.getDefaultProject();

    const [showDropdownMenu, setDropdownMenu] = useState(false);
    const [lastProject, setLastProject] = useState("");

    if (defaultProject && !currentProject) {
        currentProject = defaultProject.id;
    }

    // Disable dropdown menu on view change or editing
    if (props.currentProject !== lastProject) {
        setDropdownMenu(false);
    }

    setLastProject(props.currentProject)

    const onDropdownClick = () => {
        setDropdownMenu(!showDropdownMenu);
    }

    const onMenuClick = (source: 'switch-view' | 'manage-views' | 'add-task' | 'add-subject', viewId?: number) => {
        switch (source) {
            case 'switch-view': {
                props.setView(viewId);
                break;
            } 
        }
    }

    //chevrons-up-down

    return (
        <>
            <div id="header"> 
                <div id= "left-column">
                    {<IconButton icon='chevron-up-down' attributeMessage="Options" attributePosition="top" onClick={onDropdownClick}/> }
                    
                    <h1>{view.name}</h1>    
                </div>
                
                <IconButton icon={props.editing ? "book-open" : "pencil"} onClick={onEditClick}/>
            </div>
            <div>
                {showDropdownMenu && 
                    <div className="menu mod-tab-list" id="menu">
                    {projects.map((project: Project)  => (
                        project.id !== props.currentProject && 
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