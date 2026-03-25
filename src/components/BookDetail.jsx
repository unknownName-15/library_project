import React, { useState, useEffect } from 'react';
import { BOOK_SEARCH } from '../api/config';

// onJoin props를 추가로 받아옴
const BookDetail = ({ onBack, onJoin }) => {
  const [bookCover, setBookCover] = useState(null);
  
  // 이 페이지에서 신청할 모임의 정보 데이터
  const groupData = {
    id: 99,
    title: "한강 작가 '작별하지 않는다' 토론",
    date: "2026년 4월 15일 (수) 오후 7:30",
    tag: "강남/오프라인"
  };

  // 책 표지 불러오기
  useEffect(() => {
    const fetchCover = async () => {
      try {
        const res = await fetch(`${BOOK_SEARCH}?query=작별하지 않는다 한강&size=1`);
        const data = await res.json();
        if (data.success && data.books.length > 0) {
          setBookCover(data.books[0].thumbnail);
        }
      } catch (err) {
        console.error('표지 불러오기 실패', err);
      }
    };
    fetchCover();
  }, []);

  const handleApply = () => {
    if (onJoin) {
      onJoin(groupData);
    } else {
      alert('신청 기능을 불러올 수 없습니다.');
    }
  };

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={onBack}>
        <i className="ri-arrow-left-line"></i> 목록으로 돌아가기
      </button>

      <div className="detail-content">
        {/* 왼쪽: 책 표지 */}
        <div className="book-cover-large" style={{ padding: 0, overflow: 'hidden' }}>
          {bookCover ? (
            <img
              src={bookCover}
              alt="작별하지 않는다"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <i className="ri-book-3-line"></i>
          )}
        </div>

        {/* 오른쪽: 상세 정보 */}
        <div className="detail-info">
          <span className="category-tag">소설 / 독서 토론</span>
          <h1 className="detail-title">작별하지 않는다</h1>
          <p className="detail-author">저자: 한강 | 출판사: 문학동네</p>

          <div className="event-box">
            <h3><i className="ri-calendar-check-line"></i> 모임 정보</h3>
            <p><strong>일시:</strong> {groupData.date}</p>
            <p><strong>장소:</strong> 강남역 인근 북카페 '문장' (오프라인)</p>
            <p><strong>정원:</strong> 8명 (현재 5명 신청 중)</p>
          </div>

          <div className="description">
            <h3>모임 소개</h3>
            <p>
              "이것이 지극한 사랑에 대한 이야기라면 좋겠다." <br/>
              한강 작가의 신작을 함께 읽고 각자가 느낀 '작별'의 의미를 나누어 봅니다.
              따뜻한 차 한 잔과 함께 깊이 있는 문장들을 음미할 분들을 기다립니다.
            </p>
          </div>

          <div style={{ marginBottom: '40px' }}></div>

          <button className="apply-btn" onClick={handleApply}>
            이 모임 참여하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;