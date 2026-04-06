import { useState } from 'react';

export default function RuleSection({ rules, examples }) {
  const [expandedExample, setExpandedExample] = useState(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📚 Grammar Rules</h2>
        <p className="text-gray-600">Let's understand the rules step by step, just like your teacher would explain</p>
      </div>

      {/* Rules Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
        <h3 className="text-2xl font-semibold text-blue-800 mb-6 flex items-center gap-2">
          <span className="text-3xl">📖</span>
          Key Rules to Remember
        </h3>

        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium leading-relaxed">{rule}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
        <h3 className="text-2xl font-semibold text-green-800 mb-6 flex items-center gap-2">
          <span className="text-3xl">💡</span>
          Examples to Help You Understand
        </h3>

        <div className="space-y-4">
          {examples.map((example, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
                onClick={() => setExpandedExample(expandedExample === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono text-gray-700">"{example.sentence}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{example.note}</span>
                  <span className={`transform transition-transform ${expandedExample === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              {expandedExample === index && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Why this example?</h4>
                    <p className="text-gray-700 leading-relaxed">{example.explanation}</p>

                    {example.transformation && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <h5 className="font-semibold text-yellow-800 mb-1">Transformation:</h5>
                        <p className="text-yellow-700">{example.transformation}</p>
                      </div>
                    )}

                    {example.tips && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <h5 className="font-semibold text-blue-800 mb-1">💡 Remember:</h5>
                        <ul className="text-blue-700 text-sm space-y-1">
                          {example.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2">
                              <span>•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Teacher's Note */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
        <div className="flex items-start gap-3">
          <span className="text-2xl">👩‍🏫</span>
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">Teacher's Advice</h4>
            <p className="text-purple-700 leading-relaxed">
              Don't just memorize these rules—understand why they work. When you see a new sentence,
              ask yourself: "What is the main action? When does it happen? Who is doing it?"
              This thinking process will help you apply these rules correctly in exams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}