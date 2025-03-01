

import React from 'react';

const QuestionsList = ({ filteredQuestions = [], onQuestionClick }) => {
  console.log('QuestionsList Props:', filteredQuestions); // Debugging
  console.log('onQuestionClicks:', onQuestionClick);

  if (!Array.isArray(filteredQuestions)) {
    console.error('QuestionsList: Expected questions to be an array');
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      <ul className="list-disc pl-5">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question, index) => (
            <li
              key={index}
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => onQuestionClick(question)}
            >
              {question}
            </li>
          ))
        ) : (
          <li>No questions available.</li>
        )}
      </ul>
    </div>
  );
};

export default QuestionsList;
