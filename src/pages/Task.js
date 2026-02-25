import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateContent } from "../services/generateContent";
import { speak, pauseSpeech } from "../utils/speak";
import { calculateTime } from "../utils/calculateTime";
import { useTimer } from "../hooks/useTimer";
import { useBackgroundSound } from "../hooks/useBackgroundSound";

const TOTAL_TASKS = 10;

export default function Task() {
  const { category, level, tutorial, task } = useParams();
  const navigate = useNavigate();

  const taskNumber = Number(task);
  const inputRef = useRef(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadedTask, setLoadedTask] = useState(null);
const [checked, setChecked] = useState(false);
const [accuracy, setAccuracy] = useState(null);

  const [results, setResults] = useState(() => {
    const saved = sessionStorage.getItem(
      `tutorial-${category}-${level}-${tutorial}`
    );
    return saved ? JSON.parse(saved) : [];
  });

const { timeLeft, start, stop, reset, isRunning } = useTimer(0);
  const changeAudio = new Audio("/audio/changeAudio.mp3");

  // 🔹 Load task (TTS FIRST → TIMER AFTER)
  useEffect(() => {
    if (loadedTask === taskNumber) return;

    async function loadTask() {
      setLoading(true);

      // stop any previous speech
      pauseSpeech();
      setIsSpeaking(false);

      const content = await generateContent(category, level, tutorial, taskNumber);
      setText(content);
      setLoadedTask(taskNumber);

      const allowedTime = calculateTime(content, level);
      reset(allowedTime);

      // 🔊 FIRST: read content
      // ⏱ THEN: start timer
      speak(
        content,
        () => {
          setIsSpeaking(false);
          start(); // ✅ timer starts AFTER TTS finishes
        },
        () => setIsSpeaking(true)
      );

      setLoading(false);
    }

    loadTask();
  },[category, level, tutorial, taskNumber, loadedTask, reset, start] );

  // Autofocus input ONLY when timer starts
  useEffect(() => {
    if (!loading && isRunning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, isRunning]);

  // Stop speech on timeout
  useEffect(() => {
    if (timeLeft === 0) {
      pauseSpeech();
      setIsSpeaking(false);
    }
  }, [timeLeft]);

  useBackgroundSound(timeLeft, isRunning);

function handleExitTutorial() {
  // stop speech immediately
  pauseSpeech();
  setIsSpeaking(false);

  // clear tutorial progress
  sessionStorage.removeItem(
    `tutorial-${category}-${level}-${tutorial}`
  );

  // exit tutorial flow (choose your route)
  navigate(`/tutorials/${category}/${level}`);
}

  function countCorrectCharacters(correct, typed) {
    let count = 0;
    for (let i = 0; i < Math.min(correct.length, typed.length); i++) {
      if (correct[i] === typed[i]) count++;
    }
    return count;
  }

function handleCheckAnswer() {
  const correctChars = countCorrectCharacters(text, input);
  const totalChars = text.length;

  const percent = Math.round((correctChars / totalChars) * 100);

  setAccuracy(percent);
  setChecked(true);

  // 🔴 STOP TIMER HERE
  stop();

  // stop speech
  pauseSpeech();
  setIsSpeaking(false);
}

  function handleNext() {
    changeAudio.currentTime = 0;
    changeAudio.play().catch(() => {});

    const updatedResults = [
      ...results,
      {
        taskNumber,
        correctText: text,
        userText: input,
        totalCharacters: text.length,
        correctCharacters: countCorrectCharacters(text, input),
      },
    ];

    sessionStorage.setItem(
      `tutorial-${category}-${level}-${tutorial}`,
      JSON.stringify(updatedResults)
    );

    setResults(updatedResults);
    setInput("");
    setLoadedTask(null);
setChecked(false);
setAccuracy(null);

    if (taskNumber < TOTAL_TASKS) {
      navigate(`/task/${category}/${level}/${tutorial}/${taskNumber + 1}`);
    } else {
      navigate(`/result/${category}/${level}/${tutorial}`, {
        state: { results: updatedResults },
      });
    }
  }

  if (loading) return <p>Loading task…</p>;

  return (
    <main>
<button
  onClick={handleExitTutorial}
  aria-label="Exit tutorial"
>
 Exit Tutorial
</button>

      <h2>
        Tutorial {tutorial} — Task {taskNumber} of {TOTAL_TASKS}
      </h2>

      <p>Time remaining: {timeLeft} seconds</p>

      {/* ▶️ Play always reads from beginning */}
      <button
        onClick={() => {
          if (isSpeaking) {
            pauseSpeech();
            setIsSpeaking(false);
          } else {
            pauseSpeech();
            speak(
              text,
              () => setIsSpeaking(false),
              () => setIsSpeaking(true)
            );
          }
        }}
        disabled={timeLeft === 0}
      >
        {isSpeaking ? "Pause" : "Play"}
      </button>

<div
  aria-label="Typing content"
  className="typing-content"
>
  {text}
</div>

<textarea
  ref={inputRef}
  value={input}
  onChange={(e) => setInput(e.target.value)}
  disabled={!isRunning || timeLeft === 0 || checked}

  /* ❌ Disable paste (Ctrl+V, Cmd+V, right-click paste) */
  onPaste={(e) => {
    e.preventDefault();
  }}

  /* ❌ Disable drag & drop text */
  onDrop={(e) => {
    e.preventDefault();
  }}

  onKeyDown={(e) => {
    /* ❌ Block Ctrl+V / Cmd+V */
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "v"
    ) {
      e.preventDefault();
      return;
    }

    /* ✅ Ctrl+Enter → Next task */
    if (
      e.ctrlKey &&
      e.key === "Enter" &&
      isRunning &&
      timeLeft > 0
    ) {
      e.preventDefault();
      handleNext();
    }
  }}

  aria-label="Type the content manually, Paste is disabled."
/>
<button
  onClick={handleCheckAnswer}
  disabled={!isRunning || checked}
>
  Check Answer
</button>

{checked && (
  <p aria-live="polite">
    Accuracy: {accuracy}%
  </p>
)}

      <button onClick={handleNext} disabled={!checked}>
        {taskNumber < TOTAL_TASKS ? "Next Task" : "Finish Tutorial"}
      </button>
    </main>
  );
}
