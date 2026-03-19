import React, { useState, useEffect } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import BookDetail from './components/BookDetail';
import BoardList from './components/BoardList';
import PostDetail from './components/PostDetail';
import WriteModal from './components/WriteModal';
import EditModal from './components/EditModal';
import HomeView from './components/HomeView';
import CommunityView from './components/CommunityView';
import Sidebar from './components/SideBar';
import Header from './components/Header';
import MyLibraryView from './components/MyLibraryView';
import GroupView from './components/GroupView';

const BookCommunityApp = () => {
  const [view, setView] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [userName, setUserName] = useState('');
  const [toast, setToast] = useState('');

  // --- 검색 및 서재 관련 상태 ---
  const [myBooks, setMyBooks] = useState([]); // 내 서재 전체 데이터
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색 결과창 노출 여부

  const [selectedBoard, setSelectedBoard] = useState({ title: '', data: [], type: '' }); 
  const [selectedPost, setSelectedPost] = useState(null);

  const [wishList, setWishList] = useState([]); // 읽고 싶은 책
  const [myList, setMyList] = useState([]);     // 읽은 책

  // --- 신청한 모임 관련 상태 ---
  const [joinedGroups, setJoinedGroups] = useState([]); // 내가 신청한 모임 리스트

  const [notifications, setNotifications] = useState([
    { id: 1, message: "'익명'님이 내 '데미안' 리뷰에 댓글을 남겼습니다.", time: "5분 전" },
    { id: 2, message: "신청하신 '주말 독서 토론' 모임이 승인되었습니다.", time: "2시간 전" },
    { id: 3, message: "'한강' 작가님의 신작 소식이 업데이트되었습니다.", time: "어제" }
  ]);

  // 전체 도서 데이터 (검색 및 메인 노출용)
  const allBooks = [
    { id: 1, title: "데미안", author: "헤르만 헤세" },
    { id: 2, title: "어린 왕자", author: "생텍쥐페리" },
    { id: 3, title: "월든", author: "헨리 데이비드 소로" },
    { id: 4, title: "인간 실격", author: "다자이 오사무" },
    { id: 5, title: "1984", author: "조지 오웰" },
    { id: 6, title: "참을 수 없는 존재의 가벼움", author: "밀란 쿤데라" },
    { id: 7, title: "이방인", author: "알베르 카뮈" },
    { id: 8, title: "그리스인 조르바", author: "니코스 카잔차키스" },
    { id: 9, title: "연금술사", author: "파울로 코엘료" }
  ];

  const [boardData, setBoardData] = useState({
    free: [{ id: 1, title: "오늘 읽은 문장 공유해요", date: "10:25", content: "문장이 참 좋네요.", comments: [] }],
    debate: [{ id: 1, title: "[토론] 인공지능이 소설을 쓸 수 있을까?", date: "11:40", content: "창의성이란 무엇일까요?", comments: [] }],
    group: [{ id: 1, title: "역삼역 근처 아침 독서 모임 모집", date: "12:00", content: "아침 시간을 활용해요.", comments: [] }],
    recommend: [{ id: 1, title: "인생을 바꾼 책 3권 추천합니다", date: "13:10", content: "인생 책들입니다.", comments: [] }]
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // --- 서재에 책 추가 함수 ---
  const addToMyLibrary = (book, type) => {
    if (type === 'wish') {
      if (wishList.find(b => b.id === book.id)) {
        showToast('이미 위시리스트에 있는 책입니다.');
        return;
      }
      setWishList([...wishList, book]);
      showToast(`'${book.title}'이(가) 위시리스트에 추가되었습니다.`);
    } else if (type === 'read') {
      if (myList.find(b => b.id === book.id)) {
        showToast('이미 마이리스트에 있는 책입니다.');
        return;
      }
      setMyList([...myList, book]);
      showToast(`'${book.title}'이(가) 마이리스트에 추가되었습니다.`);
    }
    
    if (!myBooks.find(b => b.id === book.id)) {
      setMyBooks([...myBooks, book]);
    }
    
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // --- 서재에서 책 삭제 ---
  const removeFromLibrary = (bookId, type) => {
    if (type === 'wish') {
      setWishList(wishList.filter(book => book.id !== bookId));
      showToast('위시리스트에서 삭제되었습니다.');
    } else if (type === 'read') {
      setMyList(myList.filter(book => book.id !== bookId));
      showToast('마이리스트에서 삭제되었습니다.');
    }
  };

  // --- 독서 모임 신청 ---
  const joinGroup = (group) => {
    if (joinedGroups.find(g => g.id === group.id)) {
      showToast('이미 신청한 모임입니다.');
      return;
    }
    setJoinedGroups([...joinedGroups, group]);
    showToast(`'${group.title}' 모임 신청이 완료되었습니다!`);
  };

  // --- 독서 모임 취소 ---
  const leaveGroup = (groupId) => {
    setJoinedGroups(joinedGroups.filter(g => g.id !== groupId));
    showToast('모임 신청이 취소되었습니다.');
  };

  const handleEditSubmit = (updatedPost) => {
    const boardType = selectedBoard.type;
    const updatedList = boardData[boardType].map(post => post.id === updatedPost.id ? updatedPost : post);
    setBoardData({ ...boardData, [boardType]: updatedList });
    setSelectedBoard({ ...selectedBoard, data: updatedList });
    setSelectedPost(updatedPost); 
    showToast('게시글이 수정되었습니다.');
  };

  const handleDeletePost = (postId) => {
    const boardType = selectedBoard.type;
    const updatedList = boardData[boardType].filter(post => post.id !== postId);
    setBoardData({ ...boardData, [boardType]: updatedList });
    setSelectedBoard({ ...selectedBoard, data: updatedList });
    setView('board-detail');
    showToast('게시글이 삭제되었습니다.');
  };

  const handleCommentSubmit = (postId, commentText) => {
    const boardType = selectedBoard.type;
    const newComment = { id: Date.now(), writer: userName || '익명 사용자', text: commentText, date: new Date().toLocaleDateString() };
    const updatedList = boardData[boardType].map(post => {
      if (post.id === postId) return { ...post, comments: [...(post.comments || []), newComment] };
      return post;
    });
    setBoardData({ ...boardData, [boardType]: updatedList });
    setSelectedBoard({ ...selectedBoard, data: updatedList });
    setSelectedPost(updatedList.find(p => p.id === postId));
    showToast('댓글이 등록되었습니다.');
  };

  const handleCommentDelete = (postId, commentId) => {
    const boardType = selectedBoard.type;
    const updatedList = boardData[boardType].map(post => {
      if (post.id === postId) return { ...post, comments: post.comments.filter(c => c.id !== commentId) };
      return post;
    });
    setBoardData({ ...boardData, [boardType]: updatedList });
    setSelectedBoard({ ...selectedBoard, data: updatedList });
    setSelectedPost(updatedList.find(p => p.id === postId));
    showToast('댓글이 삭제되었습니다.');
  };

  const handleWriteSubmit = (newPost) => {
    const boardType = selectedBoard.type;
    const postWithId = { id: Date.now(), ...newPost, comments: [] };
    const updatedBoardData = { ...boardData, [boardType]: [postWithId, ...boardData[boardType]] };
    setBoardData(updatedBoardData);
    setSelectedBoard({ ...selectedBoard, data: updatedBoardData[boardType] });
    showToast('글이 등록되었습니다!');
  };

  const handleBoardDetail = (type, title) => {
    setSelectedBoard({ type, title, data: boardData[type] });
    setView('board-detail');
  };

  const handlePostDetail = (post) => {
    setSelectedPost(post);
    setView('post-detail');
  };

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
    <div className="wrapper" onClick={() => setIsSearchOpen(false)}>
      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
      {toast && <div className="toast-container">{toast}</div>}

      <Sidebar view={view} setView={setView} />

      <main className="main-content">
        <Header 
          isLoggedIn={isLoggedIn} 
          userName={userName} 
          notifications={notifications}
          isNotiOpen={isNotiOpen}
          setIsNotiOpen={setIsNotiOpen}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          setModalType={setModalType}
          setIsLoggedIn={setIsLoggedIn}
          deleteNotification={deleteNotification}
          allRead={allRead}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          allBooks={allBooks}
          onAddBook={addToMyLibrary}
        />

        {view === 'main' && <HomeView popularBooks={allBooks} setView={setView} />}
        {view === 'community' && <CommunityView boardData={boardData} handleBoardDetail={handleBoardDetail} />}
        {view === 'board-detail' && <BoardList title={selectedBoard.title} posts={selectedBoard.data} onBack={() => setView('community')} onPostClick={handlePostDetail} onWriteClick={() => setModalType('write')} />}
        {view === 'post-detail' && <PostDetail post={selectedPost} onBack={() => setView('board-detail')} onDelete={handleDeletePost} onEdit={() => setModalType('edit')} onCommentSubmit={handleCommentSubmit} onCommentDelete={handleCommentDelete} />}
        {view === 'detail' && <BookDetail onBack={() => setView('main')} onJoin={joinGroup} />}
        
        {/* 내 서재 화면 */}
        {view === 'library' && (
          <MyLibraryView 
            wishList={wishList} 
            myList={myList} 
            joinedGroups={joinedGroups} 
            onRemove={removeFromLibrary} 
            onLeaveGroup={leaveGroup}
          />
        )}

        {/* 독서 모임 화면 */}
        {view === 'group' && <GroupView onJoin={joinGroup} />}
          
      </main>

      {modalType === 'login' && <LoginModal onClose={() => setModalType(null)} onLoginSuccess={handleLoginSuccess} onShowSignup={() => setModalType('signup')} />}
      {modalType === 'signup' && <SignupModal onClose={() => setModalType(null)} onShowLogin={() => setModalType('login')} />}
      {modalType === 'write' && <WriteModal boardTitle={selectedBoard.title} onClose={() => setModalType(null)} onSubmit={handleWriteSubmit} />}
      {modalType === 'edit' && <EditModal post={selectedPost} onClose={() => setModalType(null)} onSubmit={handleEditSubmit} />}
    </div>
  );
};

export default BookCommunityApp;