import axios from 'axios';

const server = 'http://172.17.1.240:8080/';

export default (endPoint, obj)=>{

    return new Promise((resolve, reject)=>{
        axios.post(`${server}${endPoint}`, obj)
        .then((res)=>{
            resolve(res);
        })
        .catch((e)=>{
            reject(e);
        });
    })

}