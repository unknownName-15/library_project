import React from 'react';

const Sidebar = ({ view, setView, isMobileMode, toggleMobileMode }) => {
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

        {/* 모바일 버전 전환 */}
        <div className="menu-item" onClick={toggleMobileMode} style={{ cursor: 'pointer' }}>
          <i className="ri-smartphone-line"></i> 모바일 버전
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;