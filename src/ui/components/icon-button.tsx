import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect } from 'preact/hooks';

interface Props {
    icon: string;
    onClick?: any;
    attributeMessage?: string,
    attributePosition?: string
};

export function IconButton({ icon, onClick, attributeMessage, attributePosition }: Props) {
    const element = useRef(null);

    useLayoutEffect(() => {
        if (element.current) {
            setIcon(element.current, icon);
        } 
    });

    return (   
        <span ref = {element} onClick={onClick} class = "clickable-icon" aria-label={attributeMessage} data-tooltip-position={attributePosition}/>
    );
}