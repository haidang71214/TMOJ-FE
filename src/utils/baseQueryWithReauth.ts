import { BASE_URLS } from "@/constants";
import webStorageClient from "@/utils/webStorageClient";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
// phần này là do tôi lười nên setup ở đây để lôi ra dùng nếu có api nào 
// mà không cần token thì bỏ qua 
export const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URLS,
  credentials: "include",
  prepareHeaders: (headers, { endpoint }) => {
    const token = webStorageClient.getToken();
    
    // Lưu ý: Nếu endpoint gọi là Auth/refresh-token hoặc Auth/login thì bỏ qua gắn token.
    // Vì đôi khi lúc gọi refreshToken, endpoint name của Redux gửi vào vẫn là tên API gốc.
    const authEndpoints = ["login", "refreshToken"];
    
    // Thay vì check tên endpoint, nếu bạn muốn an toàn hơn có thể set header mặc định,
    // và những chỗ không muốn có token thì backend phải tự bỏ qua.
    if (token && !authEndpoints.includes(endpoint as string)) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let isRefreshing = false;

// Đổi queue chỉ cần truyền resolve(true/false) để tránh crash do Unhandled Promise Rejection
let failedQueue: {
  resolve: (value: boolean) => void;
}[] = [];

const processQueue = (isSuccess: boolean) => {
  failedQueue.forEach((prom) => {
    prom.resolve(isSuccess);
  });
  failedQueue = [];
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {


  let result = await rawBaseQuery(args, api, extraOptions);

  // Xử lý an toàn cho url (args có thể là string hoặc object)
  const url = typeof args === "string" ? args : args.url;

  if (result.error?.status === 401 && !url?.includes("refresh-token")) {


    if (!isRefreshing) {
      isRefreshing = true;

      const refreshToken = webStorageClient.getRefreshToken();


      if (!refreshToken) {

        webStorageClient.logout();
        return result;
      }



      // Gọi API refresh
      const refreshResult = await rawBaseQuery(
        {
          url: "Auth/refresh-token",
          method: "POST",
          body: { refreshToken },
          // Option này đảm bảo header sẽ không gửi kèm Authorization Bearer cũ lên nếu cần
          headers: {
             Authorization: "" 
          }
        },
        api,
        extraOptions
      );



      if (refreshResult.data) {
        const newAccessToken = (refreshResult.data as any).data.accessToken;
        
        // (Tùy chọn) Nếu backend trả cả newRefreshToken thì nhớ lưu lại luôn:
        // const newRefreshToken = (refreshResult.data as any).data.refreshToken;
        // if (newRefreshToken) webStorageClient.setRefreshToken(newRefreshToken);



        webStorageClient.setToken(newAccessToken);

        // Báo cho các request đang chờ biết là refresh thành công
        processQueue(true);


        result = await rawBaseQuery(args, api, extraOptions);
      } else {

        // Báo cho các request đang chờ biết là refresh THẤT BẠI
        processQueue(false);
        webStorageClient.logout();
      }

      isRefreshing = false;
    } else {


      // Tạm dừng request này và đợi tín hiệu từ request đang refresh
      const isRefreshSuccess = await new Promise<boolean>((resolve) => {
        failedQueue.push({ resolve });
      });

      if (isRefreshSuccess) {

        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Nếu refresh thất bại, trả luôn về lỗi 401 gốc
        return result;
      }
    }
  }

  return result;
};
