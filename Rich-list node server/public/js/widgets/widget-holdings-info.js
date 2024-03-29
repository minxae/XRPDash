import * as api from "../api-helper.js"

// Get all currency an account holds, EXCLUDING XRP.
// example: BTC, SGB, VGB etc

export async function setData(address){
    // call to api fucntion that gets currency for an account.
    //
    let holdings = await api.getCurrencies(address);

    if(holdings.data){
        appendData(holdings.data)
    }else{
        $(".currency-list").empty()
        $(".currency-list").append(`
        <div class="col text-center p-4">
            <h4>
                ${holdings.message} 
                <i style="color: #ff2e63" class="bi bi-emoji-frown-fill">
                </i>
            </h4>
        </div>
        `)
    }
}

function appendData(holdings){
    $(".currency-list").empty()
    for(let i in holdings){
        console.log(i)
        $(".currency-list").append(createHoldingsItem(holdings[i]))
    }
}

function createHoldingsItem(currency){
    return `
    <div class="col p-1 accent-currency-card">
        <div class="p-2 h-100 currency-card">
            <h4 class="display-5">${currency}</h4>
        </div>
    </div>
    `
}
