import React from 'react';
import CommunityBoard from './CommunityBoard';

const CommunityView = ({ boardData, handleBoardDetail }) => {
  return (
    <div className="fade-in">
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '30px' }}>
        커뮤니티 광장
      </h2>
      <div className="community-grid">
        <CommunityBoard 
          title="자유게시판" 
          icon="ri-chat-3-line" 
          data={boardData.free} 
          onMoreClick={() => handleBoardDetail('free', '자유게시판')} 
        />
        <CommunityBoard 
          title="토론게시판" 
          icon="ri-discuss-line" 
          data={boardData.debate} 
          onMoreClick={() => handleBoardDetail('debate', '토론게시판')} 
        />
        <CommunityBoard 
          title="모임게시판" 
          icon="ri-team-line" 
          data={boardData.group} 
          onMoreClick={() => handleBoardDetail('group', '모임게시판')} 
        />
        <CommunityBoard 
          title="추천게시판" 
          icon="ri-thumb-up-line" 
          data={boardData.recommend} 
          onMoreClick={() => handleBoardDetail('recommend', '추천게시판')} 
        />
      </div>
    </div>
  );
};

export default CommunityView;