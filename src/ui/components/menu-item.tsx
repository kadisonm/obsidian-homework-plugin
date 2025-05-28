import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect } from 'preact/hooks';

interface Props {
    title: string;
    icon?: string;
    onClick?: any;
    attributeMessage?: string,
    attributePosition?: string
};

export function MenuItem({ title, icon, onClick, attributeMessage, attributePosition }: Props) {
    const element = useRef(null);

    useLayoutEffect(() => {
        if (element.current && icon) {
            setIcon(element.current, icon);
        }
    });

    return (   
        <div onClick={onClick} className="menu-item" aria-label={attributeMessage} data-tooltip-position={attributePosition}>
            <div ref = {element} className="menu-item-icon"/>
            <div className="menu-item-title"> {title} </div>
        </div>
    );
}