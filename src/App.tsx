import { useState, type FormEvent } from 'react';
import './App.css';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type Filter = 'all' | 'open' | 'done';

const initialTasks: Task[] = [
  { id: 1, title: 'Review the CI pipeline', completed: true },
  { id: 2, title: 'Add a real app test', completed: false },
  { id: 3, title: 'Share the repository link', completed: false },
];

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Everything' },
  { value: 'open', label: 'To do' },
  { value: 'done', label: 'Completed' },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<Filter>('all');
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');

  const completedCount = tasks.filter((task) => task.completed).length;
  const openCount = tasks.length - completedCount;
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'open') return !task.completed;
    if (filter === 'done') return task.completed;
    return true;
  });

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTask.trim();

    if (!title) {
      setError('Write a task before adding it.');
      return;
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: Math.max(0, ...currentTasks.map((task) => task.id)) + 1,
        title,
        completed: false,
      },
    ]);
    setNewTask('');
    setError('');
  }

  function toggleTask(id: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a aria-label="Shipshape home" className="wordmark" href="#">
          <span aria-hidden="true" className="brand-icon">
            s
          </span>
          shipshape
        </a>
        <span className="topbar-note">
          <span aria-hidden="true" className="status-dot" />
          Your next release, in good shape
        </span>
      </header>

      <section aria-labelledby="page-title" className="workspace">
        <div className="intro">
          <p className="eyebrow">YOUR LITTLE LAUNCHPAD</p>
          <h1 id="page-title">
            Make room for
            <br />
            <span>what&apos;s next.</span>
          </h1>
          <p className="intro-copy">
            One step at a time, your next release is already taking shape.
          </p>
        </div>

        <section aria-label="Release checklist" className="checklist-card">
          <div className="card-heading">
            <div>
              <p className="card-kicker">IN PROGRESS</p>
              <h2>This week&apos;s checklist</h2>
            </div>
            <div
              aria-label={`${openCount} ${openCount === 1 ? 'task' : 'tasks'} left`}
              className="progress-ring"
            >
              <span className="progress-number">{openCount}</span>
              <span className="progress-caption">left</span>
            </div>
          </div>

          <form className="add-form" onSubmit={addTask}>
            <label className="sr-only" htmlFor="new-task">
              Add a task
            </label>
            <input
              autoComplete="off"
              id="new-task"
              onChange={(event) => {
                setNewTask(event.target.value);
                if (error) setError('');
              }}
              placeholder="What needs doing?"
              type="text"
              value={newTask}
            />
            <button aria-label="Add task" className="add-button" type="submit">
              <span aria-hidden="true">+</span>
            </button>
          </form>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div aria-label="Filter tasks" className="filter-tabs" role="group">
            {filters.map(({ value, label }) => (
              <button
                aria-pressed={filter === value}
                className={`filter-tab${filter === value ? ' is-selected' : ''}`}
                key={value}
                onClick={() => setFilter(value)}
                type="button"
              >
                {label}
                {value === 'all' && (
                  <span className="filter-count">{tasks.length}</span>
                )}
              </button>
            ))}
          </div>

          {visibleTasks.length > 0 ? (
            <ul aria-label="Tasks" className="task-list">
              {visibleTasks.map((task) => (
                <li className="task-item" key={task.id}>
                  <label className="task-label">
                    <input
                      aria-label={`Mark ${task.title} as complete`}
                      checked={task.completed}
                      className="task-checkbox"
                      onChange={() => toggleTask(task.id)}
                      type="checkbox"
                    />
                    <span
                      className={`checkbox-visual${task.completed ? ' is-checked' : ''}`}
                    >
                      {task.completed && (
                        <svg
                          aria-hidden="true"
                          fill="none"
                          height="12"
                          viewBox="0 0 12 12"
                          width="12"
                        >
                          <path
                            d="m2.5 6 2.2 2.2 4.8-4.8"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.7"
                          />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`task-title${task.completed ? ' is-completed' : ''}`}
                    >
                      {task.title}
                    </span>
                  </label>
                  {task.completed && (
                    <span className="done-badge">Done</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state" role="status">
              {filter === 'done'
                ? 'Nothing completed yet. You’ve got this!'
                : 'All caught up! Add a task when you’re ready.'}
            </p>
          )}

          <footer className="card-footer">
            <span>
              <span aria-hidden="true" className="footer-sparkle">
                ✳
              </span>
              {completedCount === tasks.length && tasks.length > 0
                ? 'Everything is done. Nice work!'
                : `${completedCount} of ${tasks.length} tasks complete`}
            </span>
            <span className="saved-indicator">
              <span aria-hidden="true" className="saved-dot" />
              Looking good
            </span>
          </footer>
        </section>

        <p className="page-note">Small steps. Good things ahead.</p>
      </section>
    </main>
  );
}

export default App;
