import React, { useState, useEffect } from 'react';
import './FocusTimerWidget.css';

const FocusTimerWidget = () => {
    const focusDuration = 25; // Focus time in seconds
    const breakDuration = 5; // Break time in seconds
    const [timeLeft, setTimeLeft] = useState(focusDuration);
    const [isFocusSession, setIsFocusSession] = useState(true);
    const [focusPasses, setFocusPasses] = useState(0);
    const [focusHistory, setFocusHistory] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(timer);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isFocusSession]);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (isFocusSession) {
                const newFocusPass = {
                    timestamp: new Date().toLocaleString(),
                    title: document.title,
                    passNumber: focusPasses + 1,
                };
                setFocusHistory([...focusHistory, newFocusPass]);
                setFocusPasses(focusPasses + 1);
                alert(`Great job! You've completed ${focusPasses + 1} focus sessions.`);
            }
            setIsFocusSession(!isFocusSession);
            setTimeLeft(isFocusSession ? breakDuration : focusDuration);
        }
    }, [timeLeft, isFocusSession, focusPasses, focusHistory]);

    const handleVisibilityChange = () => {
        if (document.hidden && isFocusSession) {
            alert('Fail to focus! You switched tabs. Pomodoro Counter starts from 25 again');
            setTimeLeft(focusDuration);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const generateShareableLink = () => {
        const historyString = `Productivity History for Today!\n\n${focusHistory.map(fh => `Session ${fh.passNumber} on ${fh.timestamp} - ${fh.title}`).join('\n')}`;
        const blob = new Blob([historyString], { type: 'text/plain' });
        return URL.createObjectURL(blob);
    };

    return (
        <div className={`focus-timer-widget ${isFocusSession ? 'focus-mode' : 'break-mode'}`}>
            <h1 className="title">POMODORO COUNTER WIDGET</h1>
            <h2>{isFocusSession ? 'Focus' : 'Break'} Time</h2>
            <p>{formatTime(timeLeft)}</p>
            {isFocusSession ? (
                <p className="warning">Don't change the tab or else you lose focus!</p>
            ) : (
                <button onClick={() => window.open(generateShareableLink())}>Share Progress</button>
            )}
        </div>
    );
};

export default FocusTimerWidget;
