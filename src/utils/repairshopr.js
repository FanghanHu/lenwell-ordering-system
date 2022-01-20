import axios from "axios";

function getUrl(endpoint) {
    return `https://${process.env["REACT_APP_REPAIRSHOPR_DOMAIN"]}/api/v1/${endpoint}`;
}

function withApi(params) {
    return {
        ...params,
        api_key: localStorage.getItem("repairshopr-api")
    };
}

function senitize(query) {
    return query
        .replace(".", " ")
        .replace('"', " ")
        .replace("/", " ");
}

function get(endpoint, params) {
    return axios.get(getUrl(endpoint), {
        params: withApi(params)
    });
}

function deleteReq(endpoint, params) {
    return axios.delete(getUrl(endpoint), {
        params: withApi(params)
    });
}

function put(endpoint, params) {
    return axios.put(getUrl(endpoint), withApi(params));
}

function post(endpoint, params) {
    return axios.post(getUrl(endpoint), withApi(params));
}

function openTicket(ticketId) {
    window.location.href = `https://${process.env["REACT_APP_REPAIRSHOPR_DOMAIN"]}/tickets/${ticketId}`;
}

async function queryProducts(query) {
    const allProducts = [];
    
    const res = await get("products", { query: senitize(query) });
    allProducts.push(...(res.data.products));

    //send more requests if there are more to read.
    let totalPage = res.data.meta.total_pages;
    let page = res.data.meta.page;
    while (page < totalPage) {
        page++;
        const res2 = await get("products", { query: senitize(query), page });
        allProducts.push(...(res2.data.products));
    }

    return allProducts;
}

const repairshopr = {
    get,
    delete: deleteReq,
    put,
    post,
    openTicket,
    queryProducts
};

export default repairshopr;