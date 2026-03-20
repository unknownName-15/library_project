import React, { useState, useEffect } from 'react';
import API_BASE from '../api/config';

const CommunityView = ({ handleBoardDetail }) => {
  const [previews, setPreviews] = useState({
    free: [],
    debate: [],
    group: [],
    recommend: []
  });

  const boards = [
    { type: 'free',      title: '자유게시판', icon: 'ri-chat-3-line' },
    { type: 'debate',    title: '토론게시판', icon: 'ri-discuss-line' },
    { type: 'group',     title: '모임게시판', icon: 'ri-team-line' },
    { type: 'recommend', title: '추천게시판', icon: 'ri-thumb-up-line' },
  ];

  // 모든 게시판 최신글 3개씩 불러오기
  useEffect(() => {
    const fetchAllPreviews = async () => {
      const results = {};
      await Promise.all(
        boards.map(async (board) => {
          try {
            const res = await fetch(`${API_BASE}/get_posts.php?board_type=${board.type}`);
            const data = await res.json();
            if (data.success) {
              results[board.type] = data.posts.slice(0, 3); // 최신 3개만
            } else {
              results[board.type] = [];
            }
          } catch (err) {
            results[board.type] = [];
          }
        })
      );
      setPreviews(results);
    };

    fetchAllPreviews();
  }, []);

  return (
    <div className="fade-in">
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '30px' }}>
        커뮤니티 광장
      </h2>
      <div className="community-grid">
        {boards.map(board => (
          <div key={board.type} className="board-card">
            <div className="board-header">
              <div className="board-title">
                <i className={board.icon}></i> {board.title}
              </div>
              <div className="more-btn" onClick={() => handleBoardDetail(board.type, board.title)}>
                더 보기 <i className="ri-arrow-right-s-line"></i>
              </div>
            </div>
            <div className="post-list">
              {previews[board.type].length > 0 ? (
                previews[board.type].map(post => (
                  <div key={post.id} className="post-item">
                    <span className="post-text">{post.title}</span>
                    <span className="post-date">
                      {post.created_at?.slice(0, 10)}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#bbb', fontSize: '14px', padding: '20px 0', textAlign: 'center' }}>
                  아직 게시글이 없습니다.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityView;