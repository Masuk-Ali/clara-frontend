import { useState, useCallback, useEffect } from 'react';

export function useRearrange(story) {
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [availableSentences, setAvailableSentences] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hint, setHint] = useState(null);

  useEffect(() => {
    if (story && story.sentences) {
      setAvailableSentences(story.sentences);
      setSelectedOrder([]);
      setSubmitted(false);
      setIsCorrect(null);
      setHint(null);
    }
  }, [story]);

  const selectSentence = useCallback((sentence) => {
    if (submitted) return;
    setSelectedOrder((prev) => [...prev, sentence]);
    setAvailableSentences((prev) => prev.filter((s) => s.id !== sentence.id));
  }, [submitted]);

  const deselectSentence = useCallback((sentence) => {
    if (submitted) return;
    setAvailableSentences((prev) => [...prev, sentence]);
    setSelectedOrder((prev) => prev.filter((s) => s.id !== sentence.id));
  }, [submitted]);

  const reorderSelected = useCallback((startIndex, endIndex) => {
    if (submitted) return;
    setSelectedOrder((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, [submitted]);

  const showWordMeaning = useCallback((word, item) => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    const meaning = item.wordMeanings?.[cleanWord];
    if (meaning) setHint({ type: 'Word Meaning', text: `${word}: ${meaning}` });
  }, []);

  const showTranslation = useCallback((item) => {
    const text = item.translation || item.bengaliTranslation || 'No translation available';
    setHint({ type: 'Bengali Translation', text, index: item.id });
  }, []);

  const checkAnswer = useCallback(() => {
    if (!story || !story.correctOrder) {
      setIsCorrect(false);
      return;
    }

    const selectedIds = selectedOrder.map((s) => s.id);
    const isAnswerCorrect = JSON.stringify(selectedIds) === JSON.stringify(story.correctOrder);
    setIsCorrect(isAnswerCorrect);
    setSubmitted(true);
  }, [selectedOrder, story]);

  const reset = useCallback(() => {
    if (story && story.sentences) {
      setAvailableSentences(story.sentences);
      setSelectedOrder([]);
      setSubmitted(false);
      setIsCorrect(null);
      setHint(null);
    }
  }, [story]);

  return {
    selectedOrder,
    availableSentences,
    submitted,
    isCorrect,
    hint,
    selectSentence,
    deselectSentence,
    reorderSelected,
    showWordMeaning,
    showTranslation,
    checkAnswer,
    reset,
    setHint,
  };
}
