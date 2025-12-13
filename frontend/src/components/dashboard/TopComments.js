import React from 'react';
import Card from '../ui/Card';
import Accordion from '../ui/Accordion'; // Import the new component

const TopComments = ({ topComments }) => {
  if (!topComments || Object.keys(topComments).length === 0) {
    return (
      <Card title="Top Comments">
        <p className="text-gray-400">No top comments available.</p>
      </Card>
    );
  }

  return (
    // We remove the default padding from the Card to allow the Accordion to fill it
    <Card title="Top Comments" className="p-0">
      <div className="rounded-b-lg overflow-hidden">
        {Object.entries(topComments).map(([sentiment, comments], index) => (
          <Accordion
            key={sentiment}
            title={sentiment.replace(/[/_]/g, ' ')}
            // Open the first category by default
            isOpenByDefault={index === 0}
          >
            <ul className="space-y-3 list-disc list-inside">
              {comments.map((comment, i) => (
                <li key={i} className="text-gray-300 leading-relaxed">
                  {comment}
                </li>
              ))}
            </ul>
          </Accordion>
        ))}
      </div>
    </Card>
  );
};

export default TopComments;