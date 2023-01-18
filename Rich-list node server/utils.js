function sortByNumeric(a,  b){
    if((a.Balance / 1000000) > (b.Balance / 1000000)){
        return -1;
    }
    if((a.Balance / 1000000) < (b.Balance / 1000000)){
        return 1;
    }
    return 0;
}

module.exports = {
    sortByNumeric
}