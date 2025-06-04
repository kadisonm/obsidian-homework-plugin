import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect } from 'preact/hooks';

interface Props {
    icon: string;
};

export function Icon({icon}: Props) {
    const element = useRef(null);

    useLayoutEffect(() => {
        if (element.current) {
            setIcon(element.current, icon);
        } 
    });

    return (   
        <span ref={element}/>
    );
}