import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect } from 'preact/hooks';

interface Props {
    title: string;
    icon?: string;
    onClick?: any;
    checked?: boolean;
    attributeMessage?: string,
    attributePosition?: string
};

export function MenuItem({ title, icon, onClick, checked, attributeMessage, attributePosition }: Props) {
    const element = useRef(null);

    useLayoutEffect(() => {
        if (element.current && icon) {
            setIcon(element.current, icon);
        }
    });

    return (   
        <div onClick={onClick} class={checked === true ? "menu-item tappable mod-checked" : "menu-item tappable"} aria-label={attributeMessage} data-tooltip-position={attributePosition}>
            <div ref = {element} class="menu-item-icon"/>
            <div class="menu-item-title"> {title} </div>
        </div>
    );
}