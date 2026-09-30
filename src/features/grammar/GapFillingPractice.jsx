import { useEffect, useRef, useState } from 'react';
import { getRandomExercise } from '../../data/gapFillingExercises';

const correctSoundUrl = 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3';
const incorrectSoundUrl = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

function playFeedback(type) {
  try {
    const audio = new Audio(type === 'correct' ? correctSoundUrl : incorrectSoundUrl);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {
    // Continue without sound when audio playback is unavailable.
  }
}

function matchesAnswer(gap, answer) {
  const normalizedAnswer = answer.trim().toLowerCase();
  const acceptedAnswers = [gap.answer, ...(gap.acceptableAnswers || [])];
  return acceptedAnswers.some((accepted) => accepted.trim().toLowerCase() === normalizedAnswer);
}

export default function GapFillingPractice({ exercises = [] }) {
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const selectedExercise = exercises.find((exercise) => exercise.id === selectedExerciseId);

  if (!selectedExercise) {
    return (
      <section className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100">
                <th scope="col" className="w-16 border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800">No.</th>
                <th scope="col" className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800">Exercise</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((exercise, index) => (
                <tr key={exercise.id} className="bg-white">
                  <td className="border-b border-gray-200 px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                  <td className="border-b border-gray-200 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedExerciseId(exercise.id)}
                      className="text-left font-medium text-blue-700 hover:underline"
                    >
                      {exercise.title}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <GapFillingExercise
      key={selectedExercise.id}
      exercise={selectedExercise}
      mode="practice"
      onBack={() => setSelectedExerciseId(null)}
    />
  );
}

export function GapFillingQuiz({ exercises = [] }) {
  const [attempt, setAttempt] = useState(() => ({ exercise: getRandomExercise(exercises), key: 0 }));

  if (!attempt.exercise) {
    return <p className="py-8 text-gray-600">No gap-filling exercises are available for the quiz.</p>;
  }

  const resetQuiz = () => {
    setAttempt((current) => ({
      exercise: getRandomExercise(exercises, current.exercise?.id),
      key: current.key + 1,
    }));
  };

  return (
    <GapFillingExercise
      key={`quiz-${attempt.key}`}
      exercise={attempt.exercise}
      mode="quiz"
      onResetQuiz={resetQuiz}
    />
  );
}

function GapFillingExercise({ exercise, mode = 'practice', onBack, onResetQuiz }) {
  const gaps = exercise.gaps || [];
  const [answers, setAnswers] = useState({});
  const [mistakes, setMistakes] = useState({});
  const [statuses, setStatuses] = useState({});
  const [shownClues, setShownClues] = useState({});
  const [clueHistoryByGap, setClueHistoryByGap] = useState({});
  const [feedbackByGap, setFeedbackByGap] = useState({});
  const [activeGapId, setActiveGapId] = useState(gaps[0]?.id ?? null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [answersShown, setAnswersShown] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [moreExpanded, setMoreExpanded] = useState(false);
  const [expandedAnswerDetails, setExpandedAnswerDetails] = useState({});
  const timerRef = useRef(null);
  const lastWordTouchRef = useRef({ word: null, time: 0 });
  const gapTouchRef = useRef({ gapId: null, time: 0 });
  const segments = (exercise.passage || '').split(/(\{\{[^}]+\}\})/g);
  const activeGap = gaps.find((gap) => gap.id === activeGapId) || null;
  const completedCount = gaps.filter((gap) => ['correct', 'revealed', 'shown'].includes(statuses[gap.id])).length;
  const isComplete = gaps.length > 0 && completedCount === gaps.length;

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const updateAnswer = (gap, value) => {
    if (feedback || isProcessing || answersShown || gap.id !== activeGapId || ['correct', 'revealed', 'shown'].includes(statuses[gap.id])) return;
    setAnswers((current) => ({ ...current, [gap.id]: value }));
  };

  const placeBankWord = (word) => {
    if (activeGap) updateAnswer(activeGap, word);
  };

  const handleDragStart = (event, word) => {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', word);
  };

  const handleDrop = (event, gap) => {
    event.preventDefault();
    updateAnswer(gap, event.dataTransfer.getData('text/plain'));
  };

  const submitActiveGap = () => {
    if (!activeGap || feedback || isProcessing || answersShown || !answers[activeGap.id]?.trim()) return;

    setIsProcessing(true);
    timerRef.current = window.setTimeout(() => {
      if (matchesAnswer(activeGap, answers[activeGap.id] || '')) {
        setStatuses((current) => ({ ...current, [activeGap.id]: 'correct' }));
        setShownClues((current) => ({ ...current, [activeGap.id]: null }));
        const result = {
          gapId: activeGap.id,
          kind: 'correct',
          message: exercise.feedbackMessagesBn?.correct || 'Congratulations! Your answer is correct.',
          sentence: activeGap.sentence,
          clues: clueHistoryByGap[activeGap.id] || [],
          explanation: activeGap.explanationBn || activeGap.explanation,
          moreExplanation: activeGap.moreExplanationBn || activeGap.moreExplanation,
          advances: true,
        };
        setFeedbackByGap((current) => ({ ...current, [activeGap.id]: result }));
        setFeedback(result);
        setMoreExpanded(false);
        playFeedback('correct');
        setIsProcessing(false);
        return;
      }

      const mistakeCount = (mistakes[activeGap.id] || 0) + 1;
      setMistakes((current) => ({ ...current, [activeGap.id]: mistakeCount }));
      playFeedback('incorrect');

      if (mistakeCount >= 4) {
        setAnswers((current) => ({ ...current, [activeGap.id]: activeGap.answer }));
        setStatuses((current) => ({ ...current, [activeGap.id]: 'revealed' }));
        const result = {
          gapId: activeGap.id,
          kind: 'revealed',
          message: exercise.feedbackMessagesBn?.revealed || 'চারবার ভুল চেষ্টার পর সঠিক উত্তরটি দেখানো হলো।',
          answer: activeGap.answer,
          sentence: activeGap.sentence,
          clues: clueHistoryByGap[activeGap.id] || [],
          explanation: activeGap.explanationBn || activeGap.explanation,
          moreExplanation: activeGap.moreExplanationBn || activeGap.moreExplanation,
          advances: true,
        };
        setFeedbackByGap((current) => ({ ...current, [activeGap.id]: result }));
        setFeedback(result);
        setMoreExpanded(false);
        setIsProcessing(false);
        return;
      }

      const clueField = ['firstMistakeBn', 'secondMistakeBn', 'thirdMistakeBn'][mistakeCount - 1];
      const clue = activeGap.clues?.[clueField] || activeGap.clues?.secondMistakeBn || activeGap.clues?.firstMistakeBn || '';
      const clueHistory = [...(clueHistoryByGap[activeGap.id] || []), clue].filter(Boolean);
      setClueHistoryByGap((current) => ({ ...current, [activeGap.id]: clueHistory }));
      setStatuses((current) => ({ ...current, [activeGap.id]: 'incorrect' }));
      const result = {
        gapId: activeGap.id,
        kind: 'incorrect',
        message: exercise.feedbackMessagesBn?.incorrect || 'উত্তরটি সঠিক নয়। আবার চেষ্টা করো।',
        clue,
        clues: clueHistory,
        sentence: activeGap.sentence,
      };
      setFeedbackByGap((current) => ({ ...current, [activeGap.id]: result }));
      setFeedback(result);
      setMoreExpanded(false);
      setIsProcessing(false);
    }, 220);
  };

  const showAllAnswers = () => {
    if (isProcessing || feedback) return;
    window.clearTimeout(timerRef.current);
    setAnswers(Object.fromEntries(gaps.map((gap) => [gap.id, gap.answer])));
    setStatuses(Object.fromEntries(gaps.map((gap) => [gap.id, 'shown'])));
    setMistakes({});
    setShownClues({});
    setClueHistoryByGap({});
    setFeedbackByGap(Object.fromEntries(gaps.map((gap) => [gap.id, {
      gapId: gap.id,
      kind: 'shown',
      answer: gap.answer,
      sentence: gap.sentence,
      clues: [],
      explanation: gap.explanationBn || gap.explanation,
      moreExplanation: gap.moreExplanationBn || gap.moreExplanation,
      advances: false,
    }])));
    setActiveGapId(null);
    setAnswersShown(true);
    setExpandedAnswerDetails({});
  };

  const reviewGapFeedback = (gap) => {
    const storedFeedback = feedbackByGap[gap.id];
    if (!storedFeedback || feedback || isProcessing) return;
    setFeedback({ ...storedFeedback, reviewOnly: true, advances: false });
    setMoreExpanded(false);
  };

  const closeFeedback = () => {
    if (!feedback) return;
    const closedFeedback = feedback;
    setFeedback(null);
    setMoreExpanded(false);

    if (!closedFeedback.reviewOnly && closedFeedback.advances) {
      const nextGap = gaps.find((gap) => !['correct', 'revealed', 'shown'].includes(statuses[gap.id]));
      setActiveGapId(nextGap?.id ?? null);
    } else if (!closedFeedback.reviewOnly) {
      setActiveGapId(closedFeedback.gapId);
    }
  };

  const reset = () => {
    window.clearTimeout(timerRef.current);
    setAnswers({});
    setMistakes({});
    setStatuses({});
    setShownClues({});
    setClueHistoryByGap({});
    setFeedbackByGap({});
    setExpandedAnswerDetails({});
    setActiveGapId(gaps[0]?.id ?? null);
    setIsProcessing(false);
    setAnswersShown(false);
    setFeedback(null);
    setMoreExpanded(false);
  };

  return (
    <section className="space-y-5">
      <button
        type="button"
        onClick={onBack}
      >
        Back
      </button>
      <article className="relative isolate space-y-5 rounded-xl border border-gray-200 bg-white p-5">
        <div className={feedback ? 'pointer-events-none space-y-5 opacity-30' : 'space-y-5'}>
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold text-gray-900">{exercise.title}</h2>
            {exercise.marks !== undefined && <span className="text-sm font-medium text-gray-600">{exercise.marks} Marks</span>}
          </header>
          {exercise.instruction && <p className="text-sm text-gray-700">{exercise.instruction}</p>}

          <div>
            <h3 className="mb-2 font-semibold text-gray-900">Word Bank</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-max border-collapse text-center">
                <tbody>
                  <tr>
                    {(exercise.wordBank || []).map((word, index) => (
                      <td key={`${word}-${index}`} className="border-r border-gray-200 p-2 last:border-r-0">
                        <button
                          type="button"
                          draggable={!feedback && !answersShown && !isProcessing}
                          disabled={Boolean(feedback) || answersShown || isProcessing || !activeGap}
                          onDragStart={(event) => handleDragStart(event, word)}
                          onDoubleClick={() => placeBankWord(word)}
                          onTouchEnd={(event) => {
                            const now = Date.now();
                            const previousTap = lastWordTouchRef.current;
                            if (previousTap.word === word && now - previousTap.time < 350) {
                              event.preventDefault();
                              placeBankWord(word);
                              lastWordTouchRef.current = { word: null, time: 0 };
                            } else {
                              lastWordTouchRef.current = { word, time: now };
                            }
                          }}
                          className="min-h-10 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {word}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-base leading-relaxed text-gray-800" aria-label="Gap filling passage">
            {segments.map((segment, index) => {
              const match = segment.match(/^\{\{([^}]+)\}\}$/);
              const gap = match && gaps.find((item) => item.id === match[1]);
              if (!gap) return <span key={index}>{segment}</span>;

              const status = statuses[gap.id];
              const isActive = activeGap?.id === gap.id && !isComplete && !answersShown;
              const isLocked = ['correct', 'revealed', 'shown'].includes(status);
              const isReviewable = Boolean(feedbackByGap[gap.id]);
              const fieldClass = isActive
                ? status === 'incorrect'
                  ? 'border-red-500 bg-red-50 border-dashed'
                  : 'border-blue-600 bg-blue-50 border-dashed'
                : isLocked
                  ? 'border-green-500 bg-green-50 border-solid ring-1 ring-green-200'
                  : isReviewable
                    ? 'border-gray-400 bg-gray-50 border-solid ring-1 ring-gray-200'
                  : 'border-gray-300 bg-white border-solid';
              const answerLength = (answers[gap.id] || '').length;
              const inputWidth = `${Math.max(7, answerLength + 3)}ch`;

              return (
                <span
                  key={gap.id}
                  className={`relative inline-flex align-middle px-1 ${isReviewable && !isActive ? 'cursor-pointer' : ''}`}
                  title={isReviewable && !isActive ? 'Double-click to review feedback' : undefined}
                  onDoubleClick={() => !isActive && reviewGapFeedback(gap)}
                  onTouchEnd={() => {
                    const now = Date.now();
                    const previousTap = gapTouchRef.current;
                    if (previousTap.gapId === gap.id && now - previousTap.time < 350) {
                      if (!isActive && isReviewable) reviewGapFeedback(gap);
                      gapTouchRef.current = { gapId: null, time: 0 };
                    } else {
                      gapTouchRef.current = { gapId: gap.id, time: now };
                    }
                  }}
                >
                  <span className="inline-flex items-center">
                    <span className="font-medium">({gap.label || gap.id})</span>
                    <input
                      type="text"
                      aria-label={`Gap ${gap.label || gap.id}`}
                      placeholder="______"
                      value={answers[gap.id] || ''}
                      disabled={isLocked || Boolean(feedback) || isProcessing || answersShown || gap.id !== activeGapId}
                      onChange={(event) => updateAnswer(gap, event.target.value)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => handleDrop(event, gap)}
                      style={{ width: inputWidth, maxWidth: '60vw' }}
                      className={`box-border min-w-[7ch] rounded-md border-2 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:text-gray-800 ${fieldClass}`}
                    />
                  </span>
                  {isActive && !feedback && !isProcessing && answers[gap.id]?.trim() && (
                    <button
                      type="button"
                      onClick={submitActiveGap}
                      aria-label={`Submit gap ${gap.label || gap.id} and continue`}
                      className="absolute left-full top-1/2 z-10 ml-1 -translate-y-1/2 animate-bounce whitespace-nowrap rounded px-2 py-1 text-sm font-semibold text-blue-700"
                    >
                      Next →
                    </button>
                  )}
                </span>
              );
            })}
          </div>

          {activeGap && statuses[activeGap.id] === 'incorrect' && shownClues[activeGap.id] && (
            <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-900">
              💡 {shownClues[activeGap.id]}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={submitActiveGap}
              disabled={!activeGap || !answers[activeGap.id]?.trim() || isProcessing || Boolean(feedback) || answersShown}
              className={`min-h-11 rounded-lg px-5 py-2 font-medium transition ${activeGap && answers[activeGap.id]?.trim() && !isProcessing && !feedback && !answersShown ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}
            >
              Submit Answer
            </button>
            <button
              type="button"
              onClick={showAllAnswers}
              disabled={isProcessing || Boolean(feedback) || answersShown}
              className="min-h-11 rounded-lg bg-amber-600 px-5 py-2 font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              Show Answer
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={Boolean(feedback)}
              className="min-h-11 rounded-lg bg-gray-600 px-5 py-2 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset
            </button>
          </div>

          {shownClues[activeGap?.id] && statuses[activeGap?.id] === 'incorrect' && (
            <p className="text-sm text-gray-600">ভুল উত্তরের সংখ্যা: {mistakes[activeGap.id]} / 4</p>
          )}

          {answersShown && (
            <section className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4" aria-label="Reference answers">
              <h3 className="font-semibold text-blue-900">{exercise.feedbackMessagesBn?.answersShown || 'সব সঠিক উত্তর দেখানো হয়েছে।'}</h3>
              {gaps.map((gap) => (
                <div key={gap.id} className="text-sm text-blue-900">
                  <p className="font-semibold">({gap.label || gap.id}) {gap.answer}</p>
                  <p>{gap.explanationBn || gap.explanation}</p>
                  {gap.moreExplanationBn && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedAnswerDetails((current) => ({ ...current, [gap.id]: !current[gap.id] }))}
                        aria-expanded={Boolean(expandedAnswerDetails[gap.id])}
                        className="mt-1 font-medium text-blue-700 underline"
                      >
                        More {expandedAnswerDetails[gap.id] ? '▴' : '▾'}
                      </button>
                      {expandedAnswerDetails[gap.id] && <p className="mt-1">{gap.moreExplanationBn}</p>}
                    </>
                  )}
                </div>
              ))}
            </section>
          )}

          {isComplete && !answersShown && (
            <p role="status" className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-900">
              {exercise.feedbackMessagesBn?.complete || 'সব শূন্যস্থান সম্পন্ন হয়েছে। দারুণ কাজ!'}
            </p>
          )}
        </div>

        {feedback && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-gray-900/25 p-4 backdrop-blur-[2px]">
            <section role="dialog" aria-modal="true" aria-label="Answer feedback" className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeFeedback}
                  aria-label="Close feedback"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-2xl leading-none text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                {feedback.kind === 'correct' ? (
                  <>
                    <h3 className="text-lg font-bold text-green-800">🎉 {feedback.message}</h3>
                  </>
                ) : feedback.kind === 'incorrect' ? (
                  <>
                    <h3 className="text-lg font-bold text-red-800">{feedback.message}</h3>
                    {feedback.clue && (
                      <p className="rounded-lg bg-yellow-50 p-3 text-yellow-900">💡 {feedback.clue}</p>
                    )}
                  </>
                ) : (
                  <h3 className="text-lg font-bold text-blue-800">{feedback.message}</h3>
                )}
                {feedback.answer && <p className="font-semibold text-blue-900">({gaps.find((gap) => gap.id === feedback.gapId)?.label || feedback.gapId}) {feedback.answer}</p>}
                {feedback.sentence && <p className="rounded bg-gray-50 p-3 text-sm leading-relaxed text-gray-800">{feedback.sentence}</p>}
                {feedback.kind !== 'incorrect' && feedback.clues?.length > 0 && (
                  <div className="space-y-1 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900">
                    <p className="font-semibold">Clues used</p>
                    {feedback.clues.map((clue, index) => <p key={`${feedback.gapId}-clue-${index}`}>💡 {clue}</p>)}
                  </div>
                )}
                {feedback.explanation && (
                  <div className="space-y-1 text-gray-800">
                    <p className="font-semibold">কেন?</p>
                    <p className="leading-relaxed">{feedback.explanation}</p>
                  </div>
                )}
                {feedback.moreExplanation && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setMoreExpanded((current) => !current)}
                      aria-expanded={moreExpanded}
                      className="font-medium text-blue-700 underline"
                    >
                      More {moreExpanded ? '▴' : '▾'}
                    </button>
                    {moreExpanded && <p className="mt-2 leading-relaxed text-gray-700">{feedback.moreExplanation}</p>}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </article>
    </section>
  );
}