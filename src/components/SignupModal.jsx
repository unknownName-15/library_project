import React from 'react';

const SignupModal = ({ onClose, onShowLogin }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <i className="ri-close-line modal-close" onClick={onClose}></i>
        <h2 className="modal-title">환영합니다!</h2>
        
        <div className="input-group">
          <label>닉네임</label>
          <input type="text" placeholder="사용하실 닉네임을 입력하세요" />
        </div>

        <div className="input-group">
          <label>이메일 주소</label>
          <input type="email" placeholder="example@book.com" />
        </div>
        
        <div className="input-group">
          <label>비밀번호</label>
          <input type="password" placeholder="비밀번호를 입력하세요" />
        </div>
        
        <button className="login-submit-btn" onClick={() => {
          alert('회원가입이 완료되었습니다! 로그인해 주세요.');
          onShowLogin(); // 회원가입 후 로그인 창으로 이동
        }}>
          회원가입 완료
        </button>
        
        <p className="signup-link">
          이미 회원이신가요? <span onClick={onShowLogin}>로그인</span>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;