import { Subject } from "src/data-editor";
import TaskList from './task-list';

export default function SubjectList({...props}) {
  const subjects = props.views[this.props.currentView].subjects;

  return (
    <>
      {subjects.map((subject: Subject, index: number)  => (
        <div id="subject">
          <h2>{subject.name}</h2>
          <TaskList tasks={subject.tasks} {...props}/>
        </div>
      ))}
    </>
  );
}