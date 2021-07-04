module.exports = findItinerary = (tickets,departure) => {
    let targets = {};
    for(let i=0; i<tickets.length; i++)
    {
        let s = tickets[i][0];
        let t = tickets[i][1];
        if(!targets[s]){
            targets[s] = [t];
        } else {
            let j = targets[s].length-1;
            while(targets[s][j]<t) {
                j--;
            }
            if(j == targets[s].length-1) {
                targets[s].push(t);
            }
            else if(j < 0)
            {
                targets[s].unshift(t);
            }
            else {
                targets[s].splice(j+1, 0, t);
            }
        }
    }

    let res = [];
    let dfs = (node) => {
        let ts = targets[node] || [];
        while(ts.length > 0) {
            dfs(ts.pop());
        }
        res.push(node);
    }

    dfs(departure);
    return res.reverse();
}