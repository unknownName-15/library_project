import React, { useState } from 'react';

const EditModal = ({ onClose, onSubmit, post }) => {
  // post 데이터가 없을 경우를 대비해 초기값 설정
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');

  const handleConfirm = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요!');
      return;
    }
    // 부모의 handleEditSubmit 함수로 데이터 전달
    onSubmit({ ...post, title, content }); 
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '500px' }}>
        <i className="ri-close-line modal-close" onClick={onClose}></i>
        <h2 className="modal-title">게시글 수정</h2>
        
        <div className="input-group">
          <label>제목</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>내용</label>
          <textarea 
            style={{ width: '100%', height: '150px', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', resize: 'none' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        
        <button className="login-submit-btn" onClick={handleConfirm}>수정완료</button>
      </div>
    </div>
  );
};

export default EditModal;