import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Authenticator } from '@aws-amplify/ui-react'
import EmojiPicker from 'emoji-picker-react';
import ReactEcharts from "echarts-for-react"; 
import Chart from "./components/chart";
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

export default function App() {
  const [habits, setHabits] = useState<Array<Schema["Habit"]["type"]>>([]);
  const [habitName, setHabitName] = useState('');
  const [habitType, setHabitType] = useState(true);
  const [goal, setGoal] = useState(0);
  const [goalValue, setGoalValue] = useState('');
  const [goalInterval, setGoalInterval] = useState('');
  const [habitStartDate, setHabitStartDate] = useState('2024-08-25');
  const [habitEndDate, setHabitEndDate] = useState('2024-09-25');
  const [completionDate, setCompletionDate] = useState(new Date);
  const [isHabitCompleted, setIsHabitCompleted] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [showNewHabitModal, setShowNewHabitModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [color, setColor] = useState('#808080');
  const [showHabitInputModal, setShowHabitInputModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState('');

  function listTodos() {
    client.models.Habit.observeQuery().subscribe({
      next: (data) => setHabits([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  client.models.Habit.list().then(value => console.log('value', value));

  const createHabit = () => {
    client.models.Habit.create({
      name: habitName,
      type: habitType,
      emoji: selectedEmoji,
      habitColor: color,
      goal: goal,
      goalValue: goalValue,
      goalInterval: goalInterval,
      currentValue: 0,
      startDate: habitStartDate, //'2024-07-25'
      endDate: habitStartDate,
    });

    client.models.CompletionHistory.create({
      date: '2024-07-26',
      isHabitCompleted: true,
      journalEntry: 'This is a test',
    })

    setShowNewHabitModal(!showNewHabitModal);

    console.log('create habit function')
  }

  const handleHabitNameChange = (event: any) => {
    setHabitName(event.target.value);
  };

  const handleHabitTypeChange = (event: any) => {
    if (event === 'build') {
      setHabitType(true);
    }
    if (event === 'quit') {
      setHabitType(false);
    }
  };

  const handleGoalChange = (event: any) => {
    setGoal(event.target.value);
  };

  const handleGoalValueChange = (event: any) => {
    setGoalValue(event.target.value);
  };

  const handleGoalIntervalChange = (event: any) => {
    setGoalInterval(event.target.value);
  };

  const handleHabitStartDateChange = (event: any) => {
    setHabitStartDate(event.target.value);
  };

  const handleHabitEndDateChange = (event: any) => {
    setHabitEndDate(event.target.value);
  };

  const handleColorChange = (event: any) => {
    setColor(event.target.value);
  };

  return (

    <Authenticator>
      {({ signOut, user }) => (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh', width: '100vw', padding: 100 }}>
            <h1>Let&apos;s make today great! 🥳</h1>
            <div style={{ display: 'flex', gap: 50, flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {habits.map((habit) => (
                <div key={habit.id} style={{ width: 350, height: 350, backgroundColor: habit.habitColor ?? '#1c1c1c', borderRadius: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} onClick={() => setSelectedHabit(habit.id)}>
                  <p style={{ fontSize: 50, margin: 0 }}>{habit.emoji}</p>
                  <p style={{ fontSize: 32, margin: 0, fontWeight: 500 }}>{habit.name}</p>
                  <p style={{ fontSize: 32, margin: '-20px 0 10px 0', fontWeight: 500 }}>{habit.goal} {habit.goalValue} per {habit.goalInterval}</p>
                  <div style={{ height: 150, width: 150, backgroundColor: 'white', borderRadius: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: 32 }} onClick={() => setShowHabitInputModal(true)}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{habit?.currentValue}</p>
                    <p style={{ margin: '-15px 0 0 0', fontWeight: 'bold' }}>{habit.goalValue}</p>
                  </div>
                </div>
              ))}
              <div onClick={() => setShowNewHabitModal(true)} style={{ width: 350, height: 350, backgroundColor: '#ececec', borderRadius: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginRight: 'auto' }}>
                <p style={{ fontSize: 48, color: 'black' }}>+<br />Add New</p>
              </div>
            </div>
            <button style={{ marginTop: 25 }} onClick={signOut}>Sign out</button>
          </div>
          <EmojiPicker style={{ position: 'absolute', top: '30%', left: '50%', zIndex: 999 }} open={showEmojiPicker} onEmojiClick={(obj) => { setSelectedEmoji(obj.emoji); setShowEmojiPicker(false) }} />
          {showHabitInputModal &&
            <div style={{ height: '800px', width: '1000px', backgroundColor: '#ececec', position: 'absolute', top: '50%', left: '50%', zIndex: 998, translate: '-50% -50%', borderRadius: 40 }}>
              <Chart selectedHabit={habits.find((habit) => habit.id === selectedHabit)} />
            </div>
          }
          {showNewHabitModal &&
            <div style={{ height: '800px', width: '1000px', backgroundColor: '#ececec', position: 'absolute', top: '50%', left: '50%', zIndex: 998, translate: '-50% -50%', borderRadius: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Habit Name</label>
                <input onChange={handleHabitNameChange} />
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <label>Icon</label>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray', borderRadius: 10, height: 25, width: 50, paddingBottom: selectedEmoji.length === 0 ? 4 : 0, marginTop: 5 }}>{selectedEmoji ? selectedEmoji : '+'}</div>
                  |
                  <label>Color</label>
                  <input
                    type="color"
                    id="colorpicker"
                    value={color}
                    onChange={handleColorChange}
                    style={{
                      backgroundColor: color,
                      borderRadius: '10px',
                      height: 25,
                      width: 50,
                      marginTop: 5
                    }}
                  />
                </div>
                <label>Habit Type</label>
                <div style={{ display: 'flex' }}>
                  <input type="radio" id="buildHabit" name="type" value="build" onChange={handleHabitTypeChange} />
                  <label>Build Habit</label>
                </div>
                <div style={{ display: 'flex' }}>
                  <input type="radio" id="quitHabit" name="type" value="quit" onChange={handleHabitTypeChange} />
                  <label>Quit Habit</label>
                </div>
                <label>Goal</label>
                <input onChange={handleGoalChange} />
                <label>Goal Value</label>
                <input onChange={handleGoalValueChange} />
                <label>Goal Interval</label>
                <input onChange={handleGoalIntervalChange} />
                <label>Start Date</label>
                <input onChange={handleHabitStartDateChange} />
                <label>End Date</label>
                <input onChange={handleHabitEndDateChange} />
                <button onClick={createHabit}>Submit</button>
              </div>
            </div>
          }
        </>
      )}
    </Authenticator>
  );
}
