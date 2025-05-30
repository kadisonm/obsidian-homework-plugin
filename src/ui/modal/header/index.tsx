import { Icon } from "src/ui/components/icon";
import { useState } from 'preact/hooks';
import { MenuItem } from "src/ui/components/menu-item";
import { useContext } from 'preact/hooks';
import { Project } from "src/data-manager";
import { DataContext, ProjectContext } from "src/ui/modal";

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
    const defaultProject = data.getDefaultProject();

    const [showDropdownMenu, setDropdownMenu] = useState(false);
    const [lastProject, setLastProject] = useState<string>();

    if (defaultProject && !currentProject) {
        setProject(defaultProject.id);
    }

    // Disable dropdown menu on view change or editing
    if (currentProject !== lastProject) {
        setDropdownMenu(false);
    }

    setLastProject(currentProject)

    const onDropdownClick = () => {
        setDropdownMenu(!showDropdownMenu);
    }

    const onMenuClick = (projectId: string) => {
        if (data.getItem(projectId) !== undefined)
            setProject(projectId);
    }

    const getProject = () => data.getItem(currentProject);

    //chevrons-up-down

    return (
        <>
            <div id="header"> 
                <div id= "left-column">
                    {<Icon icon='chevron-up-down'/> }
                    
                    <h1>{getProject()?.name ?? "Unnamed View"}</h1>    
                </div>

            </div>
            <div>
                {showDropdownMenu && 
                    <div className="menu mod-tab-list" id="menu">
                        { 
                            projects.map((project: Project)  => (
                                project.id !== currentProject && 
                                <MenuItem 
                                    onClick={() => {onMenuClick(project.id)}} 
                                    title={project.name ?? "Unnamed View"} icon='layers' 
                                    attributeMessage="Switch to view" attributePosition="right"/>
                            ))
                        }
                    </div>
                }
            </div>
        </>
    );
}