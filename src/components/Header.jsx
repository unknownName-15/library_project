import React from 'react';

const Header = ({ 
  isLoggedIn, userName, notifications, isNotiOpen, setIsNotiOpen, 
  isMenuOpen, setIsMenuOpen, setModalType, setIsLoggedIn,
  deleteNotification, allRead,
  searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen, allBooks, onAddBook
}) => {
  
  // 실시간 검색어 필터링
  const filteredBooks = allBooks.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery !== ''
  );

  return (
    <header className="header-row">
      {/* 검색 영역 */}
      <div className="search-container" onClick={(e) => e.stopPropagation()}>
        <i className="ri-search-line"></i>
        <input 
          type="text" 
          placeholder="어떤 책을 찾으시나요?" 
          className="search-bar" 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
        />
        
        {/* 검색 결과 레이어 */}
        {isSearchOpen && searchQuery && (
          <div className="search-results">
            {filteredBooks.map(book => (
  <div key={book.id} className="search-result-item">
    <i className="ri-book-line result-icon"></i>
    <div className="result-info">
      <span className="result-title">{book.title}</span>
      <span className="result-author">{book.author}</span>
    </div>
    
    {/* 버튼 그룹으로 변경하여 선택권 제공 */}
    <div className="add-actions">
      <button 
        className="add-wish-btn" 
        onClick={() => onAddBook(book, 'wish')}
        title="위시리스트에 추가"
      >
        위시
      </button>
      <button 
        className="add-my-btn" 
        onClick={() => onAddBook(book, 'read')}
        title="마이리스트에 추가"
      >
        읽음
      </button>
    </div>
  </div>
))}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {/* 알림 영역 */}
        <div style={{ position: 'relative' }}>
          <i 
            className="ri-notification-3-line" 
            style={{ fontSize: '22px', cursor: 'pointer' }}
            onClick={() => { setIsNotiOpen(!isNotiOpen); setIsMenuOpen(false); }}
          ></i>
          {notifications.length > 0 && (
            <span className="badge-dot" style={{ position: 'absolute', top: '0px', right: '0px', width: '8px', height: '8px', backgroundColor: '#e74c3c', borderRadius: '50%', border: '2px solid #f4f4f4' }}></span>
          )}
          
          {isNotiOpen && (
            <div className="noti-dropdown">
              <div className="noti-header">
                <span>알림 {notifications.length}</span>
                {notifications.length > 0 && <span className="all-read-btn" onClick={allRead}>모두 읽음</span>}
              </div>
              {notifications.length > 0 ? (
                notifications.map((noti) => (
                  <div key={noti.id} className="noti-item" onClick={() => deleteNotification(noti.id)}>
                    <div className="noti-item-title">{noti.message}</div>
                    <div className="noti-item-time">{noti.time}</div>
                  </div>
                ))
              ) : (
                <div className="noti-empty">새로운 알림이 없습니다. ✨</div>
              )}
            </div>
          )}
        </div>

        {/* 프로필 영역 */}
        <div className="profile-wrapper">
          {isLoggedIn ? (
            <>
              <div className="profile-circle" onClick={() => { setIsMenuOpen(!isMenuOpen); setIsNotiOpen(false); }}>
                {userName ? userName.charAt(0) : '김'}
              </div>
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" style={{fontWeight: 'bold', borderBottom: '1px solid #eee'}}>{userName}님</div>
                  <div className="dropdown-item">회원 정보</div>
                  <div className="dropdown-item logout" style={{ color: 'var(--color-point)', fontWeight: 'bold' }} onClick={() => { setIsLoggedIn(false); setIsMenuOpen(false); }}>로그아웃</div>
                </div>
              )}
            </>
          ) : (
            <div className="login-icon-button" onClick={() => setModalType('login')}>
              <i className="ri-user-line"></i>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;