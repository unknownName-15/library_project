import React from 'react';

const Sidebar = ({ view, setView }) => {
  return (
    <aside className="sidebar">
      <div className="logo" onClick={() => setView('main')} style={{ cursor: 'pointer' }}>
        <i className="ri-book-open-fill"></i> LIB.
      </div>
      <nav className="menu-list">
        {/* 홈 메뉴 */}
        <div 
          className={`menu-item ${view === 'main' ? 'active' : ''}`} 
          onClick={() => setView('main')}
        >
          <i className="ri-home-5-line"></i> 홈
        </div>

        {/* 커뮤니티 메뉴 */}
        <div 
          className={`menu-item ${['community', 'board-detail', 'post-detail'].includes(view) ? 'active' : ''}`} 
          onClick={() => setView('community')}
        >
          <i className="ri-community-line"></i> 커뮤니티
        </div>

        {/* 내 서재 메뉴 */}
        <div 
          className={`menu-item ${view === 'library' ? 'active' : ''}`} 
          onClick={() => setView('library')}
        >
          <i className="ri-book-mark-line"></i> 내 서재
        </div>

        {/* 독서 모임 메뉴 */}
        <div 
          className={`menu-item ${view === 'group' ? 'active' : ''}`} 
          onClick={() => setView('group')}
        >
          <i className="ri-calendar-event-line"></i> 독서 모임
        </div>
      </nav>

      <div style={{ marginTop: 'auto' }} className="menu-item">
        <i className="ri-settings-3-line"></i> 설정
      </div>
    </aside>
  );
};

export default Sidebar;