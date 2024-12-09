import { UserList } from "@/utils/route/url";
import axios from "axios";

export const GetListUser = async () => {
    try {
        const resp = await axios.get(`${UserList}`)
        if (resp.status === 200 && resp.data) {
            console.log('successfully fetched user list')
            return resp.data
        } else {
            console.log('SomeOne error')
            throw new Error('Error fetching data')
        }
    } catch (error) {
        console.log('some one wrong')
        throw new Error('Failde to fetch data')
    }
}