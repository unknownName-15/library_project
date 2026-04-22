import React, { useState, useEffect } from 'react';
import { BOOK_SEARCH } from '../api/config';

const RECOMMEND_BOOKS = 'https://keepinsight.dothome.co.kr/api1/recommend_books.php';

const BookSearchView = ({ query, onAddBook }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recoLoading, setRecoLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!query) return;
    const fetchBooks = async () => {
      setLoading(true);
      setRecommendations([]);
      setSelectedBook(null);
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

  // AI 추천 요청
  const fetchRecommendations = async (book) => {
    setSelectedBook(book);
    setRecoLoading(true);
    setRecommendations([]);
    setShowModal(true);
    try {
      const res = await fetch(RECOMMEND_BOOKS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: book.title, authors: book.authors })
      });
      const data = await res.json();
      if (data.success) setRecommendations(data.recommendations);
    } catch (err) {
      console.error('추천 실패', err);
    } finally {
      setRecoLoading(false);
    }
  };

  // 책 카드 컴포넌트
  const BookCard = ({ book, showRecoBtn = false }) => (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ width: '100%', paddingBottom: '140%', position: 'relative', backgroundColor: '#f9f9f9', borderRadius: '10px', overflow: 'hidden' }}>
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={book.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <i className="ri-book-3-line" style={{ fontSize: '40px', color: '#ddd' }}></i>
          </div>
        )}
      </div>
      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333', lineHeight: '1.4' }}>{book.title}</div>
      <div style={{ fontSize: '12px', color: '#999' }}>{book.authors}</div>
      <div style={{ fontSize: '12px', color: '#bbb' }}>{book.publisher}</div>
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <button onClick={() => onAddBook(book, 'wish')} style={{ flex: 1, padding: '8px', backgroundColor: '#fff8f0', color: 'var(--color-accent)', border: '1px solid var(--color-accent)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>위시</button>
        <button onClick={() => onAddBook(book, 'read')} style={{ flex: 1, padding: '8px', backgroundColor: 'var(--color-point)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>읽음</button>
      </div>
      {showRecoBtn && (
        <button
          onClick={() => fetchRecommendations(book)}
          style={{ width: '100%', padding: '8px', backgroundColor: 'white', color: 'var(--color-point)', border: '1px solid var(--color-point)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <i className="ri-sparkling-line"></i> 관련 도서 추천
        </button>
      )}
    </div>
  );

  return (
    <div className="fade-in">
      {/* 검색 결과 */}
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '30px' }}>
        <i className="ri-search-line"></i> '{query}' 검색 결과
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>검색 중...</div>
      ) : books.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '25px' }}>
          {books.map((book, index) => (
            <BookCard key={index} book={book} showRecoBtn={true} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', color: '#bbb' }}>
          <i className="ri-search-line" style={{ fontSize: '40px', marginBottom: '15px', display: 'block' }}></i>
          검색 결과가 없습니다.
        </div>
      )}

      {/* AI 추천 모달 */}
      {showModal && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', width: '90%', maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <i
              className="ri-close-line"
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '24px', cursor: 'pointer', color: '#999' }}
            ></i>

            {/* 모달 제목 */}
            <h3 style={{ fontSize: '20px', color: 'var(--color-point)', marginBottom: '8px' }}>
              <i className="ri-sparkling-line" style={{ color: 'var(--color-accent)' }}></i> AI 추천 도서
            </h3>
            <p style={{ color: '#999', fontSize: '14px', marginBottom: '30px' }}>
              '{selectedBook?.title}'을 좋아하셨다면 이런 책도 어떠세요?
            </p>

            {/* 로딩 */}
            {recoLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <i className="ri-sparkling-line" style={{ fontSize: '30px', display: 'block', marginBottom: '10px', color: 'var(--color-accent)' }}></i>
                AI가 추천 도서를 분석 중이에요...
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {recommendations.map((book, index) => (
                  <div key={index} style={{ backgroundColor: '#f9f9f9', borderRadius: '16px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* 책 표지 */}
                    <div style={{ width: '100%', paddingBottom: '140%', position: 'relative', backgroundColor: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
                      {book.thumbnail ? (
                        <img src={book.thumbnail} alt={book.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                          <i className="ri-book-3-line" style={{ fontSize: '30px', color: '#ddd' }}></i>
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#333', lineHeight: '1.4' }}>{book.title}</div>
                    <div style={{ fontSize: '11px', color: '#999' }}>{book.authors}</div>
                    {/* 추천 이유 */}
                    <div style={{ fontSize: '11px', color: 'var(--color-point)', backgroundColor: '#f0f4ef', padding: '5px 8px', borderRadius: '6px', textAlign: 'center' }}>
                      {book.reason}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                      <button onClick={() => { onAddBook(book, 'wish'); setShowModal(false); }} style={{ flex: 1, padding: '7px', backgroundColor: '#fff8f0', color: 'var(--color-accent)', border: '1px solid var(--color-accent)', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>위시</button>
                      <button onClick={() => { onAddBook(book, 'read'); setShowModal(false); }} style={{ flex: 1, padding: '7px', backgroundColor: 'var(--color-point)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>읽음</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSearchView;