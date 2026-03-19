import React, { useState, useEffect } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import BookDetail from './components/BookDetail';
import CommunityBoard from './components/CommunityBoard';
import BoardList from './components/BoardList';
import PostDetail from './components/PostDetail'; // 1. 게시글 상세 컴포넌트 추가
import WriteModal from './components/WriteModal';
import EditModal from './components/EditModal'; // 수정 모달 추가

const BookCommunityApp = () => {
  const [view, setView] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  
  // --- 토스트 메시지 상태 추가 ---
  const [toast, setToast] = useState('');

  // --- 상태 관리: 선택된 게시판 및 게시글 저장 ---
  // type 필드를 추가하여 어떤 게시판에 글을 등록할지 구분합니다.
  const [selectedBoard, setSelectedBoard] = useState({ title: '', data: [], type: '' }); 
  const [selectedPost, setSelectedPost] = useState(null); // 2. 선택된 게시글 상태 추가

  // 애니메이션 클래스 제어
  const [slideAnimation, setSlideAnimation] = useState('slide-in');

  const [notifications, setNotifications] = useState([
    { id: 1, message: "'익명'님이 내 '데미안' 리뷰에 댓글을 남겼습니다.", time: "5분 전" },
    { id: 2, message: "신청하신 '주말 독서 토론' 모임이 승인되었습니다.", time: "2시간 전" },
    { id: 3, message: "'한강' 작가님의 신작 소식이 업데이트되었습니다.", time: "어제" }
  ]);

  const popularBooks = [
    { id: 1, title: "데미안", author: "헤르만 헤세" },
    { id: 2, title: "어린 왕자", author: "생텍쥐페리" },
    { id: 3, title: "월든", author: "헨리 데이의드 소로" },
    { id: 4, title: "인간 실격", author: "다자이 오사무" },
    { id: 5, title: "1984", author: "조지 오웰" },
    { id: 6, title: "참을 수 없는 존재의 가벼움", author: "밀란 쿤데라" },
    { id: 7, title: "이방인", author: "알베르 카뮈" },
    { id: 8, title: "그리스인 조르바", author: "니코스 카잔차키스" },
    { id: 9, title: "연금술사", author: "파울로 코엘료" }
  ];

  // --- 게시판 데이터를 상태(State)로 전환 (글 등록 시 화면 갱신을 위해) ---
  const [boardData, setBoardData] = useState({
    free: [
      { id: 1, title: "오늘 읽은 문장 공유해요", date: "10:25", content: "문장이 너무 아름답네요." },
      { id: 2, title: "다들 주말에 뭐 읽으시나요?", date: "09:12", content: "저는 고전을 다시 읽어보려 합니다." },
      { id: 3, title: "카페에서 책 읽기 좋은 곳 추천!", date: "어제", content: "조용한 카페 추천 부탁드려요." },
      { id: 4, title: "중고서점 다녀왔습니다 ㅎㅎ", date: "어제", content: "좋은 책을 많이 발견했습니다." }
    ],
    debate: [
      { id: 1, title: "[토론] 인공지능이 소설을 쓸 수 있을까?", date: "11:40", content: "창의성이란 무엇일까요?" },
      { id: 2, title: "고전 문학, 꼭 읽어야 할까요?", date: "08:30", content: "여러분의 의견이 궁금합니다." },
      { id: 3, title: "전자책 vs 종이책, 여러분의 선택은?", date: "어제", content: "휴대성이냐 질감이냐 그것이 문제로다." },
      { id: 4, title: "비극적인 결말에 대하여", date: "2일 전", content: "슬픈 결말이 더 기억에 남네요." }
    ],
    group: [
      { id: 1, title: "역삼역 근처 아침 독서 모임 모집", date: "12:00", content: "아침 시간을 활용해봐요." },
      { id: 2, title: "온라인 줌(Zoom) 야간 독서실 운영", date: "10:50", content: "밤에 같이 집중하실 분!" },
      { id: 3, title: "한 달 한 권 완독 챌린지 5기", date: "어제", content: "이번 기수도 화이팅입니다." },
      { id: 4, title: "철학 도서 같이 읽으실 분?", date: "어제", content: "어려운 책도 함께라면 가능해요." }
    ],
    recommend: [
      { id: 1, title: "인생을 바꾼 책 3권 추천합니다", date: "13:10", content: "제 삶의 이정표가 된 책들입니다." },
      { id: 2, title: "겨울밤에 읽기 좋은 포근한 소설", date: "11:20", content: "마음이 따뜻해지는 소설들." },
      { id: 3, title: "글쓰기 실력을 늘려주는 도서 목록", date: "어제", content: "문장력을 키우고 싶다면 추천합니다." },
      { id: 4, title: "선물하기 좋은 에세이 모음", date: "3일 전", content: "친구에게 선물하기 딱 좋아요." }
    ]
  });

  // --- 토스트 실행 함수 ---
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // --- 수정된 함수: 게시글 수정 완료 처리 ---
  const handleEditSubmit = (updatedPost) => {
    const boardType = selectedBoard.type;
    const updatedList = boardData[boardType].map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );

    const updatedBoardData = { ...boardData, [boardType]: updatedList };
    setBoardData(updatedBoardData);
    
    // 데이터 동기화
    setSelectedBoard({ ...selectedBoard, data: updatedList });
    setSelectedPost(updatedPost); 
    showToast('게시글이 수정되었습니다.');
  };

  // --- 추가된 함수: 게시글 삭제 처리 ---
  const handleDeletePost = (postId) => {
    const boardType = selectedBoard.type;
    const updatedList = boardData[boardType].filter(post => post.id !== postId);
    
    setBoardData({ ...boardData, [boardType]: updatedList });
    setSelectedBoard({ ...selectedBoard, data: updatedList });
    
    setView('board-detail'); // 삭제 후 목록으로 이동
    showToast('게시글이 삭제되었습니다.');
  };

  const itemsPerPage = 3;
  const totalPages = Math.ceil(popularBooks.length / itemsPerPage);
  const displayedBooks = popularBooks.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // --- 새 글 등록 처리 함수 ---
  const handleWriteSubmit = (newPost) => {
    const boardType = selectedBoard.type;
    const newId = Date.now(); // 겹치지 않는 고유 ID 생성
    const postWithId = { id: newId, ...newPost };

    const updatedBoardData = {
      ...boardData,
      [boardType]: [postWithId, ...boardData[boardType]]
    };

    setBoardData(updatedBoardData);
    setSelectedBoard({ ...selectedBoard, data: updatedBoardData[boardType] });
    showToast('글이 등록되었습니다!');
  };

  const handleBoardDetail = (type, title) => {
    setSelectedBoard({ type, title, data: boardData[type] });
    setView('board-detail');
  };

  // --- 3. 추가된 함수: 게시글 본문으로 이동 ---
  const handlePostDetail = (post) => {
    setSelectedPost(post);
    setView('post-detail');
  };

  const changePage = (direction) => {
    setSlideAnimation(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
    setTimeout(() => {
      setCurrentPage(prev => direction === 'next' ? prev + 1 : prev - 1);
      setSlideAnimation('slide-in');
    }, 400);
  };

  useEffect(() => {
    if (view !== 'main') return;
    const timer = setInterval(() => {
      if (currentPage === totalPages - 1) {
        setSlideAnimation('slide-out-left');
        setTimeout(() => { setCurrentPage(0); setSlideAnimation('slide-in'); }, 400);
      } else {
        changePage('next');
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [currentPage, view]);

  const handleLoginSuccess = (name) => {
    setUserName(name);
    setIsLoggedIn(true);
    setModalType(null);
    showToast(`${name}님, 환영합니다!`);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(noti => noti.id !== id));
  };

  const allRead = () => {
    setNotifications([]);
  };

  return (
    <div className="wrapper">
      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />

      {/* 상단 중앙 토스트 메시지 UI */}
      {toast && <div className="toast-container">{toast}</div>}

      <aside className="sidebar">
        <div className="logo" onClick={() => setView('main')} style={{ cursor: 'pointer' }}>
          <i className="ri-book-open-fill"></i> LIB.
        </div>
        <nav className="menu-list">
          <div className={`menu-item ${view === 'main' ? 'active' : ''}`} onClick={() => setView('main')}>
            <i className="ri-home-5-line"></i> 홈
          </div>
          <div className={`menu-item ${['community', 'board-detail', 'post-detail'].includes(view) ? 'active' : ''}`} onClick={() => setView('community')}>
            <i className="ri-community-line"></i> 커뮤니티
          </div>
          <div className="menu-item"><i className="ri-book-mark-line"></i> 내 서재</div>
          <div className="menu-item"><i className="ri-calendar-event-line"></i> 독서 모임</div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header-row">
          <div className="search-container">
            <i className="ri-search-line"></i>
            <input type="text" placeholder="어떤 책을 찾으시나요?" className="search-bar" />
          </div>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <i 
                className="ri-notification-3-line" 
                style={{ fontSize: '22px', cursor: 'pointer' }}
                onClick={() => { setIsNotiOpen(!isNotiOpen); setIsMenuOpen(false); }}
              ></i>
              {notifications.length > 0 && (
                <span style={{ position: 'absolute', top: '0px', right: '0px', width: '8px', height: '8px', backgroundColor: '#e74c3c', borderRadius: '50%', border: '2px solid #f4f4f4' }}></span>
              )}
              
              {isNotiOpen && (
                <div className="noti-dropdown">
                  <div className="noti-header">
                    <span>알림 {notifications.length}</span>
                    {notifications.length > 0 && <span className="all-read-btn" onClick={allRead}>모두 읽음</span>}
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((noti) => (
                      <div key={noti.id} className="noti-item" onClick={() => deleteNotification(noti.id)}>
                        <div className="noti-item-title">{noti.message}</div>
                        <div className="noti-item-time">{noti.time}</div>
                      </div>
                    ))
                  ) : (
                    <div className="noti-empty">새로운 알림이 없습니다. ✨</div>
                  )}
                </div>
              )}
            </div>

            <div className="profile-wrapper">
              {isLoggedIn ? (
                <>
                  <div className="profile-circle" onClick={() => { setIsMenuOpen(!isMenuOpen); setIsNotiOpen(false); }}>
                    {userName ? userName.charAt(0) : '김'}
                  </div>
                  {isMenuOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-item" style={{fontWeight: 'bold', borderBottom: '1px solid #eee'}}>{userName}님</div>
                      <div className="dropdown-item">회원 정보</div>
                      <div className="dropdown-item logout" style={{ color: 'var(--color-point)', fontWeight: 'bold' }} onClick={() => { setIsLoggedIn(false); setIsMenuOpen(false); }}>로그아웃</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="login-icon-button" onClick={() => setModalType('login')}>
                  <i className="ri-user-line"></i>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- 메인 홈 화면 --- */}
        {view === 'main' && (
          <div className="fade-in">
            <section className="featured-card">
              <div style={{ maxWidth: '60%' }}>
                <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px' }}>Editor's Pick</span>
                <h2 style={{ fontSize: '38px', margin: '20px 0' }}>작별하지 않는다</h2>
                <p style={{ lineHeight: '1.8', opacity: 0.9, fontSize: '16px' }}>
                  한강 작가가 들려주는 지극한 사랑에 관한 이야기.<br/>
                  함께 읽고, 서로의 마음을 나누는 독서 토론에 참여하세요.
                </p>
                <button onClick={() => setView('detail')} style={{ marginTop: '30px', padding: '15px 30px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--color-accent)', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                  모임 상세보기
                </button>
              </div>
              <div className="book-image-placeholder"><i className="ri-book-3-line" style={{ fontSize: '50px' }}></i></div>
            </section>

            <section>
              <div className="section-header">
                <h3 className="section-title" style={{margin: 0}}>
                  <i className="ri-fire-line" style={{ color: 'var(--color-accent)' }}></i> 지금 인기 있는 책
                </h3>
                <div className="slide-controls">
                  <button className="slide-btn" onClick={() => changePage('prev')} disabled={currentPage === 0}>
                    <i className="ri-arrow-left-s-line"></i>
                  </button>
                  <button className="slide-btn" onClick={() => changePage('next')} disabled={currentPage === totalPages - 1}>
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              </div>
              <div className={`book-grid ${slideAnimation}`}>
                {displayedBooks.map((book) => (
                  <div key={book.id} className="book-card">
                    <div className="card-img"><i className="ri-image-line" style={{ color: '#ddd', fontSize: '30px' }}></i></div>
                    <div style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '5px' }}>{book.title}</div>
                    <div style={{ color: 'var(--color-accent)', fontSize: '14px' }}>{book.author}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* --- 커뮤니티 화면 --- */}
        {view === 'community' && (
          <div className="fade-in">
            <h2 className="section-title" style={{fontSize: '24px', marginBottom: '30px'}}>커뮤니티 광장</h2>
            <div className="community-grid">
              <CommunityBoard title="자유게시판" icon="ri-chat-3-line" data={boardData.free} onMoreClick={() => handleBoardDetail('free', '자유게시판')} />
              <CommunityBoard title="토론게시판" icon="ri-discuss-line" data={boardData.debate} onMoreClick={() => handleBoardDetail('debate', '토론게시판')} />
              <CommunityBoard title="모임게시판" icon="ri-team-line" data={boardData.group} onMoreClick={() => handleBoardDetail('group', '모임게시판')} />
              <CommunityBoard title="추천게시판" icon="ri-thumb-up-line" data={boardData.recommend} onMoreClick={() => handleBoardDetail('recommend', '추천게시판')} />
            </div>
          </div>
        )}

        {/* --- 게시판 상세 리스트 화면 --- */}
        {view === 'board-detail' && (
          <BoardList 
            title={selectedBoard.title} 
            posts={selectedBoard.data} 
            onBack={() => setView('community')} 
            onPostClick={handlePostDetail} 
            onWriteClick={() => setModalType('write')} 
          />
        )}

        {/* --- 게시글 본문 화면 --- */}
        {view === 'post-detail' && (
          <PostDetail 
            post={selectedPost} 
            onBack={() => setView('board-detail')}
            onDelete={handleDeletePost}
            onEdit={() => setModalType('edit')} // 수정 모달 열기 연결
          />
        )}

        {/* --- 책 상세 페이지 화면 --- */}
        {view === 'detail' && <BookDetail onBack={() => setView('main')} />}
        
      </main>

      {/* 모달 영역 */}
      {modalType === 'login' && <LoginModal onClose={() => setModalType(null)} onLoginSuccess={handleLoginSuccess} onShowSignup={() => setModalType('signup')} />}
      {modalType === 'signup' && <SignupModal onClose={() => setModalType(null)} onShowLogin={() => setModalType('login')} />}
      
      {modalType === 'write' && <WriteModal boardTitle={selectedBoard.title} onClose={() => setModalType(null)} onSubmit={handleWriteSubmit} />}
      
      {/* 수정 모달 렌더링 */}
      {modalType === 'edit' && (
        <EditModal 
          post={selectedPost}
          onClose={() => setModalType(null)} 
          onSubmit={handleEditSubmit} 
        />
      )}
    </div>
  );
};

export default BookCommunityApp;