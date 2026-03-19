import React from 'react';

const MyLibraryView = ({ wishList, myList, joinedGroups, onRemove, onLeaveGroup }) => {
  return (
    <div className="library-container fade-in">
      <h2 className="section-title" style={{ fontSize: '24px' }}>내 서재</h2>

      {/* 신청한 독서 모임 섹션 */}
      <section className="library-section" style={{ marginBottom: '40px' }}>
        <h3 className="board-title" style={{ marginBottom: '20px' }}>
          <i className="ri-calendar-check-line"></i> 신청한 독서 모임 ({joinedGroups?.length || 0})
        </h3>
        <div className="joined-group-list">
          {joinedGroups && joinedGroups.length > 0 ? (
            joinedGroups.map(group => (
              <div key={group.id} className="joined-group-item">
                <div className="group-content">
                  <span className="group-tag-mini">{group.tag}</span>
                  <h4>{group.title}</h4>
                  <p>{group.date}</p>
                </div>
                <button className="leave-btn" onClick={() => onLeaveGroup(group.id)}>신청 취소</button>
              </div>
            ))
          ) : (
            <div className="no-result">아직 참여 중인 모임이 없습니다.</div>
          )}
        </div>
      </section>
      
      {/* 위시리스트 섹션 */}
      <section className="library-section">
        <h3 className="board-title"><i className="ri-heart-line"></i> 위시리스트 ({wishList.length})</h3>
        <div className="book-shelf">
          {wishList.length > 0 ? wishList.map(book => (
            <div key={book.id} className="book-card mini">
              {/* 삭제 버튼 */}
              <button className="delete-btn" onClick={() => onRemove(book.id, 'wish')}>
                <i className="ri-delete-bin-line"></i>
              </button>
              <div className="card-img" style={{ height: '140px' }}>
                <i className="ri-book-read-line"></i>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{book.title}</div>
            </div>
          )) : <div className="no-result">읽고 싶은 책을 담아보세요!</div>}
        </div>
      </section>

      {/* 마이리스트 섹션 */}
      <section className="library-section">
        <h3 className="board-title"><i className="ri-bookmark-line"></i> 마이리스트 ({myList.length})</h3>
        <div className="book-shelf">
          {myList.length > 0 ? myList.map(book => (
            <div key={book.id} className="book-card mini">
              {/* 삭제 버튼 */}
              <button className="delete-btn" onClick={() => onRemove(book.id, 'read')}>
                <i className="ri-delete-bin-line"></i>
              </button>
              <div className="card-img" style={{ height: '140px', background: '#f0f4ef' }}>
                <i className="ri-checkbox-circle-line" style={{ color: 'var(--color-point)' }}></i>
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{book.title}</div>
            </div>
          )) : <div className="no-result">다 읽은 책을 기록해보세요!</div>}
        </div>
      </section>
    </div>
  );
};

export default MyLibraryView;