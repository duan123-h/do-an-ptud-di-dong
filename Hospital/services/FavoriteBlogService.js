import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/favoriteblogs"
    return axiosClient.get(url,{params});
};

function create(data){
    const url="/api/favoriteblogs"
    return axiosClient.post(url,data);
};

function destroy(blogid){
    const url="/api/favoriteblogs/"
    return axiosClient.delete(`${url}${blogid}`);
}

const FavoriteBlogs = {
  getAll,
  create,
  destroy
};
export default FavoriteBlogs