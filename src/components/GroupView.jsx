import React from 'react';

// App.jsx로부터 onJoin 함수를 받아옴 (showToast는 App.jsx의 joinGroup 함수 내에서 처리됨)
const GroupView = ({ onJoin }) => {
  const activeGroups = [
    { id: 1, title: "주말 아침, 헤르만 헤세 읽기", date: "매주 토요일 오전 10시", member: "4/6", tag: "강남/오프라인", color: "#fdf8f3" },
    { id: 2, title: "퇴근 후 30분 온라인 완독 챌린지", date: "평일 오후 9시", member: "12/20", tag: "온라인/줌", color: "#f3f8fd" },
  ];

  const closedGroups = [
    { id: 3, title: "SF 소설의 밤: 테드 창 특집", date: "2026.03.10 종료", location: "홍대 인근" },
    { id: 4, title: "초보자를 위한 리액트 공부 모임", date: "2026.03.05 종료", location: "온라인" },
    { id: 5, title: "한강 작가 '작별하지 않는다' 토론", date: "2025.02.28 종료", location: "강남역" },
  ];

  // 함수 이름을 handleJoinClick으로 유지하며 App.jsx로부터 받은 onJoin을 실행함
  const handleJoinClick = (group) => {
    if (onJoin) {
      onJoin(group); // 데이터를 App.jsx로 보냄
    } else {
      // props가 안 왔을 때를 대비한 기본 알림
      alert(`'${group.title}' 모임에 신청되었습니다!`);
    }
  };

  return (
    <div className="group-container fade-in">
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '30px' }}>독서 모임</h2>

      <section style={{ marginBottom: '50px' }}>
        <h3 className="board-title" style={{ marginBottom: '20px' }}>
          <i className="ri-fire-line" style={{ color: '#e74c3c' }}></i> 현재 모집 중인 모임
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
          {activeGroups.map(group => (
            <div key={group.id} className="active-group-card" style={{ backgroundColor: group.color }}>
              <div className="group-tag">{group.tag}</div>
              <h4 className="group-title">{group.title}</h4>
              <div className="group-info">
                <span><i className="ri-calendar-line"></i> {group.date}</span>
                <span><i className="ri-user-line"></i> {group.member}명 참여 중</span>
              </div>
              <button 
                className="join-btn" 
                onClick={() => handleJoinClick(group)}
              >
                참여 신청하기
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="board-title" style={{ marginBottom: '20px', color: '#999' }}>모집 종료된 모임</h3>
        <div className="closed-group-list">
          {closedGroups.map(group => (
            <div key={group.id} className="closed-item">
              <span className="closed-status">종료</span>
              <span className="closed-title">{group.title}</span>
              <span className="closed-date">{group.date}</span>
              <span className="closed-loc">{group.location}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GroupView;