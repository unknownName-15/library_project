import React, { useState, useEffect } from 'react';

const HomeView = ({ popularBooks, setView }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [slideAnimation, setSlideAnimation] = useState('slide-in');

  // 슬라이드 계산 로직
  const itemsPerPage = 3;
  const totalPages = Math.ceil(popularBooks.length / itemsPerPage);
  const displayedBooks = popularBooks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const changePage = (direction) => {
    setSlideAnimation(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
    setTimeout(() => {
      setCurrentPage(prev => direction === 'next' ? prev + 1 : prev - 1);
      setSlideAnimation('slide-in');
    }, 400);
  };

  // 자동 슬라이드 로직
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentPage === totalPages - 1) {
        setSlideAnimation('slide-out-left');
        setTimeout(() => {
          setCurrentPage(0);
          setSlideAnimation('slide-in');
        }, 400);
      } else {
        changePage('next');
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [currentPage, totalPages]);

  return (
    <div className="fade-in">
      {/* 메인 배너 영역 */}
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
        <div className="book-image-placeholder"><i className="ri-book-3-line" style={{ fontSize: '50px' }}></i></div>
      </section>

      {/* 인기 도서 슬라이드 영역 */}
      <section>
        <div className="section-header">
          <h3 className="section-title" style={{margin: 0}}>
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

        <div className={`book-grid ${slideAnimation}`}>
          {displayedBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="card-img"><i className="ri-image-line" style={{ color: '#ddd', fontSize: '30px' }}></i></div>
              <div style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '5px' }}>{book.title}</div>
              <div style={{ color: 'var(--color-accent)', fontSize: '14px' }}>{book.author}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;