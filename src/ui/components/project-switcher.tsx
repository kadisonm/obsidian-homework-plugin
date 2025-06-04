import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect } from 'preact/hooks';

interface Props {
    text: string;
    onClick?: any;
    attributeMessage?: string,
    attributePosition?: string
};

export function ProjectSwitcher({ text, onClick, attributeMessage, attributePosition }: Props) {
    const element = useRef(null);

    useLayoutEffect(() => {
        console.log(element)
        if (element.current) {
            setIcon(element.current, "chevrons-up-down");
        } 
    });

    return (   
        <div onClick={onClick} class="project-switcher" aria-label={attributeMessage} data-tooltip-position={attributePosition}>
            <div ref={element} class="project-switcher-icon"/>
            <div class="project-switcher-name">{text}</div>
        </div>
    );
}