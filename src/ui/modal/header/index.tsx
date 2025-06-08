import { IconButton } from "src/ui/components/icon-button";
import { useState } from 'preact/hooks';
import { MenuItem } from "src/ui/components/menu-item";
import { useContext } from 'preact/hooks';
import { Project } from "src/data-manager";
import { DataContext, ProjectContext } from "src/ui/modal";
import { ProjectSwitcher } from "src/ui/components/project-switcher";

export default function Header() {
    const data = useContext(DataContext);
    const { projectId, setProjectId } = useContext(ProjectContext);

    if (!data) 
        return (<></>) // Replace later

    const projects = data.getItemsOfType("Project");

    let lastProject = data.getLastProject();

    const [showDropdownMenu, setDropdownMenu] = useState(false);

    // Disable dropdown menu on view change or editing
    if (projectId !== lastProject.id) {
        //setDropdownMenu(false);
        data.setLastProject(projectId);
        lastProject = data.getLastProject();
    }

    const onDropdownClick = () => {
        setDropdownMenu(!showDropdownMenu);
    }

    const onMenuClick = (id: string) => {
        if (data.getItem(id) !== undefined)
            setProjectId(id);
    }

    const onToggleCompletedTasks = () => {

    }
 
    return (
        <>
            <div class="header"> 
                <ProjectSwitcher text={lastProject.name} attributeMessage="Switch projects" attributePosition="left" onClick={onDropdownClick}/> 
                <IconButton icon="eye" toggledIcon="eye-off" attributeMessage="Show/hide completed tasks" attributePosition="top" onClick={onToggleCompletedTasks}/>
            </div>
            <div>
                {showDropdownMenu && 
                    <div class="menu mod-tab-list" id="menu"> 
                        { 
                            projects.map((prj: Project) => (
                                <MenuItem 
                                    onClick={() => {onMenuClick(prj.id)}} 
                                    title={prj.name} icon='layers' 
                                    checked={prj.id === projectId}
                                    attributeMessage="Switch to project" attributePosition="right"/>
                            ))
                        }

                        <div class="menu-separator"/>
            
                        <MenuItem 
                            onClick = {() => {onMenuClick('manage-views')}}
                            title="Manage projects..." icon='folders' attributeMessage="Add, delete, sort, or rename your projects" attributePosition="right"/>
                    </div>
                }
            </div>
        </>
    );
}