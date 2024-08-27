import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import EmojiPicker from 'emoji-picker-react';
import ReactEcharts from "echarts-for-react";
import Chart from "./components/chart";
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();


export default function History() {
    const [habits, setHabits] = useState<Array<Schema["Habit"]["type"]>>([]);
    const [habitId, setHabitId] = useState('');

    function listTodos() {
        client.models.Habit.observeQuery().subscribe({
          next: (data) => setHabits([...data.items]),
        });
      }

      useEffect(() => {
        listTodos();
      }, []);

      console.log('habits on history', habits[0].completionHistoryLogs);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setHabitId(window.location.href.split('?')[1])
        }
    }, []);

    const daysInMonth = (month: any, year: any) => new Date(year, month, 0).getDate();

    const getDaysInCurrentMonth = () => {
        const date = new Date();
        const month = date.getMonth() + 1; // Months are 0-based, so add 1const year = date.getFullYear();
        const year = date.getFullYear();
        return daysInMonth(month, year);
    };

    console.log("Number of days in the current month is " + getDaysInCurrentMonth());

    let arr = Array.from(Array(getDaysInCurrentMonth()));

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', height: '100%', padding: 100, gap: 20 }}>
            {
                arr.map((i, index) => (
                    <div style={{ borderRadius: '100%', height: 100, width: 100, backgroundColor: 'black' }}></div>
                ))
            }
        </div>

    )
}
