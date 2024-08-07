import React, { useEffect, useState } from "react";
import axios from "axios";
import UserManage from "@/components/UserManage";

type User = {
  id: string;
  name: string;
  email: string;
  previllege: string;
  uuid: string;
  isFirst: string;
};

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUserList();
  }, []);

  // UUID 가져오기
  const fetchUUID = async () => {
    try {
      const token = await axios.get(
        "http://54.180.29.36/auth/admin/accessToken",
        {
          headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("accesstoken", token.data.data.adminAccessToken);
      const response = await axios.get(
        "https://kapi.kakao.com/v1/api/talk/friends",
        {
          headers: {
            Authorization: `Bearer ${token.data.data.adminAccessToken}`,
          },
        }
      );

      console.log("카카오 API 응답:", response.data);
      const friends = response.data.elements;
      const uuids = friends.map((friend: { uuid: string }) => friend.uuid);
      console.log("가져온 UUID 목록:", uuids);
    } catch (error) {
      console.error("UUID를 가져오는 중 오류가 발생했습니다:", error);
      throw error;
    }
  };

  // 서버에서 유저 목록 가져오기
  const fetchUserList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }
      const response = await axios.get("http://54.180.29.36/member/list", {
        headers: {
          Authorization: `${token}`,
        },
      });
      const transformedUsers = response.data.data.map((user: any) => {
        if (user.previllege === "accepted") {
          user.previllege = "accept";
        } else if (user.previllege === "denied") {
          user.previllege = "deny";
        }
        return user;
      });
      setUsers(transformedUsers);
    } catch (error) {
      console.error("유저 목록을 불러오는 중 오류가 발생했습니다:", error);
    }
  };

  // 유저 권한 변경
  const handlePermissionChange = async (
    memberId: string,
    currentPrivilege: string,
    uuid: string,
    isFirst: string
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      let newPrivilege =
        currentPrivilege === "accept" || currentPrivilege === "admin"
          ? "deny"
          : "accept";

      //uuid 기본값은 null
      let uuid = null;
      //만약에 isFirst가 true 면 값 대입하기
      if (isFirst) {
        uuid = await fetchUUID();
      }

      const response = await axios.put(
        "http://54.180.29.36/member/previllege",
        {
          memberId: memberId,
          option: newPrivilege, // 새 권한을 서버로 전송
          uuid: uuid,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        setUsers((prevState) =>
          prevState.map((user) =>
            user.id === memberId ? { ...user, previllege: newPrivilege } : user
          )
        );
      } else if (response.status === 403) {
        console.error("관리자 권한이 없습니다. 권한을 변경할 수 없습니다.");
      } else if (response.status === 404) {
        console.error("존재하지 않는 멤버입니다. 권한을 변경할 수 없습니다.");
      }
    } catch (error) {
      console.error("유저 권한을 업데이트하는 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#242424" }}
    >
      <div
        className="p-8 rounded-lg shadow-md w-full max-w-md mx-4"
        style={{ backgroundColor: "#3f3f3f" }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          User List
        </h1>
        <ul className="max-w-full divide-y divide-gray-700">
          {users.map((user) => (
            <UserManage
              key={user.id}
              user={user}
              handlePermissionChange={handlePermissionChange}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
