import instance from '../api'

export const authAPI = {
    login( creadentials ){
        return instance.post('auth/login', creadentials)
    }
}