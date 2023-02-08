let baseUrl = "http://localhost:8080"

export async function status(){
    let url =  baseUrl + "/admin/status";
    try {
        let response = await fetch(url);
        if(response.status == 200){
            return json
        }
    } catch(err){
        console.log(err);
    }
}

export async function setup(){
    let url =  baseUrl + "/admin/setup";
    try {
        let response = await fetch(url);
        return response;
    } catch(err){
        console.log(err);
    }
}

export async function cancel(){
    let url =  baseUrl + "/admin/cancel";
    try {
        let response = await fetch(url);
        return response
    } catch(err){
        console.log(err);
    }
}