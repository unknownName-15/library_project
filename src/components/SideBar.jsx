import React, { useState } from 'react';

const Sidebar = ({ view, setView, isMobileMode, toggleMobileMode }) => {
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  // 모바일 모드일 때는 사이드바 숨김
  if (isMobileMode) return null;

  return (
    <aside className="sidebar">
      <div className="logo" onClick={() => setView('main')} style={{ cursor: 'pointer' }}>
        <i className="ri-book-open-fill"></i> LIB.
      </div>
      <nav className="menu-list">
        <div className={`menu-item ${view === 'main' ? 'active' : ''}`} onClick={() => setView('main')}>
          <i className="ri-home-5-line"></i> 홈
        </div>
        <div className={`menu-item ${['community', 'board-detail', 'post-detail'].includes(view) ? 'active' : ''}`} onClick={() => setView('community')}>
          <i className="ri-community-line"></i> 커뮤니티
        </div>
        <div className={`menu-item ${view === 'library' ? 'active' : ''}`} onClick={() => setView('library')}>
          <i className="ri-book-mark-line"></i> 내 서재
        </div>
        <div className={`menu-item ${view === 'group' ? 'active' : ''}`} onClick={() => setView('group')}>
          <i className="ri-calendar-event-line"></i> 독서 모임
        </div>
      </nav>

      {/* 설정 메뉴 */}
      <div style={{ marginTop: 'auto' }}>
        <div 
          className="menu-item" 
          onClick={() => setIsSettingOpen(!isSettingOpen)} 
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span><i className="ri-settings-3-line"></i> 설정</span>
          <i className={isSettingOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}></i>
        </div>

        {/* 설정 서브메뉴 */}
        {isSettingOpen && (
          <div style={{ backgroundColor: '#f8f9f7', borderRadius: '10px', margin: '5px 10px', overflow: 'hidden' }}>
            <div 
              className="menu-item" 
              onClick={toggleMobileMode}
              style={{ fontSize: '13px', padding: '10px 15px' }}
            >
              <i className="ri-smartphone-line"></i> 모바일 버전
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;