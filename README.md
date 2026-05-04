# 📚 Library — 독서 커뮤니티 플랫폼

> 책을 찾고, 기록하고, 함께 이야기하는 독서 커뮤니티 풀스택 웹 앱

카카오 도서 검색 API와 Anthropic Claude AI를 연동해 도서를 검색·추천받고,  
커뮤니티 게시판과 독서 모임을 통해 독자들과 소통할 수 있는 서비스입니다.

🔗 **[라이브 데모 보기](https://library-project-delta-wine.vercel.app)**

---

## 📁 프로젝트 구조

```
library_project/
├── public/
└── src/
    ├── App.jsx                  # 전체 상태 관리 및 뷰 라우팅
    ├── App.css                  # 전역 스타일
    ├── CountUp.jsx              # 숫자 카운터 컴포넌트 (미사용)
    ├── api/
    │   └── config.js            # API 베이스 URL 설정
    └── components/
        ├── Header.jsx           # PC 헤더 (검색·알림·프로필)
        ├── MobileHeader.jsx     # 모바일 헤더 (햄버거 메뉴)
        ├── SideBar.jsx          # PC 사이드 네비게이션
        ├── HomeView.jsx         # 홈 (배너·인기 도서 슬라이드)
        ├── BookSearchView.jsx   # 도서 검색 결과 + AI 추천 모달
        ├── BookDetail.jsx       # 독서 모임 상세 페이지
        ├── CommunityView.jsx    # 커뮤니티 광장 (게시판 4종 미리보기)
        ├── CommunityBoard.jsx   # 게시판 카드 컴포넌트
        ├── BoardList.jsx        # 게시판 목록 (테이블)
        ├── PostDetail.jsx       # 게시글 상세 + 댓글·대댓글
        ├── WriteModal.jsx       # 글쓰기 모달
        ├── EditModal.jsx        # 글 수정 모달
        ├── GroupView.jsx        # 독서 모임 목록
        ├── MyLibraryView.jsx    # 내 서재 (위시리스트·마이리스트·신청 모임)
        ├── UserInfoView.jsx     # 회원 정보 (닉네임·비밀번호·탈퇴)
        ├── AdminView.jsx        # 관리자 페이지 (회원 강제 탈퇴)
        ├── LoginModal.jsx       # 로그인 모달
        └── SignupModal.jsx      # 회원가입 모달
```

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React, Vite, CSS |
| Backend | PHP, MySQL (dothome 호스팅) |
| 외부 API | 카카오 도서 검색 API, Anthropic Claude API |
| 아이콘 | Remix Icon (CDN) |
| 배포 | Vercel (프론트) |

---

## 🚀 로컬 실행

```bash
git clone https://github.com/unknownName-15/library_project.git
cd library_project

npm install
npm run dev
# → http://localhost:5173
```

---

## 📌 주요 구현 내용

- **도서 검색**: 카카오 도서 검색 API 연동, 300ms 디바운스 적용한 실시간 드롭다운 검색
- **AI 도서 추천**: Anthropic Claude API 기반 관련 도서 추천 모달 (추천 이유 포함)
- **위시·마이리스트**: 도서 검색 결과에서 버튼 한 번으로 서재 등록
- **커뮤니티 게시판 4종**: 자유·토론·모임·추천 게시판 CRUD, PHP+MySQL 연동
- **댓글·대댓글**: 게시글별 댓글 + 댓글별 대댓글 2단 구조, 작성자 본인·관리자 삭제 가능
- **알림 시스템**: 댓글 등록 시 게시글 작성자에게 알림 발송, 읽음·삭제 처리
- **독서 모임**: 모집 중/종료 모임 목록, 참여 신청 및 내 서재에서 신청 취소
- **회원 시스템**: 회원가입·로그인·닉네임/이메일/비밀번호 변경·회원 탈퇴
- **관리자 기능**: 관리자 계정에서 전체 회원 목록 조회 및 강제 탈퇴 처리
- **PC/모바일 전환**: 사이드바+헤더(PC) ↔ 햄버거 메뉴+하단 검색바(모바일) 수동 전환
- **인기 도서 슬라이더**: 랜덤 키워드 도서 18권 불러와 6개씩 자동 슬라이드 (5초 간격)

---

## 🌐 API 엔드포인트 (PHP 백엔드)

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `login.php` | POST | 로그인 |
| `register.php` | POST | 회원가입 |
| `get_user.php` | GET | 회원 정보 조회 |
| `update_user.php` | POST | 닉네임·이메일 변경 |
| `update_password.php` | POST | 비밀번호 변경 |
| `delete_user.php` | POST | 회원 탈퇴 |
| `get_members.php` | GET | 전체 회원 목록 (관리자) |
| `admin_delete_user.php` | POST | 회원 강제 탈퇴 (관리자) |
| `get_posts.php` | GET | 게시글 목록 |
| `write_post.php` | POST | 게시글 작성 |
| `edit_post.php` | POST | 게시글 수정 |
| `delete_post.php` | POST | 게시글 삭제 |
| `get_comments.php` | GET | 댓글 목록 |
| `write_comment.php` | POST | 댓글 작성 |
| `delete_comment.php` | POST | 댓글 삭제 |
| `get_replies.php` | GET | 대댓글 목록 |
| `write_reply.php` | POST | 대댓글 작성 |
| `search_books.php` | GET | 카카오 도서 검색 |
| `recommend_books.php` | POST | Claude AI 도서 추천 |
