import React, { useState, useEffect } from 'react';
import './App.css';
import API_BASE from './api/config';
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
import UserInfoView from './components/UserInfoView';
import AdminView from './components/AdminView';

const BookCommunityApp = () => {
  const [view, setView] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('userId'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null);
  const [toast, setToast] = useState('');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === '1');

  const [myBooks, setMyBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState({ title: '', data: [], type: '' });
  const [selectedPost, setSelectedPost] = useState(null);
  const [wishList, setWishList] = useState([]);
  const [myList, setMyList] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "'익명'님이 내 '데미안' 리뷰에 댓글을 남겼습니다.", time: "5분 전" },
    { id: 2, message: "신청하신 '주말 독서 토론' 모임이 승인되었습니다.", time: "2시간 전" },
    { id: 3, message: "'한강' 작가님의 신작 소식이 업데이트되었습니다.", time: "어제" }
  ]);

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

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // --- 게시판 불러오기 ---
  const fetchPosts = async (type) => {
    try {
      const res = await fetch(`${API_BASE}/get_posts.php?board_type=${type}`);
      const data = await res.json();
      if (data.success) {
        return data.posts.map(post => ({
          ...post,
          comments: []
        }));
      }
    } catch (err) {
      showToast('게시글을 불러오지 못했습니다.');
    }
    return [];
  };

  const handleBoardDetail = async (type, title) => {
    const posts = await fetchPosts(type);
    setSelectedBoard({ type, title, data: posts });
    setView('board-detail');
  };

  // --- 글쓰기 ---
  const handleWriteSubmit = async (newPost) => {
    console.log('writer 확인:', userName); // 이 줄 추가!
    try {
      const res = await fetch(`${API_BASE}/write_post.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_type: selectedBoard.type,
          title: newPost.title,
          content: newPost.content,
          writer: userName || '익명',
          user_id: userId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('글이 등록되었습니다!');
        const posts = await fetchPosts(selectedBoard.type);
        setSelectedBoard(prev => ({ ...prev, data: posts }));
      } else {
        showToast(data.message);
      }
    } catch (err) {
      showToast('글 등록에 실패했습니다.');
    }
  };

  // --- 글 수정 ---
  const handleEditSubmit = async (updatedPost) => {
    try {
      const res = await fetch(`${API_BASE}/edit_post.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedPost.id,
          title: updatedPost.title,
          content: updatedPost.content
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('게시글이 수정되었습니다.');
        const posts = await fetchPosts(selectedBoard.type);
        setSelectedBoard(prev => ({ ...prev, data: posts }));
        setSelectedPost(updatedPost);
      } else {
        showToast(data.message);
      }
    } catch (err) {
      showToast('수정에 실패했습니다.');
    }
  };

  // --- 글 삭제 ---
  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`${API_BASE}/delete_post.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('게시글이 삭제되었습니다.');
        const posts = await fetchPosts(selectedBoard.type);
        setSelectedBoard(prev => ({ ...prev, data: posts }));
        setView('board-detail');
      } else {
        showToast(data.message);
      }
    } catch (err) {
      showToast('삭제에 실패했습니다.');
    }
  };

  const handlePostDetail = (post) => {
    setSelectedPost(post);
    setView('post-detail');
  };

  const handleLoginSuccess = (name, id, isAdmin) => {
  setUserName(name);
  setUserId(id);
  setIsAdmin(isAdmin == 1);  // === 대신 == 으로 변경 (타입 무시하고 비교)
  setIsLoggedIn(true);
  setModalType(null);
  localStorage.setItem('userName', name);
  localStorage.setItem('userId', id);
  localStorage.setItem('isAdmin', isAdmin == 1 ? '1' : '0');
  showToast(`${name}님, 환영합니다!`);
};

  const handleNicknameChange = (newNickname) => {
    setUserName(newNickname);
  };

  // --- 서재 관련 (기존 유지) ---
  const addToMyLibrary = (book, type) => {
    if (type === 'wish') {
      if (wishList.find(b => b.id === book.id)) { showToast('이미 위시리스트에 있는 책입니다.'); return; }
      setWishList([...wishList, book]);
      showToast(`'${book.title}'이(가) 위시리스트에 추가되었습니다.`);
    } else if (type === 'read') {
      if (myList.find(b => b.id === book.id)) { showToast('이미 마이리스트에 있는 책입니다.'); return; }
      setMyList([...myList, book]);
      showToast(`'${book.title}'이(가) 마이리스트에 추가되었습니다.`);
    }
    if (!myBooks.find(b => b.id === book.id)) setMyBooks([...myBooks, book]);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const removeFromLibrary = (bookId, type) => {
    if (type === 'wish') { setWishList(wishList.filter(b => b.id !== bookId)); showToast('위시리스트에서 삭제되었습니다.'); }
    else if (type === 'read') { setMyList(myList.filter(b => b.id !== bookId)); showToast('마이리스트에서 삭제되었습니다.'); }
  };

  const joinGroup = (group) => {
    if (joinedGroups.find(g => g.id === group.id)) { showToast('이미 신청한 모임입니다.'); return; }
    setJoinedGroups([...joinedGroups, group]);
    showToast(`'${group.title}' 모임 신청이 완료되었습니다!`);
  };

  const leaveGroup = (groupId) => {
    setJoinedGroups(joinedGroups.filter(g => g.id !== groupId));
    showToast('모임 신청이 취소되었습니다.');
  };

  const handleCommentSubmit = (postId, commentText) => {
    const newComment = { id: Date.now(), writer: userName || '익명 사용자', text: commentText, date: new Date().toLocaleDateString() };
    const updatedData = selectedBoard.data.map(post => {
      if (post.id === postId) return { ...post, comments: [...(post.comments || []), newComment] };
      return post;
    });
    setSelectedBoard(prev => ({ ...prev, data: updatedData }));
    setSelectedPost(updatedData.find(p => p.id === postId));
    showToast('댓글이 등록되었습니다.');
  };

  const handleCommentDelete = (postId, commentId) => {
    const updatedData = selectedBoard.data.map(post => {
      if (post.id === postId) return { ...post, comments: post.comments.filter(c => c.id !== commentId) };
      return post;
    });
    setSelectedBoard(prev => ({ ...prev, data: updatedData }));
    setSelectedPost(updatedData.find(p => p.id === postId));
    showToast('댓글이 삭제되었습니다.');
  };

  const deleteNotification = (id) => setNotifications(notifications.filter(n => n.id !== id));
  const allRead = () => setNotifications([]);

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
          setView={setView}
          setUserName={setUserName}
          setUserId={setUserId}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
        />

        {view === 'main' && <HomeView popularBooks={allBooks} setView={setView} />}
        {view === 'community' && <CommunityView boardData={null} handleBoardDetail={handleBoardDetail} />}
        {view === 'board-detail' && (
          <BoardList
            title={selectedBoard.title}
            posts={selectedBoard.data}
            onBack={() => setView('community')}
            onPostClick={handlePostDetail}
            onWriteClick={() => {
              if (!isLoggedIn) {
                showToast('로그인이 필요합니다.');
                setModalType('login');
                return;
              }
              setModalType('write');
            }}
          />
        )}
        {view === 'post-detail' && (
  <PostDetail
    post={selectedPost}
    onBack={() => setView('board-detail')}
    onDelete={handleDeletePost}
    onEdit={() => {
      if (!isLoggedIn) {
        showToast('로그인이 필요합니다.');
        setModalType('login');
        return;
      }
      setModalType('edit');
    }}
    onCommentSubmit={handleCommentSubmit}
    onCommentDelete={handleCommentDelete}
    isLoggedIn={isLoggedIn}
    setModalType={setModalType}
    showToast={showToast}
    userId={userId}
    userName={userName}
    isAdmin={isAdmin}
  />
)}
        {view === 'detail' && <BookDetail onBack={() => setView('main')} onJoin={joinGroup} />}
        {view === 'library' && <MyLibraryView wishList={wishList} myList={myList} joinedGroups={joinedGroups} onRemove={removeFromLibrary} onLeaveGroup={leaveGroup} />}
        {view === 'group' && <GroupView onJoin={joinGroup} />}
        {view === 'userinfo' && (
          <UserInfoView
            userId={userId}
            userName={userName}
            onNicknameChange={handleNicknameChange}
            onLogout={() => { setIsLoggedIn(false); setUserName(''); setUserId(null); setIsAdmin(false); setView('main'); localStorage.removeItem('userName'); localStorage.removeItem('userId'); localStorage.removeItem('isAdmin'); }}
          />
        )}
        {view === 'admin' && <AdminView userId={userId} />}
      </main>

      {modalType === 'login' && <LoginModal onClose={() => setModalType(null)} onLoginSuccess={handleLoginSuccess} onShowSignup={() => setModalType('signup')} />}
      {modalType === 'signup' && <SignupModal onClose={() => setModalType(null)} onShowLogin={() => setModalType('login')} />}
      {modalType === 'write' && <WriteModal boardTitle={selectedBoard.title} onClose={() => setModalType(null)} onSubmit={handleWriteSubmit} />}
      {modalType === 'edit' && <EditModal post={selectedPost} onClose={() => setModalType(null)} onSubmit={handleEditSubmit} />}
    </div>
  );
};

export default BookCommunityApp;