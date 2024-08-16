import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { server } from "@/utils/axios";

type MeetInfo = {
  id: string;
  title: string;
  content: string;
  type: string;
  date: {
    value: string;
    editable: string;
  } | null; // date를 null로 설정할 수 있도록 수정
  place: {
    value: string;
    editable: string;
  } | null; // place를 null로 설정할 수 있도록 수정
  isAuthor: string;
  participantsNum: string;
  participants: string[];
  editable: string; // editable 필드 추가
};

const MeetDetail: React.FC = () => {
  const { meetId } = useParams<{ meetId: string }>();
  const [meetInfo, setMeetInfo] = useState<MeetInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // useNavigate hook을 사용하여 페이지 이동 처리

  useEffect(() => {
    console.log("meetId:", meetId);

    const fetchMeetDetail = async () => {
      try {
        if (meetId) {
          const response = await server.get(`/meet?meetId=${meetId}`);
          console.log("API response:", response.data);
          
          // participants가 문자열로 넘어오는 경우 변환 처리
          const data = response.data;
          if (typeof data.participants === 'string') {
            try {
              data.participants = JSON.parse(data.participants.replace(/'/g, '"'));
            } catch (parseError) {
              console.error("참여자 데이터 파싱 오류:", parseError);
              data.participants = []; 
            }
          }

          setMeetInfo(data);
        } else {
          setError("모임 ID가 제공되지 않았습니다.");
        }
      } catch (error: any) {
        console.error("API 요청 오류:", error); 
        setError("모임 정보를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetDetail();
  }, [meetId]);

  const handleEdit = () => {
    // 수정 페이지로 이동
    if (meetInfo) {
      navigate(`/edit/${meetInfo.id}`);
    }
  };

  const handleDelete = async () => {
    if (meetId) {
      try {
        await server.delete(`/meet?meetId=${meetId}`);
        alert("모임이 삭제되었습니다.");
        navigate('/');
      } catch (error) {
        console.error("삭제 오류:", error);
        alert("모임 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8">Error: {error}</div>;
  }

  if (!meetInfo) {
    console.log("meetInfo is null or undefined"); // Log if meetInfo is null
    return <div className="text-center py-8">모임 정보가 없습니다.</div>;
  }

  // date.value를 Date 객체로 변환
  const meetingDate = meetInfo.date?.value ? new Date(meetInfo.date.value) : null;
  const formattedDate = meetingDate
    ? `${meetingDate.getFullYear()}-${('0' + (meetingDate.getMonth() + 1)).slice(-2)}-${('0' + meetingDate.getDate()).slice(-2)}`
    : "날짜 미정";

  return (
    <div className="flex flex-col items-start m-8 space-y-4">
      <h1 className="text-lg font-bold">{meetInfo.title || "모임 제목"}</h1>
      <p>
        <i className="fa-solid fa-calendar-days"></i> {formattedDate}
      </p>
      <hr className="w-full border-gray-300" />
      <p>
        <i className="fa-solid fa-location-dot"></i> {meetInfo.place?.value ? meetInfo.place.value : "장소 미정"}
      </p>
      <hr className="w-full border-gray-300" />
      <p>
        <i className="fa-solid fa-user-group"></i>
        {meetInfo.participants.length > 0 ? meetInfo.participants.join(", ") : " 참여자 없음"}
      </p>
      <hr className="w-full border-gray-300" />
      <p>
        <i className="fa-solid fa-pen"></i> {meetInfo.content}
      </p>
      {meetInfo.editable === "true" && (
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetDetail;
