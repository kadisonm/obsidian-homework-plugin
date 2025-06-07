import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect, useState } from 'preact/hooks';

interface Props {
    icon: string;
    toggledIcon?: string;
    onClick?: any;
    attributeMessage?: string,
    attributePosition?: string
};

export function IconButton({ icon, toggledIcon, onClick, attributeMessage, attributePosition }: Props) {
    const element = useRef(null);
    const [toggled, setToggled] = useState(false)

    useLayoutEffect(() => {
        if (toggledIcon === undefined) {
            toggledIcon = icon;
        }

        if (element.current) {
            setIcon(element.current, toggled ? toggledIcon : icon);
        } 
    });

    const clicked = () => {
        if (toggledIcon !== undefined) {
            setToggled(!toggled);
        }

        onClick();
    };

    return (   
        <button ref={element} onClick={clicked} class="clickable-icon" aria-label={attributeMessage} data-tooltip-position={attributePosition}/>
    );
}