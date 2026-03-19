import React from 'react';

const BoardList = ({ title, posts, onBack, onPostClick, onWriteClick }) => {
  return (
    <div className="board-list-container fade-in">
      {/* 헤더 영역 */}
      <div className="board-list-header">
        <button className="back-btn" onClick={onBack} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#888', marginBottom: '10px' }}>
          <i className="ri-arrow-left-line"></i> 광장으로 돌아가기
        </button>
        <h2 className="board-list-title" style={{ fontSize: '28px', color: 'var(--color-point)', marginBottom: '30px' }}>{title}</h2>
      </div>

      {/* 게시글 테이블 */}
      <div className="table-wrapper" style={{ borderTop: '2px solid var(--color-point)' }}>
        <table className="board-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9f7' }}>
              <th style={{ width: '10%', padding: '15px', color: '#666' }}>번호</th>
              <th style={{ width: '60%', padding: '15px', color: '#666', textAlign: 'left' }}>제목</th>
              <th style={{ width: '15%', padding: '15px', color: '#666' }}>작성자</th>
              <th style={{ width: '15%', padding: '15px', color: '#666' }}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id} className="table-row" style={{ borderBottom: '1px solid #f4f4f4', textAlign: 'center' }}>
                <td style={{ padding: '18px' }}>{posts.length - index}</td>
                
                <td 
                  className="table-title" 
                  onClick={() => onPostClick(post)} 
                  style={{ 
                    padding: '18px', 
                    textAlign: 'left', 
                    fontWeight: '500', 
                    cursor: 'pointer',
                    color: '#333'
                  }}
                >
                  {post.title}
                </td>
                
                <td style={{ padding: '18px' }}>익명</td>
                <td style={{ padding: '18px', color: '#999', fontSize: '13px' }}>{post.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="board-footer" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="write-btn" onClick={onWriteClick} style={{ padding: '12px 25px', backgroundColor: 'var(--color-point)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
          <i className="ri-edit-line"></i> 글쓰기
        </button>
      </div>
    </div>
  );
};

export default BoardList;