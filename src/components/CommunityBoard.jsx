import React from 'react';

// props로 제목, 아이콘, 데이터를 전달받음
const CommunityBoard = ({ title, icon, data, onMoreClick }) => {
  return (
    <div className="board-card">
      <div className="board-header">
        <div className="board-title">
          <i className={icon}></i> {title}
        </div>
        <div className="more-btn" onClick={onMoreClick}>
          더 보기 <i className="ri-arrow-right-s-line"></i>
        </div>
      </div>
      <div className="post-list">
        {data.map((post) => (
          <div key={post.id} className="post-item">
            <span className="post-text">{post.title}</span>
            <span className="post-date">{post.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityBoard;