import { useState, useCallback, useEffect } from 'react';

export function useRearrange(story) {
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [availableSentences, setAvailableSentences] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hint, setHint] = useState(null);
  const [usedSolution, setUsedSolution] = useState(false);

  useEffect(() => {
    if (story && story.sentences) {
      setAvailableSentences(story.sentences);
      setSelectedOrder([]);
      setSubmitted(false);
      setIsCorrect(null);
      setHint(null);
      setUsedSolution(false);
    }
  }, [story]);

  const selectSentence = useCallback((sentence) => {
    if (submitted) return;
    setSelectedOrder((prev) => [...prev, sentence]);
    setAvailableSentences((prev) => prev.filter((s) => Number(s.id) !== Number(sentence.id)));
  }, [submitted]);

  const deselectSentence = useCallback((sentence) => {
    if (submitted) return;
    setAvailableSentences((prev) => [...prev, sentence]);
    setSelectedOrder((prev) => prev.filter((s) => Number(s.id) !== Number(sentence.id)));
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
    const m = item.wordMeanings?.[cleanWord];
    
    if (m) {
      const en = typeof m === 'object' ? m.english : null;
      const bn = typeof m === 'object' ? m.bengali : m;
      const text = `${word.toUpperCase()}\nবাংলা: ${bn || 'পাওয়া যায়নি'}\nEnglish: ${en || 'Not available'}`;
      setHint({ type: 'Word Meaning', text });
    } else {
      setHint({ type: 'Word Meaning', text: `${word.toUpperCase()}\nMeaning not available` });
    }
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

    const selectedIds = selectedOrder.map((s) => Number(s.id));
    const expectedIds = story.correctOrder.map(id => Number(id));
    
    if (selectedIds.length !== expectedIds.length) {
      setIsCorrect(false);
      return;
    }

    const isAnswerCorrect = JSON.stringify(selectedIds) === JSON.stringify(expectedIds);
    setIsCorrect(isAnswerCorrect);
    setSubmitted(true);
  }, [selectedOrder, story]);

  const showSolution = useCallback(() => {
    if (submitted || !story || !story.sentences) return;
    
    // Map the correct order IDs back to actual sentence objects
    const correctSentences = story.correctOrder.map(id => 
      story.sentences.find(s => Number(s.id) === Number(id))
    ).filter(Boolean);

    setSelectedOrder(correctSentences);
    setAvailableSentences([]);
    setIsCorrect(true);
    setUsedSolution(true);
    setSubmitted(true);
  }, [story, submitted]);

  const reset = useCallback(() => {
    if (story && story.sentences) {
      setAvailableSentences(story.sentences);
      setSelectedOrder([]);
      setSubmitted(false);
      setIsCorrect(null);
      setHint(null);
      setUsedSolution(false);
    }
  }, [story]);

  return {
    selectedOrder,
    availableSentences,
    submitted,
    isCorrect,
    hint,
    usedSolution,
    selectSentence,
    deselectSentence,
    reorderSelected,
    showWordMeaning,
    showTranslation,
    checkAnswer,
    reset,
    showSolution,
    setHint,
  };
}
