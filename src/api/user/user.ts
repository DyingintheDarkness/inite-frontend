import instance from "../axios";
import { addInstagramUser } from "../instagram/instagram";
import AxiosResponse from "axios";

export const register = async (
  name: string,
  username: string,
  email: string,
  password: string,
  gender: string
) => {
  const req = await instance.post("/user/register", {
    name,
    username,
    email,
    password,
    gender,
  });
  if (req.status === 200) {
    return true;
  }
  return false;
};

export const login = async (email: string, password: string) => {
  const req = await instance.post("/user/login", {
    email,
    password,
  });

  if (req.status === 200) {
    return { isSuccess: true, user: req.data };
  }
  return { isSuccess: false, user: {} };
};

export const logout = async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("x-token");
  localStorage.removeItem("x-refresh-token");
  localStorage.removeItem("notifications");
  localStorage.removeItem("userChanges");
  localStorage.removeItem("recentChanges");
  localStorage.removeItem("readNotifications");
  localStorage.removeItem("instagramUser");
};

export const verifyEmailToken = async (token: string) => {
  try {
    const req = await instance.post("/user/account/email/verify/token", {
      token: token,
    });

    if ((req as any).status === 200) {
      return { isSuccess: true, message: "Email Verified" };
    }
  } catch (err: any) {
    if (
      err.response.status === 404 &&
      err.response.data.name === "TokenExpiredError"
    ) {
      return { isSuccess: false, message: "Token Expired" };
    }

    if (err.response.status === 404) {
      return { isSuccess: false, message: "Invalid Token" };
    }
    if (err.response.status === 400) {
      return { isSuccess: false, message: "Email has already been verified" };
    }
  }
  return { isSuccess: false, message: "Invalid Token" };
};

export const verifyEmail = async () => {
  const req = await instance.post("/user/account/email/verify").catch(() => {
    return { isSuccess: false, data: {} };
  });
  if ((req as any).status === 200) {
    return true;
  }
  return false;
};

export const fetchUser = async () => {
  const req = await instance.post("/user/get").catch(() => {
    return { isSuccess: false, data: {} };
  });

  if ((req as any).status === 200) {
    localStorage.setItem("user", JSON.stringify(req.data));
    return { isSuccess: true, data: (req as any).data };
  }
  return { isSuccess: false, data: {} };
};

export const followInstagramUser = async (instagramUser: {
  username: string;
}) => {
  try {
    const req: any = await instance.post("/user/instagram/follow", {
      ...instagramUser,
    });

    if ((req as any).status === 200) {
      return true;
    }
  } catch (err: any) {
    return false;
  }
  return false;
};

export const unfollowInstagramUser = async (username: string) => {
  try {
    const req = await instance.post("/user/instagram/unfollow", {
      username,
    });

    if ((req as any).status === 200) {
      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
};