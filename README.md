!!! Lưu ý !!!
⚠️ KHÔNG TẢI THÊM BẤT CỨ DEPENDENCY NÀO KHÁC NẾU CHƯA CÓ SỰ CHO PHÉP CỦA TEAM ⚠️
Nguồn tham khảo
Lucide React: https://lucide.dev/
NextUI HeroUI: https://www.heroui.com/docs
Tailwind: https://tailwindcss.com/
Redux Toolkit: https://redux-toolkit.js.org/introduction/getting-started
Extensions cần thiết
ES7 Snippets: https://marketplace.visualstudio.com/items?itemName=rodrigovallades.es7-react-js-snippets
ESLint: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
Material Icon Theme (tùy): https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme
Simple React Snippets: https://marketplace.visualstudio.com/items?itemName=burkeholland.simple-react-snippets
Tailwind CSS IntelliSense: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
How to code
Router
Phần router sẽ được handle trong folder app
app
(admin) (Link rỗng, giả sử (admin) -> dashboar thì chỉ cần truy cập localhost/dashboard)
some-page (đường dẫn tới localhost/some-page)
[type] (đường dẫn lấy param, ví dụ localhost/some-page/apartment thì sẽ lấy được giá trị của param type)
page.tsx (trang của index)
layout.tsx (layout chung của toàn bộ web)
Phần này chỉ được render ở server-side, tuyệt đối không dùng "use client" cho các component trong này. Mỗi đường link chỉ nên được chứa 2 file là page.tsx và layout.tsx.
Không được xử lý dữ liệu và thuật toán ở đây!
Components
Phần components sẽ được chia thành 2 phần bên trong folder components là common (để chứa các file được sử dụng nhiều lần, ưu tiên tính tái sử dụng, tránh bị duplicate code) và modules (để chứa các components của các trang được định nghĩa trong folder app)
Kết nối với back-end
Tạo 1 file mang tên chức năng bên trong folder store/query, ví dụ là chức năng quản lý sinh viên sẽ để là store/query/students.ts với nội dung:
import { propritiesEndpoint } from "@/constants/endpoints";
import { baseApi } from "../base";

export const studentsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
	}),
});  

export const { useGetPropritiesQuery } =  studentsApi;
Tạo 1 enpoint mới trong constants/endpoints.ts và thêm tên enpoint vào export:
const studentsEndpoint = {
	GET_ALL_STUDENTS: `${API_PREFIX}/students`, // Đường dẫn back-end cho chức năng get all
};

export {
	studentsEndpoint
};
Thêm chức năng get-all vào query:
...
endpoints: (builder) => ({
	// Chức năng get-all
	getAllStudents: builder.query<any, any>({ // Có 2 tính năng là query (fetch api thụ động) và mutation
		query: () => ({
			url: propritiesEndpoint.GET_ALL_STUDENTS, // Đường link đã định nghĩa từ trước
			method: "GET", // Phương thức để fetch api
		}),
	}),
}),
...
export const { useGetAllStudentsQuery } = studentsEndpoint; // Nếu là mutation thì sẽ là use...Mutation
Không biết dùng mấy file setup : hỏi đăng
