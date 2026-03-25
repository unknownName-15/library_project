import React, { useState, useEffect } from 'react';
import { BOOK_SEARCH } from '../api/config';

const BookSearchView = ({ query, onAddBook }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BOOK_SEARCH}?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) setBooks(data.books);
      } catch (err) {
        console.error('검색 실패', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [query]);

  return (
    <div className="fade-in">
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '30px' }}>
        <i className="ri-search-line"></i> '{query}' 검색 결과
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>검색 중...</div>
      ) : books.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '25px' }}>
          {books.map((book, index) => (
            <div key={index} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 책 표지 */}
              <div style={{ width: '100%', height: '200px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {book.thumbnail ? (
                  <img src={book.thumbnail} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className="ri-book-3-line" style={{ fontSize: '40px', color: '#ddd' }}></i>
                )}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333', lineHeight: '1.4' }}>{book.title}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>{book.authors}</div>
              <div style={{ fontSize: '12px', color: '#bbb' }}>{book.publisher}</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => onAddBook(book, 'wish')}
                  style={{ flex: 1, padding: '8px', backgroundColor: '#fff8f0', color: 'var(--color-accent)', border: '1px solid var(--color-accent)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  위시
                </button>
                <button
                  onClick={() => onAddBook(book, 'read')}
                  style={{ flex: 1, padding: '8px', backgroundColor: 'var(--color-point)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  읽음
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', color: '#bbb' }}>
          <i className="ri-search-line" style={{ fontSize: '40px', marginBottom: '15px', display: 'block' }}></i>
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default BookSearchView;