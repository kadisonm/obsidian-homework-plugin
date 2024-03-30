import { Task } from "src/data-editor";

interface Props {
  tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
  return (
    <>
      {tasks.map((task: Task, index: number)  => (
        <div id="task">
          <h3>{task.name}</h3>
          <h3>{task.date}</h3>
        </div>
      ))}
    </>
  );
}