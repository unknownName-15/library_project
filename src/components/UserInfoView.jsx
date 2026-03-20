import React, { useState, useEffect } from 'react';
import API_BASE from '../api/config';

const UserInfoView = ({ userId, userName, onNicknameChange, onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);

  // 닉네임 변경
  const [newNickname, setNewNickname] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // 비밀번호 변경
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // 회원 탈퇴
  const [deletePw, setDeletePw] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // 회원정보 불러오기
  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_user.php?user_id=${userId}`);
      const data = await res.json();
      if (data.success) {
        setUserInfo(data.user);
        setNewNickname(data.user.nickname);
        setNewEmail(data.user.email);
      }
    } catch (err) {
      showToast('회원정보를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    if (userId) fetchUserInfo();
  }, [userId]);

  // 닉네임 / 이메일 변경
  const handleUpdateUser = async () => {
    if (!newNickname || !newEmail) {
      showToast('닉네임과 이메일을 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/update_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, nickname: newNickname, email: newEmail })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        onNicknameChange(data.nickname); // 헤더 닉네임도 업데이트
        fetchUserInfo();
      } else {
        showToast(data.message);
      }
    } catch (err) {
      showToast('수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 변경
  const handleUpdatePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      showToast('모든 항목을 입력해주세요.');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/update_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, current_password: currentPw, new_password: newPw })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
      } else {
        showToast(data.message);
      }
    } catch (err) {
      showToast('비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 회원 탈퇴
  const handleDeleteUser = async () => {
    if (!deletePw) {
      showToast('비밀번호를 입력해주세요.');
      return;
    }
    if (!window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/delete_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password: deletePw })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        onLogout(); // 로그아웃 처리
      } else {
        showToast(data.message);
      }
    } catch (err) {
      showToast('회원 탈퇴에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="library-container fade-in">
      {toast && <div className="toast-container">{toast}</div>}

      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '30px' }}>회원 정보</h2>

      {/* 프로필 요약 */}
      {userInfo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'white', padding: '25px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-point)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            {userInfo.nickname.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{userInfo.nickname}</div>
            <div style={{ color: '#999', fontSize: '14px' }}>{userInfo.email}</div>
            <div style={{ color: '#bbb', fontSize: '12px', marginTop: '4px' }}>가입일: {userInfo.created_at?.slice(0, 10)}</div>
          </div>
        </div>
      )}

      {/* 닉네임 / 이메일 변경 */}
      <section className="library-section" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 className="board-title" style={{ marginBottom: '20px' }}>
          <i className="ri-user-settings-line"></i> 기본 정보 변경
        </h3>
        <div className="input-group">
          <label>닉네임</label>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="새 닉네임을 입력하세요"
          />
        </div>
        <div className="input-group">
          <label>이메일</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="새 이메일을 입력하세요"
          />
        </div>
        <button
          className="login-submit-btn"
          onClick={handleUpdateUser}
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? '처리 중...' : '변경 저장'}
        </button>
      </section>

      {/* 비밀번호 변경 */}
      <section className="library-section" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 className="board-title" style={{ marginBottom: '20px' }}>
          <i className="ri-lock-password-line"></i> 비밀번호 변경
        </h3>
        <div className="input-group">
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="현재 비밀번호를 입력하세요"
          />
        </div>
        <div className="input-group">
          <label>새 비밀번호</label>
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>
        <div className="input-group">
          <label>새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="새 비밀번호를 다시 입력하세요"
          />
        </div>
        <button
          className="login-submit-btn"
          onClick={handleUpdatePassword}
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? '처리 중...' : '비밀번호 변경'}
        </button>
      </section>

      {/* 회원 탈퇴 */}
      <section className="library-section" style={{ backgroundColor: '#fff8f8', padding: '30px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 className="board-title" style={{ marginBottom: '20px', color: '#e74c3c' }}>
          <i className="ri-user-unfollow-line"></i> 회원 탈퇴
        </h3>
        <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
          탈퇴 시 모든 데이터가 삭제되며 복구가 불가능합니다.
        </p>
        <div className="input-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={deletePw}
            onChange={(e) => setDeletePw(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <button
          onClick={handleDeleteUser}
          disabled={loading}
          style={{ marginTop: '10px', padding: '12px 25px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
        >
          {loading ? '처리 중...' : '회원 탈퇴'}
        </button>
      </section>
    </div>
  );
};

export default UserInfoView;