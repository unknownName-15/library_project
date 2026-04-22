import React, { useState } from 'react';

const SignupModal = ({ onClose, onShowLogin }) => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!nickname || !email || !password) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://keepinsight.dothome.co.kr/api1/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, email, password })
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        onShowLogin(); // 회원가입 후 로그인 창으로 이동
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
        <h2 className="modal-title">환영합니다!</h2>

        <div className="input-group">
          <label>닉네임</label>
          <input
            type="text"
            placeholder="사용하실 닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>이메일 주소</label>
          <input
            type="email"
            placeholder="example@book.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="login-submit-btn"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? '처리 중...' : '회원가입 완료'}
        </button>

        <p className="signup-link">
          이미 회원이신가요? <span onClick={onShowLogin} style={{ cursor: 'pointer' }}>로그인</span>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;