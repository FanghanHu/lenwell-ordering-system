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

const repairshopr = {
    get: (endpoint, params) => {
        return axios.get(getUrl(endpoint), {
            params: withApi(params)
        });
    },
    delete: (endpoint, params) => {
        return axios.delete(getUrl(endpoint), {
            params: withApi(params)
        });
    },
    put: (endpoint, params) => {
        return axios.put(getUrl(endpoint), withApi(params));
    },
    post: (endpoint, params) => {
        return axios.post(getUrl(endpoint), withApi(params));
    },
};

export default repairshopr;