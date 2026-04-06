import { useState, useEffect } from 'react';

export default function QuizEngine({ quizQuestions, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Shuffle questions on mount
  useEffect(() => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, [quizQuestions]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted, showResults]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(300);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setQuizStarted(false);
  };

  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const weakAreas = [];
    const mistakes = [];

    shuffledQuestions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correct;

      if (userAnswer === undefined) {
        unanswered++;
        weakAreas.push(question.topic || 'General');
      } else if (userAnswer === correctAnswer) {
        correct++;
      } else {
        incorrect++;
        weakAreas.push(question.topic || 'General');
        mistakes.push({
          question: question.question,
          userAnswer: question.options[userAnswer],
          correctAnswer: question.options[correctAnswer],
          explanation: question.explanation
        });
      }
    });

    const score = Math.round((correct / shuffledQuestions.length) * 100);
    const uniqueWeakAreas = [...new Set(weakAreas)];

    return {
      correct,
      incorrect,
      unanswered,
      score,
      weakAreas: uniqueWeakAreas,
      mistakes,
      total: shuffledQuestions.length
    };
  };

  const getPerformanceMessage = (score) => {
    if (score >= 90) return { message: "Outstanding! You're a grammar master!", emoji: "🏆", color: "text-green-600" };
    if (score >= 80) return { message: "Excellent work! Keep practicing to reach perfection.", emoji: "🌟", color: "text-blue-600" };
    if (score >= 70) return { message: "Good job! Focus on the areas you missed.", emoji: "👍", color: "text-yellow-600" };
    if (score >= 60) return { message: "Not bad! Review the rules and try again.", emoji: "📚", color: "text-orange-600" };
    return { message: "Keep studying! Practice makes perfect.", emoji: "💪", color: "text-red-600" };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted && !showResults) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🧠</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready for the Quiz?</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Test your understanding with {shuffledQuestions.length} random questions.
          You have 5 minutes to complete the quiz.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm mx-auto mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Quiz Rules:</h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li>• Answer all questions to get full score</li>
            <li>• You can go back to previous questions</li>
            <li>• Time limit: 5 minutes</li>
            <li>• No negative marking</li>
          </ul>
        </div>

        <button
          onClick={startQuiz}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg shadow-lg"
        >
          Start Quiz 🚀
        </button>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    const performance = getPerformanceMessage(results.score);

    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h2 className={`text-3xl font-bold mb-2 ${performance.color}`}>
            {performance.message}
          </h2>
          <p className="text-gray-600">Your Score: {results.score}%</p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">{results.correct}</div>
            <div className="text-sm text-green-700">Correct</div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600">{results.incorrect}</div>
            <div className="text-sm text-red-700">Incorrect</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{results.unanswered}</div>
            <div className="text-sm text-yellow-700">Unanswered</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{results.score}%</div>
            <div className="text-sm text-blue-700">Score</div>
          </div>
        </div>

        {/* Weak Areas */}
        {results.weakAreas.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🎯</span>
              Areas to Focus On
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.weakAreas.map((area, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {area}
                </span>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">Teacher's Recommendation:</h4>
              <p className="text-blue-700 text-sm">
                Review the rules for these topics and practice more examples.
                Consider going back to the Rules section for a quick refresher.
              </p>
            </div>
          </div>
        )}

        {/* Mistakes Review */}
        {results.mistakes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📝</span>
              Review Your Mistakes
            </h3>
            <div className="space-y-4">
              {results.mistakes.slice(0, 3).map((mistake, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <p className="font-medium text-gray-800 mb-2">{mistake.question}</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Your answer:</strong> <span className="text-red-600">{mistake.userAnswer}</span></p>
                    <p><strong>Correct answer:</strong> <span className="text-green-600">{mistake.correctAnswer}</span></p>
                    <p><strong>Why?</strong> {mistake.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => onQuizComplete && onQuizComplete(results)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const currentQ = shuffledQuestions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quiz in Progress</h2>
          <p className="text-gray-600">Question {currentQuestion + 1} of {shuffledQuestions.length}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-mono font-bold text-red-600">{formatTime(timeLeft)}</div>
          <div className="text-sm text-gray-500">Time Remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQ.question}</h3>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <label key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={index}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswerSelect(currentQuestion, index)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          ← Previous
        </button>

        <div className="flex gap-2">
          {shuffledQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentQuestion ? 'bg-blue-600' :
                answers[index] !== undefined ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {currentQuestion === shuffledQuestions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}