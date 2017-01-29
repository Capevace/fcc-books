import React from 'react';

function TradeBox({ trade, isByUser, onAccept }) {
  return (
    <div className="card mb-4">
      <div className="card-block">
        <h4>
          {trade.bookTitle}
        </h4>

        {!trade.accepted && isByUser &&
          <h4><small className="text-muted">Awaiting approval</small></h4>
        }
        {!trade.accepted && !isByUser &&
          <a href="#" onClick={e => {
            e.preventDefault();
            onAccept();
          }}>Accept Trade</a>
        }
        {trade.accepted &&
          <h4><small className="text-muted text-success">✓</small></h4>
        }
      </div>
    </div>
  );
}

export default TradeBox;
