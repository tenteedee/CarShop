import {ID} from "../../../_metronic/helpers";
import {QueryResponse} from "../../utils/model/models";
import {toast} from "react-toastify";
import {QueryResponseProvider} from "../../../_metronic/layout/core/QueryResponseProvider";
import {ListViewProvider} from "../../../_metronic/layout/core/ListViewProvider";
import {StaffsList} from "../staffs/components/StaffList";
import {QueryRequestProvider} from "../../../_metronic/layout/core/QueryRequestProvider";
import {deleteNews, getNews} from "./core/requests";

export const handleDelete = async (ids: Array<ID>): Promise<QueryResponse> => {
    try {
        const response = await deleteNews(ids); // Gọi hàm deleteStaff
        toast.success('Xoá thành công', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return response;
    } catch (error) {

        toast.error('Có lỗi xảy ra khi xoá', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        throw error;
    }
};
const NewsListWrapper = () => {
    return (
        <>
            <QueryRequestProvider>
                <QueryResponseProvider id={"news"} request={getNews}>
                    <ListViewProvider onDelete={handleDelete}>
                        <StaffsList/>
                    </ListViewProvider>
                </QueryResponseProvider>
            </QueryRequestProvider>
        </>
    );
}
export {NewsListWrapper}
