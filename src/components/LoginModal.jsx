import React, { useState } from 'react';

const LoginModal = ({ onClose, onLoginSuccess, onShowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 비밀번호 보이기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    const extractedNickname = email.split('@')[0];
    onLoginSuccess(extractedNickname);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <i className="ri-close-line modal-close" onClick={onClose}></i>
        <h2 className="modal-title">로그인</h2>
        
        <div className="input-group">
          <label>이메일 주소</label>
          <input 
            type="email" 
            placeholder="example@book.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group" style={{ position: 'relative' }}>
          <label>비밀번호</label>
          <input 
            // showPassword 상태에 따라 type이 변함
            type={showPassword ? "text" : "password"} 
            placeholder="비밀번호를 입력하세요" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: '45px' }}
          />
          
          {/* 눈 아이콘 버튼 */}
          <i 
            className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '15px',
              top: '38px', 
              cursor: 'pointer',
              color: '#999',
              fontSize: '20px'
            }}
          ></i>
        </div>
        
        <button className="login-submit-btn" onClick={handleLoginSubmit}>
          확인
        </button>
        
        <p className="signup-link">
          아직 회원이 아니신가요? <span onClick={onShowSignup} style={{cursor: 'pointer'}}>회원가입</span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;