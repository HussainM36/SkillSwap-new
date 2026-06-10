import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./quiz.css";

const quizQuestions = [
  {
    id: 1,
    question: "What skills can you teach others?",
    subtitle: "Select all that apply",
    options: [
      { id: "programming", label: "Programming", icon: "💻" },
      { id: "design", label: "Design", icon: "🎨" },
      { id: "photography", label: "Photography", icon: "📸" },
      { id: "music", label: "Music", icon: "🎵" },
      { id: "cooking", label: "Cooking", icon: "👨‍🍳" },
      { id: "languages", label: "Languages", icon: "🗣️" },
      { id: "writing", label: "Writing", icon: "✍️" },
      { id: "fitness", label: "Fitness", icon: "💪" },
    ],
  },
  {
    id: 2,
    question: "What skills would you like to learn?",
    subtitle: "Select all that apply",
    options: [
      { id: "programming", label: "Programming", icon: "💻" },
      { id: "design", label: "Design", icon: "🎨" },
      { id: "photography", label: "Photography", icon: "📸" },
      { id: "music", label: "Music", icon: "🎵" },
      { id: "cooking", label: "Cooking", icon: "👨‍🍳" },
      { id: "languages", label: "Languages", icon: "🗣️" },
      { id: "writing", label: "Writing", icon: "✍️" },
      { id: "fitness", label: "Fitness", icon: "💪" },
    ],
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const currentQuestion = quizQuestions[currentIndex];

  const handleSelect = (id) => {
    setAnswers((prev) => {
      const prevAnswers = prev[currentQuestion.id] || [];
      if (prevAnswers.includes(id)) {
        return { ...prev, [currentQuestion.id]: prevAnswers.filter((a) => a !== id) };
      } else {
        return { ...prev, [currentQuestion.id]: [...prevAnswers, id] };
      }
    });
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizComplete(true);
    }
  };

  return (
    <div className="quiz-container">
      {!quizComplete ? (
        <>
          <div className="quiz-header">
            <button className="btn-back" onClick={() => navigate("/dashboard")}>← Back</button>
            <h2>{currentQuestion.question}</h2>
            <p>{currentQuestion.subtitle}</p>
          </div>

          <div className="options-grid">
            {currentQuestion.options.map((opt) => {
              const selected = (answers[currentQuestion.id] || []).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  className={`option-button ${selected ? "selected" : ""}`}
                  onClick={() => handleSelect(opt.id)}
                >
                  <span className="option-icon">{opt.icon}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="quiz-navigation">
            {currentIndex > 0 && <button onClick={() => setCurrentIndex(currentIndex - 1)}>Previous</button>}
            <button onClick={handleNext}>
              {currentIndex === quizQuestions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <div className="quiz-complete">
          <h1>Quiz Complete 🎉</h1>
          <p>Great job! You can now explore matches based on your skills.</p>
          <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
