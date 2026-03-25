import React, { useState, useEffect } from 'react';
import { BOOK_SEARCH } from '../api/config';

const Header = ({
  isLoggedIn, userName, notifications, isNotiOpen, setIsNotiOpen,
  isMenuOpen, setIsMenuOpen, setModalType, setIsLoggedIn,
  deleteNotification, allRead,
  searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen,
  allBooks, onAddBook, setView, setUserName, setUserId,
  isAdmin, setIsAdmin, onSearch
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => n.is_read == 0).length;

  // 검색어 변경 시 API 호출
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BOOK_SEARCH}?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) setSearchResults(data.books.slice(0, 5));
      } catch (err) {
        console.error('검색 실패', err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms 디바운스
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 엔터 또는 돋보기 클릭 시 검색 결과 페이지로 이동
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    onSearch(searchQuery);
  };

  return (
    <header className="header-row">
      {/* 검색 영역 */}
      <div className="search-container" onClick={(e) => e.stopPropagation()}>
        <i
          className="ri-search-line"
          style={{ cursor: 'pointer' }}
          onClick={handleSearch}
        ></i>
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
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />

        {/* 검색 결과 드롭다운 */}
        {isSearchOpen && searchQuery && (
          <div className="search-results">
            {loading ? (
              <div style={{ padding: '15px', textAlign: 'center', color: '#999' }}>검색 중...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((book, index) => (
                <div key={index} className="search-result-item">
                  {/* 책 표지 */}
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      style={{ width: '36px', height: '52px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                  ) : (
                    <i className="ri-book-line result-icon"></i>
                  )}
                  <div className="result-info">
                    <span className="result-title">{book.title}</span>
                    <span className="result-author">{book.authors}</span>
                  </div>
                  <div className="add-actions">
                    <button className="add-wish-btn" onClick={() => onAddBook(book, 'wish')}>위시</button>
                    <button className="add-my-btn" onClick={() => onAddBook(book, 'read')}>읽음</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-result">검색 결과가 없습니다.</div>
            )}
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
          {unreadCount > 0 && (
            <span className="badge-dot" style={{ position: 'absolute', top: '0px', right: '0px', width: '8px', height: '8px', backgroundColor: '#e74c3c', borderRadius: '50%', border: '2px solid #f4f4f4' }}></span>
          )}
          {isNotiOpen && (
            <div className="noti-dropdown">
              <div className="noti-header">
                <span>알림 {unreadCount}</span>
                {unreadCount > 0 && <span className="all-read-btn" onClick={allRead}>모두 읽음</span>}
              </div>
              {notifications.filter(n => n.is_read == 0).length > 0 ? (
                notifications.filter(n => n.is_read == 0).map((noti) => (
                  <div key={noti.id} className="noti-item" onClick={() => deleteNotification(noti.id)}
                    style={{ backgroundColor: noti.is_read == 1 ? 'white' : '#f0f4ef' }}>
                    <div className="noti-item-title">{noti.message}</div>
                    <div className="noti-item-time">{noti.created_at?.slice(0, 16).replace('T', ' ')}</div>
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
                  <div className="dropdown-item" style={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>{userName}님</div>
                  <div className="dropdown-item" onClick={() => { setView('userinfo'); setIsMenuOpen(false); }}>회원 정보</div>
                  {isAdmin && (
                    <div className="dropdown-item" onClick={() => { setView('admin'); setIsMenuOpen(false); }}>
                      <i className="ri-shield-user-line"></i> 관리자 페이지
                    </div>
                  )}
                  <div className="dropdown-item logout" style={{ color: 'var(--color-point)', fontWeight: 'bold' }}
                    onClick={() => { setIsLoggedIn(false); setIsMenuOpen(false); setUserName(''); setUserId(null); setIsAdmin(false); localStorage.removeItem('userName'); localStorage.removeItem('userId'); localStorage.removeItem('isAdmin'); }}>
                    로그아웃
                  </div>
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