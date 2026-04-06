import { useState, useRef, useEffect } from 'react';

export default function PracticeEngine({ practiceQuestions, onPracticeComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHints, setShowHints] = useState({});
  const [feedback, setFeedback] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const inputRefs = useRef([]);

  const questions = practiceQuestions || [];

  useEffect(() => {
    // Focus first input when question changes
    if (inputRefs.current[currentQuestion]) {
      inputRefs.current[currentQuestion].focus();
    }
  }, [currentQuestion]);

  const handleInputChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleKeyPress = (e, questionIndex) => {
    if (e.key === 'Enter') {
      checkAnswer(questionIndex);
    }
  };

  const checkAnswer = (questionIndex) => {
    const question = questions[questionIndex];
    const userAnswer = answers[questionIndex]?.trim().toLowerCase();
    const correctAnswer = question.answer.toLowerCase();

    const isCorrect = userAnswer === correctAnswer;

    setFeedback(prev => ({
      ...prev,
      [questionIndex]: {
        isCorrect,
        userAnswer: answers[questionIndex],
        correctAnswer: question.answer,
        explanation: question.explanation
      }
    }));

    if (isCorrect) {
      setCompletedQuestions(prev => new Set([...prev, questionIndex]));

      // Auto-move to next question after 2 seconds
      setTimeout(() => {
        if (questionIndex < questions.length - 1) {
          setCurrentQuestion(questionIndex + 1);
        } else {
          // All questions completed
          onPracticeComplete && onPracticeComplete();
        }
      }, 2000);
    }
  };

  const showHint = (questionIndex) => {
    setShowHints(prev => ({
      ...prev,
      [questionIndex]: true
    }));
  };

  const resetQuestion = (questionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: ''
    }));
    setFeedback(prev => ({
      ...prev,
      [questionIndex]: null
    }));
    setShowHints(prev => ({
      ...prev,
      [questionIndex]: false
    }));
  };

  const handleDragStart = (e, item, questionIndex) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, questionIndex }));
  };

  const handleDrop = (e, questionIndex) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));

    if (data.questionIndex === questionIndex) {
      setAnswers(prev => ({
        ...prev,
        [questionIndex]: data.item
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderQuestion = (question, index) => {
    const isActive = index === currentQuestion;
    const isCompleted = completedQuestions.has(index);
    const userFeedback = feedback[index];
    const hasHint = showHints[index];

    if (question.type === 'fill_blank') {
      return (
        <div key={index} className={`p-6 rounded-xl border-2 transition-all duration-300 ${
          isActive ? 'border-blue-500 bg-blue-50 shadow-lg' :
          isCompleted ? 'border-green-500 bg-green-50' :
          'border-gray-200 bg-white'
        }`}>

          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isCompleted ? 'bg-green-500 text-white' :
              isActive ? 'bg-blue-500 text-white' :
              'bg-gray-300 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <span className="text-sm text-gray-600">
              {isCompleted ? '✅ Completed' : isActive ? '🔄 Active' : '⏳ Pending'}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-gray-800 text-lg leading-relaxed">{question.prompt}</p>
          </div>

          {question.words && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Available words:</p>
              <div className="flex flex-wrap gap-2">
                {question.words.map((word, wordIndex) => (
                  <div
                    key={wordIndex}
                    draggable
                    onDragStart={(e) => handleDragStart(e, word, index)}
                    className="px-3 py-1 bg-white border border-gray-300 rounded cursor-move hover:bg-blue-50 transition"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-4">
            {question.words ? (
              <div
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                className={`flex-1 min-h-12 p-3 border-2 border-dashed rounded-lg transition-colors ${
                  answers[index] ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {answers[index] ? (
                  <span className="text-lg font-medium text-green-600">{answers[index]}</span>
                ) : (
                  <span className="text-gray-400">Drop a word here...</span>
                )}
              </div>
            ) : (
              <input
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={answers[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                disabled={!isActive || userFeedback?.isCorrect}
                className={`flex-1 p-3 border-2 rounded-lg text-lg transition-colors ${
                  userFeedback?.isCorrect ? 'border-green-500 bg-green-50' :
                  userFeedback && !userFeedback.isCorrect ? 'border-red-500 bg-red-50' :
                  'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
                placeholder="Type your answer..."
              />
            )}

            {isActive && !userFeedback?.isCorrect && (
              <button
                onClick={() => checkAnswer(index)}
                disabled={!answers[index]?.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Check
              </button>
            )}
          </div>

          {hasHint && question.hint && (
            <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>💡 Hint:</strong> {question.hint}
              </p>
            </div>
          )}

          {userFeedback && (
            <div className={`p-4 rounded-lg border-l-4 ${
              userFeedback.isCorrect
                ? 'bg-green-50 border-green-400'
                : 'bg-red-50 border-red-400'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={userFeedback.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {userFeedback.isCorrect ? '✅ Correct!' : '❌ Not quite right'}
                </span>
              </div>

              {!userFeedback.isCorrect && (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Your answer:</strong> {userFeedback.userAnswer}
                  </p>
                  <p className="text-gray-700">
                    <strong>Correct answer:</strong> {userFeedback.correctAnswer}
                  </p>
                  <p className="text-gray-700">
                    <strong>Why?</strong> {userFeedback.explanation}
                  </p>
                </div>
              )}

              {userFeedback.isCorrect && (
                <p className="text-green-700 font-medium">
                  Great job! Moving to next question...
                </p>
              )}
            </div>
          )}

          {!isActive && !isCompleted && (
            <button
              onClick={() => setCurrentQuestion(index)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Start This Question
            </button>
          )}

          {(userFeedback && !userFeedback.isCorrect) && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => showHint(index)}
                disabled={hasHint}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition"
              >
                {hasHint ? 'Hint Shown' : 'Show Hint'}
              </button>
              <button
                onClick={() => resetQuestion(index)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const progressPercentage = (completedQuestions.size / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎯 Practice Time</h2>
        <p className="text-gray-600">Let's practice what we've learned. Take your time and learn from each question.</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Your Progress</h3>
          <span className="text-sm text-gray-600">
            {completedQuestions.size} of {questions.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => renderQuestion(question, index))}
      </div>

      {completedQuestions.size === questions.length && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Excellent Work!</h3>
          <p className="text-gray-600 mb-4">
            You've completed all practice questions. You're ready to move to the quiz!
          </p>
          <button
            onClick={onPracticeComplete}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Take Quiz Now
          </button>
        </div>
      )}
    </div>
  );
}