import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect } from 'preact/hooks';
import { useState } from 'preact/hooks';
import { IconButton } from './icon-button';

interface Props {
    text: string;
    onDropdownClick: any;
    onNewTaskClick: any;
};

export function Section({ text, onDropdownClick, onNewTaskClick}: Props) {
    const iconEl = useRef(null);
    const projectEl = useRef(null);
    const [active, setActive] = useState(true);

    useLayoutEffect(() => {
        if (iconEl.current) {
            setIcon(iconEl.current, "chevron-down");
        } 
    });

    const sectionClicked = () => {
        onDropdownClick();
        setActive(!active);
    };

    const style = {
        transform: active ? 'rotate(0deg)' : 'rotate(-90deg)', 
        transition: 'transform 150ms ease',
    }

    return (   
        <div class="section"> 
            <div ref={projectEl} onClick={sectionClicked} class={active ? "section-dropdown is-active" : "section-dropdown"}>
                <div style={style} ref={iconEl} class="section-icon"/>
                <div class="section-name">{text}</div>
            </div>

            <IconButton icon="plus" onClick={onNewTaskClick}/>
        </div>
    );
}