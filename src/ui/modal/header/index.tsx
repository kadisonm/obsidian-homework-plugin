import { IconButton } from "src/ui/components/icon-button";
import { useState } from 'preact/hooks';
import { MenuItem } from "src/ui/components/menu-item";
import { useContext } from 'preact/hooks';
import { Project } from "src/data-manager";
import { DataContext, ProjectContext } from "src/ui/modal";
import { ProjectSwitcher } from "src/ui/components/project-switcher";

export default function Header() {
    const data = useContext(DataContext);
    const { currentProject, setProject } = useContext(ProjectContext);

    // To do: Turn this into a global component that can be used whenever no data could be found
    if (!data) {
        return (
            <>
                Error could not find user data or default project
            </>
        )
    }

    const projects = data.getItemsOfType("Project");

    let lastProject = data.getLastProject();

    const [showDropdownMenu, setDropdownMenu] = useState(false);

    // Disable dropdown menu on view change or editing
    if (currentProject !== lastProject.id) {
        //setDropdownMenu(false);
        data.setLastProject(currentProject);
        lastProject = data.getLastProject();
    }

    const onDropdownClick = () => {
        setDropdownMenu(!showDropdownMenu);
    }

    const onMenuClick = (projectId: string) => {
        if (data.getItem(projectId) !== undefined)
            setProject(projectId);
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
                            projects.map((project: Project) => (
                                <MenuItem 
                                    onClick={() => {onMenuClick(project.id)}} 
                                    title={project.name} icon='layers' 
                                    checked={project.id === currentProject}
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