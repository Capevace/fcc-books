import React from 'react';
import { Row, Col } from '../components/Grid';
import BookGrid from '../containers/BookGrid';

function MyBooksPage({ userId }) {
  return (
    <div>
      <Row className="mb-4">
        <Col xs={12}>
          <h2>My Books</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <BookGrid showBooksByUser />
        </Col>
      </Row>
    </div>
  );
}

export default MyBooksPage;
