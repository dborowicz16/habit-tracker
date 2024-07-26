import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

export default function App() {
  const [habits, setHabits] = useState<Array<Schema["Habit"]["type"]>>([]);
  const [habitName, setHabitName] = useState('');
  const [habitType, setHabitType] = useState(true);
  const [goal, setGoal] = useState(0);
  const [goalValue, setGoalValue] = useState('');
  const [goalInterval, setGoalInterval] = useState('');
  const [habitStartDate, setHabitStartDate] = useState(new Date);
  const [habitEndDate, setHabitEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [completionDate, setCompletionDate] = useState(new Date);
  const [isHabitCompleted, setIsHabitCompleted] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');

  function listTodos() {
    client.models.Habit.observeQuery().subscribe({
      next: (data) => setHabits([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
    console.log('give me list', listTodos());
  }, []);

  function createTodo() {
    client.models.Habit.create({
      name: window.prompt("Todo content"),
      type: true,
      goal: 20,
      goalValue: 'Apple',
      goalInterval: 'Day',
      startDate: '2024-07-25',
      endDate: '2024-07-30'
    });

    client.models.CompletionHistory.create({
      date: '2024-07-26',
      isHabitCompleted: true,
      journalEntry: 'This is a test',
    })
  }



  return (

    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}&apos;s todos</h1>          
          <button onClick={createTodo}>+ new</button>
          <button onClick={signOut}>Sign out</button>
          <ul>
            {habits.map((habit) => (
              <li key={habit.id}>{habit.name}</li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/">
              Review next steps of this tutorial.
            </a>
          </div>
        </main>
      )}
    </Authenticator>
  );
}
