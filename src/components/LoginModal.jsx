import React, { useState } from 'react';

const LoginModal = ({ onClose, onLoginSuccess, onShowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://keepinsight.dothome.co.kr/api1/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        console.log('is_admin 값:', data.is_admin);
        console.log('is_admin 타입:', typeof data.is_admin);
        onLoginSuccess(data.nickname, data.id, data.is_admin);
        onClose();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
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
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            style={{ paddingRight: '45px' }}
          />
          <i
            className={showPassword ? 'ri-eye-line' : 'ri-eye-off-line'}
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '15px', top: '38px', cursor: 'pointer', color: '#999', fontSize: '20px' }}
          ></i>
        </div>

        <button
          className="login-submit-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '로그인 중...' : '확인'}
        </button>

        <p className="signup-link">
          아직 회원이 아니신가요? <span onClick={onShowSignup} style={{ cursor: 'pointer' }}>회원가입</span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;