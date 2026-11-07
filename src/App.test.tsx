import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('release checklist', () => {
  it('shows the starting tasks and the remaining task count', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /this week's checklist/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Mark Review the CI pipeline as complete',
      }),
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', {
        name: 'Mark Add a real app test as complete',
      }),
    ).not.toBeChecked();
    expect(screen.getByLabelText('2 tasks left')).toBeInTheDocument();
  });

  it('adds a trimmed task and asks for a title when the input is blank', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Add task' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Write a task before adding it.',
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Add a task' }),
      '  Check the build  ',
    );
    await user.click(screen.getByRole('button', { name: 'Add task' }));

    expect(
      screen.getByRole('checkbox', {
        name: 'Mark Check the build as complete',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Add a task' })).toHaveValue('');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('3 tasks left')).toBeInTheDocument();
  });

  it('completes tasks and filters the checklist', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('checkbox', {
        name: 'Mark Add a real app test as complete',
      }),
    );

    expect(screen.getByLabelText('1 task left')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'To do' }));

    const tasks = within(screen.getByRole('list', { name: 'Tasks' }));
    expect(
      tasks.getByRole('checkbox', {
        name: 'Mark Share the repository link as complete',
      }),
    ).toBeInTheDocument();
    expect(
      tasks.queryByRole('checkbox', {
        name: 'Mark Add a real app test as complete',
      }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Completed' }));
    expect(
      tasks.getByRole('checkbox', {
        name: 'Mark Add a real app test as complete',
      }),
    ).toBeChecked();
    expect(
      tasks.queryByRole('checkbox', {
        name: 'Mark Share the repository link as complete',
      }),
    ).not.toBeInTheDocument();
  });
});
