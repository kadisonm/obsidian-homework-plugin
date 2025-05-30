import { setIcon } from 'obsidian';
import { useRef, useLayoutEffect } from 'preact/hooks';

interface Props {
    icon: string;
    onClick?: any;
    attributeMessage?: string,
    attributePosition?: string
};

export function Icon({ icon }: Props) {
    const element = useRef(null);

    useLayoutEffect(() => {
        if (element.current) {
            setIcon(element.current, icon);
        } 
    });

    return (   
        <span ref = {element} class = "tree-item-icon"/>
    );
}