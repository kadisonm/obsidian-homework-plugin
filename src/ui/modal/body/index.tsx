import { useContext, useLayoutEffect } from 'preact/hooks';
import { Project } from 'src/data-manager';

import { DataContext, ProjectContext } from "src/ui/modal";

import { Section } from 'src/ui/components/section';

export default function Body() {
    const data = useContext(DataContext);
    const { projectId, setProjectId } = useContext(ProjectContext);

    if (!data)
        return (<></>) // make this return a component later

    const project = data.getItem(projectId) as Project;

    if (!project)
        return (<></>) 

    const sections = project.children;

    const onDropdownClick = () => {

    }

    const onNewTaskClick = () => {

    }

    useLayoutEffect(() => {
        console.log("refreshed")
    });

    return (
        <div class={"body"}> 
            {
                sections.map((sectionId: string) => (
                    <Section 
                        text={data.getItem(sectionId)?.name ?? "Unknown Section"}
                        onDropdownClick={onDropdownClick} 
                        onNewTaskClick={onNewTaskClick}/>
                ))
            }
        </div>
    );
}