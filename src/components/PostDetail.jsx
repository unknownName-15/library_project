import React from 'react';

// 1. 여기서 onEdit 프롭을 반드시 받아와야 합니다!
const PostDetail = ({ post, onBack, onDelete, onEdit }) => {
  
  const handleDelete = () => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      onDelete(post.id);
    }
  };

  return (
    <div className="post-detail-container fade-in" style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px' }}>
      {/* 상단 바 - 버튼들 배치 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onBack} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <i className="ri-arrow-left-line"></i> 목록으로 돌아가기
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          {/* 수정하기 버튼 */}
          <button 
            onClick={onEdit} 
            style={{ cursor: 'pointer', border: 'none', background: '#f0f4ef', color: '#4a6741', padding: '8px 15px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <i className="ri-edit-line"></i> 수정하기
          </button>

          {/* 삭제하기 버튼 */}
          <button 
            onClick={handleDelete}
            style={{ 
              cursor: 'pointer', 
              border: 'none', 
              background: '#fff0f0', 
              color: '#e74c3c', 
              padding: '8px 15px', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <i className="ri-delete-bin-line"></i> 삭제하기
          </button>
        </div>
      </div>

      {/* 게시글 헤더 */}
      <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#333', marginBottom: '15px' }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: '15px', color: '#999', fontSize: '14px' }}>
          <span><i className="ri-user-line"></i> 익명 사용자</span>
          <span><i className="ri-time-line"></i> {post.date}</span>
          <span><i className="ri-eye-line"></i> 조회수 124</span>
        </div>
      </div>

      {/* 게시글 본문 */}
      <div style={{ lineHeight: '1.8', color: '#444', fontSize: '16px', minHeight: '300px', marginBottom: '50px' }}>
        {post.content ? (
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
        ) : (
          <p>내용이 없습니다.</p>
        )}
      </div>

      {/* 하단 댓글 영역 */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}><i className="ri-chat-3-line"></i> 댓글 0</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="따뜻한 댓글을 남겨주세요." 
            style={{ flex: 1, padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }} 
          />
          <button style={{ padding: '0 20px', backgroundColor: 'var(--color-point)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;