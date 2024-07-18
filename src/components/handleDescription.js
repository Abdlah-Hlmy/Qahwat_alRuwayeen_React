import React, { useState } from 'react';

const ReadMore = ({ text, maxLength }) => {
  const [isReadMore, setIsReadMore] = useState(false);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const shouldShowButton = text.length > maxLength;

  return (
    <div>
      <p>
        {isReadMore || !shouldShowButton ? text : `${text.substring(0, maxLength)}...`}
      </p>
      {shouldShowButton && (
        <button onClick={toggleReadMore} className="text-brown-700 text-[15px] font-semibold">
          {isReadMore ? 'إقرأ أقل' : 'إقرأ المزيد'}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
