import React, { useState } from 'react';

const PostDetail = ({ post, onBack, onDelete, onEdit, onCommentSubmit, onCommentDelete }) => {
  const [commentText, setCommentText] = useState('');

  const handleDelete = () => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      onDelete(post.id);
    }
  };

  const handleCommentConfirm = () => {
    if (!commentText.trim()) return;
    onCommentSubmit(post.id, commentText);
    setCommentText(''); // 입력창 초기화
  };

  return (
    <div className="post-detail-container fade-in" style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onBack} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <i className="ri-arrow-left-line"></i> 목록으로 돌아가기
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onEdit} style={{ cursor: 'pointer', border: 'none', background: '#f0f4ef', color: '#4a6741', padding: '8px 15px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            <i className="ri-edit-line"></i> 수정하기
          </button>
          <button onClick={handleDelete} style={{ cursor: 'pointer', border: 'none', background: '#fff0f0', color: '#e74c3c', padding: '8px 15px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            <i className="ri-delete-bin-line"></i> 삭제하기
          </button>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#333', marginBottom: '15px' }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: '15px', color: '#999', fontSize: '14px' }}>
          <span><i className="ri-user-line"></i> 익명 사용자</span>
          <span><i className="ri-time-line"></i> {post.date}</span>
        </div>
      </div>

      <div style={{ lineHeight: '1.8', color: '#444', fontSize: '16px', minHeight: '200px', marginBottom: '50px' }}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content || "내용이 없습니다."}</p>
      </div>

      {/* 댓글 영역 시작 */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>
          <i className="ri-chat-3-line"></i> 댓글 {(post.comments || []).length}
        </h3>
        
        {/* 댓글 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
          {(post.comments || []).map((comment) => (
            <div key={comment.id} style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '12px', position: 'relative' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>{comment.writer}</div>
              <div style={{ fontSize: '15px', color: '#555', marginBottom: '5px' }}>{comment.text}</div>
              <div style={{ fontSize: '12px', color: '#bbb' }}>{comment.date}</div>
              
              {/* 댓글 삭제 버튼 */}
              <i 
                className="ri-close-line" 
                onClick={() => onCommentDelete(post.id, comment.id)}
                style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', color: '#ccc' }}
              ></i>
            </div>
          ))}
          {(!post.comments || post.comments.length === 0) && (
            <div style={{ textAlign: 'center', color: '#bbb', padding: '20px' }}>첫 번째 댓글을 남겨보세요!</div>
          )}
        </div>

        {/* 댓글 작성란 */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="따뜻한 댓글을 남겨주세요." 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ flex: 1, padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }} 
            onKeyPress={(e) => e.key === 'Enter' && handleCommentConfirm()}
          />
          <button 
            onClick={handleCommentConfirm}
            style={{ padding: '0 25px', backgroundColor: 'var(--color-point)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;