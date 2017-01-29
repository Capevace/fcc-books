import React from 'react';
import { Link } from 'react-router';

function BookBox({ book, user }) {
  return (
    <div className="card mb-4">
      <div className="card-block">
        <img
          className="w-100 mx-auto mb-3"
          src={`https://covers.openlibrary.org/b/ISBN/${book.isbn}-M.jpg`} />
        <h5 className="mb-0">{book.title}</h5>
        {book.owner !== user._id &&
          <Link to={`/request-trade/${book._id}`}>Make Trade Request</Link>
        }
      </div>
    </div>
  );
}

export default BookBox;
