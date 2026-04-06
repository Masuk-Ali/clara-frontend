import React, { useState, useRef } from 'react';
import QuestionSection from './QuestionSection';

const PassageReader = ({ passage, explanations, questions }) => {
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const passageRef = useRef(null);

  const lines = passage.split('\n').filter(line => line.trim() !== '');

  const handleLineClick = (index) => {
    setSelectedLine(selectedLine === index ? null : index);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(selectedText);
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };

  const handleMouseUp = (e) => {
    // Delay to allow selection to complete
    setTimeout(handleTextSelection, 10);
  };

  const getMeaningForText = (text) => {
    // Simple word meanings - in a real app, this would be more comprehensive
    const meanings = {
      'history': 'The study of past events, particularly in human affairs.',
      'diverse': 'Showing a great deal of variety; very different.',
      'influenced': 'Have an effect on the way someone or something develops.',
      'empires': 'An extensive group of states or countries ruled over by a single monarch.',
      'independence': 'The state of being free from outside control.',
      'vibrant': 'Full of energy and life.'
    };
    return meanings[text.toLowerCase()] || 'No definition available for this word.';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold mb-6 text-center">Interactive Passage Reader</h2>

      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <p className="text-blue-800 text-sm">
          <strong>Instructions:</strong> Click on any line to highlight it and see explanations. Select any word to see its meaning. Answer the questions below after reading.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Passage:</h3>
        <div
          ref={passageRef}
          className="space-y-2 select-text"
          onMouseUp={handleMouseUp}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedLine === index
                  ? 'bg-blue-100 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleLineClick(index)}
            >
              <span className="text-gray-800">{line}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedLine !== null && explanations[selectedLine] && (
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <h4 className="font-semibold text-yellow-800">Explanation:</h4>
          <p className="text-yellow-700 mt-1">{explanations[selectedLine]}</p>
        </div>
      )}

      {showTooltip && selectedText && (
        <div
          className="fixed bg-black text-white px-3 py-2 rounded shadow-lg z-50 pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="text-sm">
            <strong>{selectedText}</strong>: {getMeaningForText(selectedText)}
          </div>
        </div>
      )}

      <QuestionSection questions={questions} />
    </div>
  );
};

export default PassageReader;