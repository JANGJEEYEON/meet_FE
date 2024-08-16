import React, { useState } from "react";

// 투표 전 컴포넌트
const JoinVoteBefore = ({
  meetId,
  setIsVoted,
  setVotedStatus,
}: {
  meetId: string;
  setIsVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setVotedStatus: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedVote, setSelectedVote] = useState<string>("");

  const handleVote = () => {
    if (selectedVote) {
      setVotedStatus(selectedVote);
      setIsVoted(true);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">모임에 참여하시겠습니까?</h2>
      <div className="flex flex-col gap-4 mb-4 ml-4">
        <label className="flex items-center text-lg">
          <input
            type="radio"
            name="vote"
            value="참여"
            checked={selectedVote === "참여"}
            onChange={(e) => setSelectedVote(e.target.value)}
            className="mr-3 w-5 h-5"
          />
          참여
        </label>
        <label className="flex items-center text-lg">
          <input
            type="radio"
            name="vote"
            value="불참여"
            checked={selectedVote === "불참여"}
            onChange={(e) => setSelectedVote(e.target.value)}
            className="mr-3 w-5 h-5"
          />
          불참여
        </label>
      </div>
      <button
        className="bg-blue-500 text-white p-3 rounded-lg text-lg w-full hover:bg-blue-600"
        onClick={handleVote}
      >
        투표하기
      </button>
    </div>
  );
};

export default JoinVoteBefore;
