import React, { useState, useEffect } from 'react';
import { BOOK_SEARCH } from '../api/config';

const HomeView = ({ setView, onAddBook }) => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [slideAnimation, setSlideAnimation] = useState('slide-in');
  const [bannerBook, setBannerBook] = useState(null);

  // 인기 도서 + 배너 책 불러오기
useEffect(() => {
  const fetchBooks = async () => {
    try {
      // 랜덤 키워드 목록
      const keywords = ['소설', '에세이', '인문학', '자기계발', '역사', '과학', '철학', '심리학', '문학', '시'];
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

      const res = await fetch(`${BOOK_SEARCH}?query=${encodeURIComponent(randomKeyword)}&size=18`);
      const data = await res.json();
      if (data.success) {
        const shuffled = [...data.books].sort(() => Math.random() - 0.5);
        setPopularBooks(shuffled);
      }

      // 배너 책
      const bannerRes = await fetch(`${BOOK_SEARCH}?query=작별하지 않는다 한강&size=1`);
      const bannerData = await bannerRes.json();
      if (bannerData.success && bannerData.books.length > 0) {
        setBannerBook(bannerData.books[0]);
      }
    } catch (err) {
      console.error('도서 불러오기 실패', err);
    }
  };
  fetchBooks();
}, []);

  const isMobile = document.body.classList.contains('mobile-mode');
  const itemsPerPage = isMobile ? 2 : 6;
  const totalPages = Math.ceil(popularBooks.length / itemsPerPage);
  const displayedBooks = popularBooks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const changePage = (direction) => {
    setSlideAnimation(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
    setTimeout(() => {
      setCurrentPage(prev => direction === 'next' ? prev + 1 : prev - 1);
      setSlideAnimation('slide-in');
    }, 400);
  };

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => {
      if (currentPage === totalPages - 1) {
        setSlideAnimation('slide-out-left');
        setTimeout(() => { setCurrentPage(0); setSlideAnimation('slide-in'); }, 400);
      } else {
        changePage('next');
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [currentPage, totalPages]);

  return (
    <div className="fade-in">
      {/* 메인 배너 */}
      <section className="featured-card">
        <div style={{ maxWidth: '60%' }}>
          <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px' }}>Editor's Pick</span>
          <h2 style={{ fontSize: '38px', margin: '20px 0' }}>작별하지 않는다</h2>
          <p style={{ lineHeight: '1.8', opacity: 0.9, fontSize: '16px' }}>
            한강 작가가 들려주는 지극한 사랑에 관한 이야기.<br/>
            함께 읽고, 서로의 마음을 나누는 독서 토론에 참여하세요.
          </p>
          <button
            onClick={() => setView('detail')}
            style={{ marginTop: '30px', padding: '15px 30px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--color-accent)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
          >
            모임 상세보기
          </button>
        </div>
        <div className="book-image-placeholder">
  {bannerBook?.thumbnail ? (
    <img
      src={bannerBook.thumbnail}
      alt="작별하지 않는다"
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
    />
  ) : (
    <i className="ri-book-3-line" style={{ fontSize: '50px' }}></i>
  )}
</div>
      </section>

      {/* 인기 도서 슬라이드 */}
      <section>
        <div className="section-header">
          <h3 className="section-title" style={{ margin: 0 }}>
            <i className="ri-fire-line" style={{ color: 'var(--color-accent)' }}></i> 지금 인기 있는 책
          </h3>
          <div className="slide-controls">
            <button className="slide-btn" onClick={() => changePage('prev')} disabled={currentPage === 0}>
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button className="slide-btn" onClick={() => changePage('next')} disabled={currentPage === totalPages - 1}>
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>

        
        <div className={`book-grid ${slideAnimation}`} style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
          {displayedBooks.map((book, index) => (
            <div key={index} className="book-card" style={{ display: 'flex', flexDirection: 'column' }}>
  {/* 책 표지 */}
  <div style={{
    width: '100%',
    paddingBottom: '140%', // 책 비율 (세로가 가로의 1.4배)
    position: 'relative',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '12px'
  }}>
    {book.thumbnail ? (
      <img
        src={book.thumbnail}
        alt={book.title}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    ) : (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <i className="ri-image-line" style={{ color: '#ddd', fontSize: '30px' }}></i>
      </div>
    )}
  </div>
  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', lineHeight: '1.4' }}>{book.title}</div>
  <div style={{ color: 'var(--color-accent)', fontSize: '13px', marginBottom: '10px' }}>{book.authors}</div>
  {/* 위시/읽음 버튼 */}
  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
    <button
      onClick={() => onAddBook(book, 'wish')}
      style={{ flex: 1, padding: '7px', backgroundColor: '#fff8f0', color: 'var(--color-accent)', border: '1px solid var(--color-accent)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
    >
      위시
    </button>
    <button
      onClick={() => onAddBook(book, 'read')}
      style={{ flex: 1, padding: '7px', backgroundColor: 'var(--color-point)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
    >
      읽음
    </button>
  </div>
</div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;