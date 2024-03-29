export function Homework({ name }: {name: string}) {
    return (
        <>
            <h1>{name}</h1>

            <Task name = "TESTTTT"/>
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