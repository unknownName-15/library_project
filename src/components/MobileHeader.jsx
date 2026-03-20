import React, { useState } from 'react';

const MobileHeader = ({
  view, setView,
  isLoggedIn, userName, userId,
  notifications, deleteNotification, allRead,
  setModalType, setIsLoggedIn, setUserName, setUserId, setIsAdmin,
  searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen,
  allBooks, onAddBook,
  isMobileMode, toggleMobileMode,
  isAdmin
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.is_read == 0).length;

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserId(null);
    setIsAdmin(false);
    setIsMenuOpen(false);
    setView('main');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
  };

  const filteredBooks = allBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery !== ''
  );

  return (
    <>
      {/* 상단 헤더 */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: 'white', borderBottom: '1px solid #eee',
        padding: '0 16px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        {/* 로고 */}
        <div
          onClick={() => setView('main')}
          style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--color-point)', cursor: 'pointer' }}
        >
          <i className="ri-book-open-fill"></i> LIB.
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* 알림 */}
          <div style={{ position: 'relative' }}>
            <i
              className="ri-notification-3-line"
              style={{ fontSize: '22px', cursor: 'pointer' }}
              onClick={() => { setIsNotiOpen(!isNotiOpen); setIsMenuOpen(false); }}
            ></i>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '0px', right: '0px',
                width: '8px', height: '8px', backgroundColor: '#e74c3c',
                borderRadius: '50%', border: '2px solid white'
              }}></span>
            )}
            {isNotiOpen && (
              <div className="noti-dropdown" style={{ right: 0, left: 'auto' }}>
                <div className="noti-header">
                  <span>알림 {unreadCount}</span>
                  {unreadCount > 0 && <span className="all-read-btn" onClick={allRead}>모두 읽음</span>}
                </div>
                {notifications.filter(n => n.is_read == 0).length > 0 ? (
                  notifications.filter(n => n.is_read == 0).map((noti) => (
                    <div key={noti.id} className="noti-item" onClick={() => deleteNotification(noti.id)}>
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

          {/* 로그인/프로필 */}
          {isLoggedIn ? (
            <div
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: 'var(--color-point)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', cursor: 'pointer'
              }}
              onClick={() => { setIsMenuOpen(!isMenuOpen); setIsNotiOpen(false); }}
            >
              {userName?.charAt(0)}
            </div>
          ) : (
            <i className="ri-user-line" style={{ fontSize: '22px', cursor: 'pointer' }} onClick={() => setModalType('login')}></i>
          )}

          {/* 햄버거 메뉴 */}
          <i
            className={isMenuOpen && !isLoggedIn ? 'ri-close-line' : 'ri-menu-line'}
            style={{ fontSize: '24px', cursor: 'pointer' }}
            onClick={() => { setIsMenuOpen(!isMenuOpen); setIsNotiOpen(false); }}
          ></i>
        </div>
      </header>

      {/* 햄버거 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed', top: '56px', left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999
        }} onClick={() => setIsMenuOpen(false)}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '75%', maxWidth: '300px',
            height: '100%', backgroundColor: 'white', padding: '20px',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
          }} onClick={(e) => e.stopPropagation()}>

            {/* 로그인 정보 */}
            {isLoggedIn && (
              <div style={{
                padding: '15px', backgroundColor: '#f8f9f7', borderRadius: '12px',
                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: 'var(--color-point)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '18px'
                }}>
                  {userName?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{userName}님</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>환영합니다!</div>
                </div>
              </div>
            )}

            {/* 네비게이션 메뉴 */}
            <nav>
              {[
                { icon: 'ri-home-5-line', label: '홈', view: 'main' },
                { icon: 'ri-community-line', label: '커뮤니티', view: 'community' },
                { icon: 'ri-book-mark-line', label: '내 서재', view: 'library' },
                { icon: 'ri-calendar-event-line', label: '독서 모임', view: 'group' },
              ].map(item => (
                <div
                  key={item.view}
                  onClick={() => { setView(item.view); setIsMenuOpen(false); }}
                  style={{
                    padding: '14px 10px', display: 'flex', alignItems: 'center', gap: '12px',
                    fontSize: '16px', cursor: 'pointer', borderRadius: '10px',
                    backgroundColor: view === item.view ? '#f0f4ef' : 'transparent',
                    color: view === item.view ? 'var(--color-point)' : '#333',
                    fontWeight: view === item.view ? 'bold' : 'normal',
                    marginBottom: '4px'
                  }}
                >
                  <i className={item.icon}></i> {item.label}
                </div>
              ))}
            </nav>

            <div style={{ borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px' }}>
              {isLoggedIn && (
                <>
                  {isAdmin && (
                    <div
                      onClick={() => { setView('admin'); setIsMenuOpen(false); }}
                      style={{ padding: '14px 10px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', cursor: 'pointer', borderRadius: '10px', marginBottom: '4px' }}
                    >
                      <i className="ri-shield-user-line"></i> 관리자 페이지
                    </div>
                  )}
                  <div
                    onClick={() => { setView('userinfo'); setIsMenuOpen(false); }}
                    style={{ padding: '14px 10px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', cursor: 'pointer', borderRadius: '10px', marginBottom: '4px' }}
                  >
                    <i className="ri-user-settings-line"></i> 회원 정보
                  </div>
                  <div
                    onClick={handleLogout}
                    style={{ padding: '14px 10px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', cursor: 'pointer', borderRadius: '10px', color: '#e74c3c', fontWeight: 'bold' }}
                  >
                    <i className="ri-logout-box-line"></i> 로그아웃
                  </div>
                </>
              )}
              {!isLoggedIn && (
                <div
                  onClick={() => { setModalType('login'); setIsMenuOpen(false); }}
                  style={{ padding: '14px 10px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', cursor: 'pointer', borderRadius: '10px', color: 'var(--color-point)', fontWeight: 'bold' }}
                >
                  <i className="ri-login-box-line"></i> 로그인
                </div>
              )}

              {/* PC 버전으로 전환 */}
              <div
                onClick={() => { toggleMobileMode(); setIsMenuOpen(false); }}
                style={{ padding: '14px 10px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', cursor: 'pointer', borderRadius: '10px', color: '#999', marginTop: '4px' }}
              >
                <i className="ri-computer-line"></i> PC 버전
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색바 */}
      <div style={{
        position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 998,
        backgroundColor: 'white', padding: '10px 16px',
        borderBottom: '1px solid #f0f0f0'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ position: 'relative' }}>
          <i className="ri-search-line" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
          <input
            type="text"
            placeholder="어떤 책을 찾으시나요?"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
            onFocus={() => setIsSearchOpen(true)}
            style={{
              width: '100%', padding: '10px 10px 10px 36px',
              borderRadius: '20px', border: '1px solid #eee',
              backgroundColor: '#f8f9f7', outline: 'none', fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          {isSearchOpen && searchQuery && (
            <div className="search-results" style={{ top: '45px' }}>
              {filteredBooks.map(book => (
                <div key={book.id} className="search-result-item">
                  <i className="ri-book-line result-icon"></i>
                  <div className="result-info">
                    <span className="result-title">{book.title}</span>
                    <span className="result-author">{book.author}</span>
                  </div>
                  <div className="add-actions">
                    <button className="add-wish-btn" onClick={() => onAddBook(book, 'wish')}>위시</button>
                    <button className="add-my-btn" onClick={() => onAddBook(book, 'read')}>읽음</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileHeader;