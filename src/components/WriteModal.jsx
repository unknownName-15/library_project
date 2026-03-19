import React, { useState } from 'react';

const WriteModal = ({ onClose, onSubmit, boardTitle }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleConfirm = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요!');
      return;
    }
    // 부모에게 새 글 데이터 전달
    onSubmit({ title, content, date: new Date().toLocaleDateString() });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '500px' }}>
        <i className="ri-close-line modal-close" onClick={onClose}></i>
        <h2 className="modal-title">{boardTitle} 글쓰기</h2>
        
        <div className="input-group">
          <label>제목</label>
          <input 
            type="text" 
            placeholder="제목을 입력하세요" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>내용</label>
          <textarea 
            placeholder="내용을 입력하세요" 
            style={{ width: '100%', height: '150px', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', resize: 'none' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        
        <button className="login-submit-btn" onClick={handleConfirm}>등록하기</button>
      </div>
    </div>
  );
};

export default WriteModal;