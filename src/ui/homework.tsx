import { setIcon } from 'obsidian';
import { useRef, useEffect } from 'preact/hooks';

export function Homework({ name }: {name: string}) {
    return (
        <>
            <IconButton icon='pencil'/>

            <h1>{name}</h1>

            <Task name = "TESTTTT"/>
        </>
    );
}

export function IconButton({ icon }: {icon: string}) {
    const element = useRef(null);

    useEffect(() => {
        if (element.current) {
            setIcon(element.current, icon);
        }
    });

    return (
        <>
            <span ref = {element} class = "clickable-icon"/>
        </>
    );
}

export function Task({ name }: {name: string}) {
    return (
        <div>
            <i>{name}</i>
        </div>
    );
}