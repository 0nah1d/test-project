import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

let currentToken: string | null = null

export const setAuthToken = (token: string | null) => {
    currentToken = token

    if (token) {
        api.defaults.headers.common['X-AUTOBIZZ-TOKEN'] = token
    } else {
        delete api.defaults.headers.common['X-AUTOBIZZ-TOKEN']
    }
}

api.interceptors.request.use(
    (config) => {
        if (currentToken) {
            config.headers['X-AUTOBIZZ-TOKEN'] = currentToken
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api
