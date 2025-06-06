import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect } from 'preact/hooks';
import { useState } from 'preact/hooks';

interface Props {
    text: string;
    onClick?: any;
    attributeMessage?: string,
    attributePosition?: string
};

export function ProjectSwitcher({ text, onClick, attributeMessage, attributePosition }: Props) {
    const iconEl = useRef(null);
    const projectEl = useRef(null);
    const [clicked, setClicked] = useState(false);

    useLayoutEffect(() => {
        if (iconEl.current) {
            setIcon(iconEl.current, "chevrons-up-down");
        } 
    });

    const projectClicked = () => {
        onClick();
        setClicked(!clicked);
    };

    return (   
        <div ref={projectEl} onClick={projectClicked} class={clicked ? "project-switcher is-active" : "project-switcher"} aria-label={attributeMessage} data-tooltip-position={attributePosition}>
            <div ref={iconEl} class="project-switcher-icon"/>
            <div class="project-switcher-name">{text}</div>
        </div>
    );
}