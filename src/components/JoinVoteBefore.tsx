import { voteItem } from "@/types/JoinVote";
import React, { useState } from "react";
import { server } from "@/utils/axios";

// 투표 전 컴포넌트
const JoinVoteBefore = ({
  meetId,
  setIsVoted,
  setVotedItem,
  itemList
}: {
  meetId: string;
  setIsVoted: React.Dispatch<React.SetStateAction<boolean>>;
  setVotedItem: React.Dispatch<React.SetStateAction<string>>;
  itemList: voteItem[]
}) => {
  const [participateId, setParticipateId] = useState<string>("");

  const handleVote = () => {
    if (participateId) {
      server.put("/meet/participate", {
        data: {
          meetId: meetId,
          participateVoteItemIdList: [participateId]
        },
      })
      .then((response) => {
        setIsVoted(true);
        setVotedItem(participateId);
      })
      .catch((error) => {
         
      });
      
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="w-full bg-white p-6 rounded-[24px] space-y-2">
        {itemList.map((item) => (
          <label key = {item.id} className="flex items-center text-lg">
            <input
              key = {item.id}
              id={item.id}
              type="radio"
              name="vote"
              value={item.name}
              checked={participateId === item.id}
              onChange={(e) => setParticipateId(e.target.id)}
              className="mr-3 w-5 h-5"
            />
            {item.name}
          </label>
        ))}
      </div>
      <button
        className="bg-[#FFE607] p-3 rounded-[24px] text-lg w-full font-bold"
        onClick={handleVote}
      >
        투표하기
      </button>
    </div>
  );
};

export default JoinVoteBefore;
