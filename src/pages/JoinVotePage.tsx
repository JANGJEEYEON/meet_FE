import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FooterNav from "../components/FooterNav";
import JoinVoteBefore from "../components/JoinVoteBefore";
import JoinVoteAfter from "../components/JoinVoteAfter";
import { server } from "@/utils/axios"; // 서버 통신용 유틸리티

const JoinVotePage = () => {
  const { meetId } = useParams<{ meetId: string }>();
  const [meet, setMeet] = useState({
    meetTitle: "",
    meetDate: "",
    endDate: "",
  });
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [votedStatus, setVotedStatus] = useState<string>("");

  // 페이지 로드 시 모임 정보 가져오기
  useEffect(() => {
    const fetchMeet = async () => {
      console.log("fetchMeet 호출됨"); // useEffect 호출 확인
      try {
        const response = await server.get(`/meet/participate?meetId=${meetId}`);
        const data = response.data;

        // 서버 응답 구조를 확인합니다.
        console.log("서버 응답 데이터:", data);

        // endDate를 Date 객체로 변환 후 포맷팅
        const endDateString = data.participateVote?.endDate || "정보 없음";
        console.log("원본 endDate:", endDateString); // 원본 endDate 확인
        const formattedEndDate = formatEndDate(endDateString);

        setMeet({
          meetTitle: data.meetTitle || "제목 없음",
          meetDate: data.meetDate || "날짜 없음",
          endDate: formattedEndDate,
        });
      } catch (error) {
        console.error("데이터 가져오기 에러:", error);
        // 에러 처리 로직 추가 (예: 에러 페이지로 이동)
      }
    };

    fetchMeet();
  }, [meetId]);

  // endDate 문자열을 Date 객체로 변환하고 포맷팅하는 함수
  const formatEndDate = (dateString: string) => {
    console.log("formatEndDate 호출됨"); // formatEndDate 호출 확인

    // 공백을 'T'로 변경하여 Date 객체로 변환
    const formattedString = dateString.replace(" ", "T");
    const date = new Date(formattedString);

    console.log("포맷된 endDate 객체:", date); // Date 객체 확인

    if (isNaN(date.getTime())) {
      // Date 객체가 유효하지 않은 경우
      return "정보 없음";
    }

    // 로케일에 따라 포맷팅 (예: YYYY-MM-DD HH:mm:ss)
    return date.toLocaleString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white md:p-8 h-full">
      <div className="pt-8 pl-8 flex flex-col items-start mb-4">
        <h1 className="text-lg font-bold">{meet.meetTitle}</h1>
        <div className="mt-2">
          <p className="text-sm">모임 날짜: {meet.meetDate}</p>
          <p className="text-sm">투표 마감: {meet.endDate}</p>
        </div>
      </div>

      <div className="p-4">
        {isVoted ? (
          <JoinVoteAfter votedStatus={votedStatus} setIsVoted={setIsVoted} />
        ) : (
          <JoinVoteBefore
            meetId={meetId!}
            setIsVoted={setIsVoted}
            setVotedStatus={setVotedStatus}
          />
        )}
      </div>

      <FooterNav />
    </div>
  );
};

export default JoinVotePage;
