import { Subject } from "src/data-editor";
import TaskList from './task-list';

interface Props {
  subjects: Subject[];
};

export default function SubjectList({subjects, ...props}: Props) {
  return (
    <>
      {subjects.map((subject: Subject, index: number)  => (
        <div id="subject">
          <h2>{subject.name}</h2>
          <TaskList tasks={subject.tasks} {...this.props}/>
        </div>
      ))}
    </>
  );
}