import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect } from 'preact/hooks';

interface Props {
    title: string;
    currentView?: boolean;
    icon?: string;
    onClick?: any;
    attributeMessage?: string,
    attributePosition?: string
};

export function MenuItem({ title, currentView, icon, onClick, attributeMessage, attributePosition }: Props) {
    const element = useRef(null);

    useLayoutEffect(() => {
        if (element.current && icon) {
            setIcon(element.current, icon);
        }
    });
    
    const id = currentView ? "selected-view" : "";

    const click = currentView ? undefined : onClick;

    const message = currentView ? "Already selected" : attributeMessage;

    return (   
        <div onClick={click} id={id} className="menu-item" aria-label={message} data-tooltip-position={attributePosition}>
            <div ref = {element} className="menu-item-icon"/>
            <div className="menu-item-title"> {title} </div>
        </div>
    );
}