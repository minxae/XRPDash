let baseUrl = "http://localhost:8080";

// Gets address info about the current walllet address ->
export async function getAddressInfo(address){

    let url =  baseUrl + "/account/" + address;

    try {
        let response = await fetch(url)
        if(response.status == 200){
            let json = await response.json();;
            return json;
        } else {
            return {message : "Wallet adress not found"}
        }
    } catch(err){
        console.log(err);
    }
}

export async function walletCheck(address){
    let url = baseUrl + "/account/check/" + address;
    
    try {
        let response = await (await fetch(url)).json()
        if(response.valid) { 
            return true;
        } else {
            return false;
        }
    } catch(err){
        console.log(err);
    }
}

export async function getTxInfo(address){

    let url =  baseUrl + "/tx/" + address;

    try {
        let response = await fetch(url)
        if(response.status == 200){
            let json = await response.json();;
            return json;
        } else {
            return {message : "Wallet adress not found"}
        }
    } catch(err){
        console.log(err);
    }
}

export async function getCurrencies(address){
    let url =  baseUrl + "/account/currencies/" + address;

    try {
        let response = await fetch(url);
        if(response.status == 200){
            let json = await response.json();;
            return json;
        } else {
            return {message : "Wallet adress not found"}
        }
    } catch(err){
        console.log(err);
    }
}

export async function getRank(address){
    let url =  baseUrl + "/ledger/rankInfo/" + address;

    try {
        let response = await fetch(url);
        if(response.status == 200){
            let json = await response.json();
            return json;
        } else {
            return {message : "No rank found"}
        }
    } catch(err){
        console.log(err);
    }
}

