import React from 'react';
import Card from '../ui/Card';

const AllComments = ({ topComments }) => {
  // Since the API doesn't provide all comments, we'll merge the top comments
  // into a single list to display in this section.
  const allAvailableComments = Object.entries(topComments).flatMap(([sentiment, comments]) =>
    comments.map(text => ({ sentiment, text }))
  );

  return (
    <Card title="Comment Analysis">
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-800">
            <tr>
              <th className="p-2">Comment</th>
              <th className="p-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {allAvailableComments.map((comment, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="p-2">{comment.text}</td>
                <td className="p-2 capitalize">{comment.sentiment.replace(/[/_]/g, ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AllComments;