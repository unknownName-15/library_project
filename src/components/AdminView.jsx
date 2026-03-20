import React, { useState, useEffect } from 'react';
import API_BASE from '../api/config';

const AdminView = ({ userId }) => {
  const [members, setMembers] = useState([]);
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_members.php?user_id=${userId}`);
      const data = await res.json();
      if (data.success) {
        setMembers(data.members);
      } else {
        showToast(data.message);
      }
    } catch (err) {
      showToast('회원 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDeleteUser = async (targetId, nickname) => {
    if (!window.confirm(`'${nickname}'님을 강제 탈퇴 처리하시겠습니까?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin_delete_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: userId, target_id: targetId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchMembers();
      } else {
        showToast(data.message);
      }
    } catch (err) {
      showToast('강제 탈퇴에 실패했습니다.');
    }
  };

  return (
    <div className="library-container fade-in">
      {toast && <div className="toast-container">{toast}</div>}

      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '30px' }}>
        <i className="ri-shield-user-line"></i> 관리자 페이지
      </h2>

      {/* 회원 목록 */}
      <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 className="board-title" style={{ marginBottom: '20px' }}>
          <i className="ri-group-line"></i> 회원 목록 ({members.length})
        </h3>
        <div style={{ borderTop: '2px solid var(--color-point)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9f7' }}>
                <th style={{ padding: '15px', color: '#666', textAlign: 'center' }}>ID</th>
                <th style={{ padding: '15px', color: '#666', textAlign: 'left' }}>닉네임</th>
                <th style={{ padding: '15px', color: '#666', textAlign: 'left' }}>이메일</th>
                <th style={{ padding: '15px', color: '#666', textAlign: 'center' }}>등급</th>
                <th style={{ padding: '15px', color: '#666', textAlign: 'center' }}>가입일</th>
                <th style={{ padding: '15px', color: '#666', textAlign: 'center' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid #f4f4f4' }}>
                  <td style={{ padding: '15px', textAlign: 'center', color: '#999' }}>{member.id}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{member.nickname}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{member.email}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {member.is_admin === 1 ? (
                      <span style={{ backgroundColor: 'var(--color-point)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>관리자</span>
                    ) : (
                      <span style={{ backgroundColor: '#f0f0f0', color: '#999', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>일반</span>
                    )}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center', color: '#999', fontSize: '13px' }}>{member.created_at?.slice(0, 10)}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    {member.is_admin !== 1 && (
                      <button
                        onClick={() => handleDeleteUser(member.id, member.nickname)}
                        style={{ padding: '6px 14px', backgroundColor: '#fff0f0', color: '#e74c3c', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        강제 탈퇴
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminView;