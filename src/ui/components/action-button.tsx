import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect, useState } from 'preact/hooks';

interface Props {
    title: string;
    icon: string;
    onClick?: any;
    attributeMessage?: string,
    attributePosition?: string
};

export function ActionButton({ title, icon, onClick, attributeMessage, attributePosition }: Props) {
    const element = useRef(null);
    const [toggled, setToggled] = useState(false)

    useLayoutEffect(() => {
        if (element.current) {
            setIcon(element.current, icon);
        } 
    });

    return (   
        <div onClick={onClick} class="action-button" aria-label={attributeMessage} data-tooltip-position={attributePosition}>
            <div ref = {element} class="action-button-icon"/>
            <div class="action-button-title">{title}</div>
        </div>
    );
}