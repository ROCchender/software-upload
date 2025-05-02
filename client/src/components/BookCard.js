import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';

const BookCard = ({ book }) => {
  return (
    <Card className="my-3 p-3 rounded book-card">
      <Link to={`/books/${book._id}`}>
        <Card.Img
          src={book.cover || '/uploads/default-book.jpg'}
          variant="top"
          alt={book.title}
        />
      </Link>

      <Card.Body>
        <Link to={`/books/${book._id}`}>
          <Card.Title as="div">
            <strong>{book.title}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div" className="my-2">
          <div>作者: {book.author}</div>
          <div>出版社: {book.publisher}</div>
          <div>
            分类: {book.category ? book.category.name : '未分类'}
          </div>
        </Card.Text>

        <Card.Text as="div" className="d-flex justify-content-between align-items-center mt-2">
          <span>可借阅: {book.availableCopies}</span>
          <Badge bg={book.isAvailable ? 'success' : 'danger'}>
            {book.isAvailable ? '可借阅' : '无库存'}
          </Badge>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
