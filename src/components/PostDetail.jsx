import React, { useState, useEffect } from 'react';
import API_BASE from '../api/config';

const PostDetail = ({ post, onBack, onDelete, onEdit, onCommentSubmit, onCommentDelete, isLoggedIn, setModalType, showToast, userId, userName, isAdmin }) => {
  const [commentText, setCommentText] = useState('');
  const isMyPost = isAdmin || (userId && post.user_id && String(userId) === String(post.user_id));
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [replyOpen, setReplyOpen] = useState({});
  const [replies, setReplies] = useState({});

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_comments.php?post_id=${post.id}`);
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch (err) {
      console.error('댓글 불러오기 실패', err);
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      const res = await fetch(`${API_BASE}/get_replies.php?comment_id=${commentId}`);
      const data = await res.json();
      if (data.success) setReplies(prev => ({ ...prev, [commentId]: data.replies }));
    } catch (err) {
      console.error('대댓글 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  useEffect(() => {
    if (comments.length > 0) {
      comments.forEach(comment => fetchReplies(comment.id));
    }
  }, [comments]);

  const handleCommentConfirm = async () => {
    if (!isLoggedIn) {
      showToast('로그인이 필요합니다.');
      setModalType('login');
      return;
    }
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/write_comment.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: post.id,
          writer: userName || '익명',
          user_id: userId,
          content: commentText
        })
      });
      const data = await res.json();
      if (data.success) {
        setCommentText('');
        fetchComments();
      }
    } catch (err) {
      console.error('댓글 등록 실패', err);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const url = isAdmin ? `${API_BASE}/admin_delete_comment.php` : `${API_BASE}/delete_comment.php`;
      const body = isAdmin ? { admin_id: userId, comment_id: commentId } : { id: commentId };
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) fetchComments();
    } catch (err) {
      console.error('댓글 삭제 실패', err);
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!isLoggedIn) {
      showToast('로그인이 필요합니다.');
      setModalType('login');
      return;
    }
    if (!replyText[commentId]?.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/write_reply.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment_id: commentId,
          post_id: post.id,
          content: replyText[commentId],
          user_id: userId
        })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText(prev => ({ ...prev, [commentId]: '' }));
        setReplyOpen(prev => ({ ...prev, [commentId]: false }));
        fetchComments();
        showToast('대댓글이 등록되었습니다.');
      }
    } catch (err) {
      console.error('대댓글 등록 실패', err);
    }
  };

  const handleDelete = () => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      onDelete(post.id);
    }
  };

  return (
    <div className="post-detail-container fade-in" style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px' }}>
      {/* 상단 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onBack} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#888', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <i className="ri-arrow-left-line"></i> 목록으로 돌아가기
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isMyPost && (
            <>
              <button onClick={onEdit} style={{ cursor: 'pointer', border: 'none', background: '#f0f4ef', color: '#4a6741', padding: '8px 15px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                <i className="ri-edit-line"></i> 수정하기
              </button>
              <button onClick={handleDelete} style={{ cursor: 'pointer', border: 'none', background: '#fff0f0', color: '#e74c3c', padding: '8px 15px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                <i className="ri-delete-bin-line"></i> 삭제하기
              </button>
            </>
          )}
        </div>
      </div>

      {/* 게시글 제목/내용 */}
      <div style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#333', marginBottom: '15px' }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: '15px', color: '#999', fontSize: '14px' }}>
          <span><i className="ri-user-line"></i> 익명</span>
          <span><i className="ri-time-line"></i> {post.created_at}</span>
        </div>
      </div>

      <div style={{ lineHeight: '1.8', color: '#444', fontSize: '16px', minHeight: '200px', marginBottom: '50px' }}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content || '내용이 없습니다.'}</p>
      </div>

      {/* 댓글 영역 */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>
          <i className="ri-chat-3-line"></i> 댓글 {comments.length}
        </h3>

        {/* 댓글 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
          {comments.length > 0 ? comments.map((comment) => (
            <div key={comment.id}>
              {/* 댓글 */}
              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '12px', position: 'relative' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>익명</div>
                <div style={{ fontSize: '15px', color: '#555', marginBottom: '5px' }}>{comment.content}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#bbb' }}>{comment.created_at?.slice(0, 16).replace('T', ' ')}</div>
                  <button
                    onClick={() => setReplyOpen(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                    style={{ background: 'none', border: 'none', color: '#999', fontSize: '12px', cursor: 'pointer', padding: '4px 0' }}
                  >
                    <i className="ri-reply-line"></i> 대댓글
                  </button>
                </div>
                {/* 댓글 삭제 버튼 */}
                {(isAdmin || (userId && comment.user_id && String(userId) === String(comment.user_id))) && (
                  <i
                    className="ri-close-line"
                    onClick={() => handleCommentDelete(comment.id)}
                    style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', color: '#ccc' }}
                  ></i>
                )}
              </div>

              {/* 대댓글 목록 */}
              {(replies[comment.id] || []).map(reply => (
                <div key={reply.id} style={{ backgroundColor: '#f0f4ef', padding: '12px 15px 12px 35px', borderRadius: '12px', marginTop: '8px', position: 'relative' }}>
                  <i className="ri-corner-down-right-line" style={{ position: 'absolute', left: '12px', top: '14px', color: '#aaa', fontSize: '14px' }}></i>
                  <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>익명</div>
                  <div style={{ fontSize: '14px', color: '#555', marginBottom: '4px' }}>{reply.content}</div>
                  <div style={{ fontSize: '12px', color: '#bbb' }}>{reply.created_at?.slice(0, 16).replace('T', ' ')}</div>
                </div>
              ))}

              {/* 대댓글 입력란 */}
              {replyOpen[comment.id] && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', paddingLeft: '20px' }}>
                  <input
                    type="text"
                    placeholder="대댓글을 입력하세요"
                    value={replyText[comment.id] || ''}
                    onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit(comment.id)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '13px' }}
                  />
                  <button
                    onClick={() => handleReplySubmit(comment.id)}
                    style={{ padding: '0 15px', backgroundColor: 'var(--color-point)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    등록
                  </button>
                  <button
                    onClick={() => setReplyOpen(prev => ({ ...prev, [comment.id]: false }))}
                    style={{ padding: '0 12px', backgroundColor: '#f0f0f0', color: '#999', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          )) : (
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
            onKeyPress={(e) => e.key === 'Enter' && handleCommentConfirm()}
            style={{ flex: 1, padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
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