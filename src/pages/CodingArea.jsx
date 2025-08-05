import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '../components/CodeEditor';
import Header from '../components/Header';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import SkeletonLoader from '../components/SkeletonLoader';

// List of topics for the dropdown selector
const topics = [
  "Array", "String", "Hash Table", "Dynamic Programming", "Math", "Sorting",
  "Greedy", "Depth-First Search", "Binary Search", "Tree", "Breadth-First Search",
  "Bit Manipulation", "Two Pointers", "Prefix Sum", "Heap (Priority Queue)",
  "Simulation", "Binary Tree", "Graph", "Stack", "Counting", "Sliding Window",
  "Design", "Linked List", "Queue", "Recursion"
];


async function getAiQuestion(difficulty, language, topic) {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

  // The prompt now uses the selected topic
  const prompt = `
    Act as a technical interviewer. Provide a ${difficulty}-difficulty coding question in ${language}.
    The question MUST be about the following topic: **${topic}**.
    
    Format the response using Markdown with the following sections:
    - A title with the name of the problem.
    - An "Objective" section describing the task.
    - A "Requirements" section.
    - An "Example Usage" section with a code block showing inputs and expected outputs.
    
    Use bold formatting for key terms.
    IMPORTANT: Never include the implementation of the solution function in the 'Example Usage' section.
    Provide only the formatted question text, nothing else.
  `;

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' },
      body: JSON.stringify({ model: "mistral-tiny", messages: [{ role: "user", content: prompt }] })
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Mistral API Error:", errorData);
      throw new Error(`API request failed: ${errorData.message}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Failed to fetch from Mistral API:", error);
    throw error;
  }
}

async function evaluateSolution(question, userCode, language) {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  const prompt = `You are an extremely strict and meticulous code reviewer AI trained to fail all incorrect code.
You are analyzing a solution to the following coding challenge:
"=== START OF QUESTION ==="
${question}
"=== END OF QUESTION ==="
The user has attempted to solve this in ${language}. Here is their solution:
\`\`\`${language}
${userCode}
\`\`\`

Your job is to strictly analyze the solution based on the following:
1. **Completeness Check**: Does the solution satisfy all functional requirements and edge cases implied or stated in the question?
2. **Syntax & Bug Check**: Are there any syntax errors, undeclared variables, incorrect returns, or function call issues?
3. **Logical Integrity Check**: Does the algorithm logically produce the correct outputs for ALL edge cases and general inputs?

Provide a strict verdict in this exact format (no extra words):

- **Verdict:** PASS or FAIL
- **Syntax Errors:** List specific errors or "None"
- **Missing Methods:** List any missing methods or logic elements or "None"
- **Logical Flaws:** Describe exact logical flaws or "None"
- **Correction:** If verdict is FAIL, provide the corrected code block in ${language}. Otherwise, write "N/A".

Do not give benefit of doubt. Do not assume anything not in the code.`;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' },
      body: JSON.stringify({ model: "mistral-tiny", messages: [{ role: "user", content: prompt }] })
    });
    if (!response.ok) {
      const err = await response.json();
      console.error("API Error:", err);
      throw new Error(err.message);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

function CodingArea() {
  const [question, setQuestion] = useState("Select your settings, then click 'Get New Question' to start!");
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(true);
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('javascript');
  const [timerDuration, setTimerDuration] = useState(1500);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  // NEW STATE: For the selected topic
  const [topic, setTopic] = useState('Array');

  const userCodeRef = useRef(userCode);
  useEffect(() => {
    userCodeRef.current = userCode;
  }, [userCode]);

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) {
      if (timeLeft <= 0 && isTimerActive) {
        handleSubmit(true);
      }
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isTimerActive, timeLeft]);


  const handleFetchQuestion = async () => {
    if (timerDuration === 0) {
      return;
    }
    setFeedback('');
    setIsFeedbackVisible(true);
    setIsLoadingQuestion(true);
    setTimeLeft(timerDuration);
    setIsTimerActive(true);
    try {
      // Pass the selected topic to the API function
      const newQuestion = await getAiQuestion(difficulty, language, topic);
      setQuestion(newQuestion);
    } catch (error) {
      setQuestion(`Failed to fetch question. Check console.`);
      setIsTimerActive(false);
    }
    setIsLoadingQuestion(false);
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!isTimerActive && !isAutoSubmit) return;

    setIsTimerActive(false);
    setIsLoadingFeedback(true);
    setIsFeedbackVisible(true);
    try {
      const codeToSubmit = userCodeRef.current;
      const newFeedback = await evaluateSolution(question, codeToSubmit, language);
      setFeedback(newFeedback);
    } catch (error) {
      setFeedback('Failed to get feedback. Check console.');
    }
    setIsLoadingFeedback(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerPercentage = (timeLeft / timerDuration) * 100;

  return (
    <main className="bg-slate-900 text-slate-300 h-screen flex flex-col font-sans">
      <Header />
      <div className="flex-grow">
        <PanelGroup direction="horizontal" className="bg-gradient-to-br from-[#0f172a] via-[#313f57] to-[#40485c] text-slate-300 min-h-screen p-4 font-sans">

          <Panel defaultSize={33} minSize={20} className="p-1">
            <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg flex flex-col prose prose-invert prose-slate max-w-none h-full overflow-y-auto ring-1 ring-slate-700">
              <div className="flex-grow">
                {isLoadingQuestion ? (
                  <SkeletonLoader />
                ) : (
                  question === "Select your settings, then click 'Get New Question' to start!" ? (
                    <div className="flex items-center justify-center h-full">
                      <h2 className="text-2xl font-bold text-slate-500 text-center">{question}</h2>
                    </div>
                  ) : (
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{question}</ReactMarkdown>
                  )
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 space-y-4">
                {/* NEW UI: Topic Selector Dropdown */}
                <div>
                  <h3 className="text-md font-semibold mb-2 text-slate-200">Topic</h3>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isTimerActive}
                    className="w-full bg-slate-700 cursor-pointer text-white rounded-md p-2 text-sm border-none focus:ring-2 focus:ring-sky-500 outline-none disabled:opacity-50"
                  >
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold text-slate-200">Timer</h3>
                    <span className="font-mono text-lg text-sky-400">{timerDuration / 60} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    value={timerDuration / 60}
                    onChange={(e) => setTimerDuration(Number(e.target.value) * 60)}
                    disabled={isTimerActive}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  />
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-3 text-slate-200">Difficulty</h3>
                  <div className="flex gap-2">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        disabled={isTimerActive}
                        className={`
                      flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all
                      ${difficulty === level ? ' bg-[#556987] hover:bg-[#64748b] text-white shadow-md' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleFetchQuestion}
                disabled={isTimerActive || timerDuration === 0}
                className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTimerActive ? 'Interview in Progress...' : 'Get New Question'}
              </button>
            </div>
          </Panel>

          <PanelResizeHandle className="w-3 flex items-center justify-center group">
            <div className="w-1 h-10 bg-slate-700 rounded-full group-hover:bg-sky-500 transition-colors duration-200"></div>
          </PanelResizeHandle>

          <Panel defaultSize={47} minSize={30} className="p-1">
            <div className="bg-slate-800/50 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col ring-1 ring-slate-700">
              <div className="bg-slate-900/70 p-2 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <label htmlFor="language-select" className="text-sm font-medium text-slate-400">Language:</label>
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-slate-700 text-white rounded-md p-1 text-sm border-none focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                    <option value="go">Go</option>
                  </select>
                </div>
              </div>
              <div className="flex-grow overflow-hidden">
                <CodeEditor onChange={(code) => setUserCode(code)} language={language} />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-3 flex items-center justify-center group">
            <div className="w-1 h-10 bg-slate-700 rounded-full group-hover:bg-sky-500 transition-colors duration-200"></div>
          </PanelResizeHandle>

          <Panel defaultSize={20} minSize={15} collapsible={true} collapsedSize={5} onCollapse={() => setIsFeedbackVisible(false)} onExpand={() => setIsFeedbackVisible(true)}>
            <div className="bg-slate-800/50 rounded-2xl shadow-lg flex flex-col h-full p-6 ring-1 ring-slate-700">
              <div className={`flex-grow overflow-y-auto transition-opacity duration-300 ${isFeedbackVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-xl font-bold mb-4 text-slate-200">Feedback</h2>
                <div className="prose prose-invert prose-slate max-w-none">
                  {isLoadingFeedback ? (
                    <SkeletonLoader />
                  ) : (
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{feedback}</ReactMarkdown>
                  )}
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-slate-700">
                <div className="flex justify-center">
                  <div style={{ width: 120, height: 120 }}>
                    <CircularProgressbar
                      value={isTimerActive ? timerPercentage : 100}
                      text={isTimerActive ? formatTime(timeLeft) : formatTime(timerDuration)}
                      styles={buildStyles({
                        textColor: '#38bdf8',
                        pathColor: `rgba(56, 189, 248, ${timerPercentage / 100})`,
                        trailColor: '#334155',
                        strokeLinecap: 'round',
                        textSize: '24px',
                      })}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={!isTimerActive}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsFeedbackVisible(!isFeedbackVisible)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold p-2 rounded-lg flex justify-center items-center"
                  title={isFeedbackVisible ? "Hide Feedback" : "Show Feedback"}
                >
                  {isFeedbackVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                  )}
                </button>
              </div>
            </div>
          </Panel>

        </PanelGroup>
      </div>
      <footer className="text-center text-gray-400 text-sm py-4 border-t border-slate-700 bg-slate-900">
        © 2025 Leetquiz. All rights reserved.
      </footer>
    </main>
  );
}

export default CodingArea;
