// read remote JSON file in javascript
const saham = [];

const TOTAL_WEIGHT = 100000000;

fetch("saham.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        for (let i = 0; i < data.length; i++) {
            saham.push(data[i]);
        }
    });
// console.log(saham);

function sortByVW(data) {
    data = data.sort((a, b) => {
        if (a.vw < b.vw) {
            return -1;
        }
    });
    return data;
}

function maxProfit(data) {
    var profit = 0;
    for (var i = 0; i < data.length; i++) {
        profit += data[i]["value"];
    }
    return profit;
}

function greedyByVW(data) {
    data = sortByVW(data);
    weight = 0;
    pickedStocks = [];

    for (var i = 11; i >= 0; i--) {
        weight += data[i]["weight"];
        if (weight < TOTAL_WEIGHT) {
            pickedStocks.push(data[i]);
        } else {
            weight -= data[i]["weight"];
        }
    }
    return pickedStocks;
}

function pickedStocksDP(data, dp) {
    let pickedStocks = [];
    var weight = TOTAL_WEIGHT / 100000;
    for (var i = data.length - 1; i >= 0; i--) {
        current = dp[i + 1][weight];
        previous = dp[i][weight];
        if (current > previous) {
            pickedStocks.push(data[i]);
            weight = Math.floor(weight - data[i]["weight"] / 100000);
        }
    }
    return pickedStocks;
}

function dynamicPrograming(data) {
    var length = data.length;
    var dp = new Array(length + 1);

    for (var i = 0; i <= length; i++) {
        dp[i] = new Array(TOTAL_WEIGHT / 100000 + 1);
        for (var w = 0; w <= TOTAL_WEIGHT / 100000; w++) {
            if (i == 0 || w == 0) {
                dp[i][w] = 0;
            } else if (data[i - 1]["weight"] / 100000 <= w) {
                dp[i][w] = Math.max(data[i - 1]["value"] + dp[i - 1][Math.floor(w - data[i - 1]["weight"] / 100000)], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    const maxprofit = dp[length][TOTAL_WEIGHT / 100000];
    const pickedStocks = pickedStocksDP(data, dp);
    return [maxprofit, pickedStocks];
}

var maxProfitBacktrack = 0;
var currentWeight = 0;
var currentValue = 0;
var x = [];

function backtrack(i) {
    if (i > saham.length - 1) {
        maxProfitBacktrack = currentValue;
    } else if (currentWeight + saham[i]["weight"] <= TOTAL_WEIGHT) {
        currentWeight += saham[i]["weight"];
        currentValue += saham[i]["value"];

        backtrack(i + 1);
        currentWeight -= saham[i]["weight"];
        currentValue -= saham[i]["value"];
    } else {
    }
    if (bound(i + 1) > maxProfitBacktrack) {
        backtrack(i + 1);
    }
}
function bound(i) {
    var remainWeight = TOTAL_WEIGHT - currentWeight;
    var bound = currentValue;
    while (i < saham.length && saham[i]["weight"] <= remainWeight) {
        remainWeight -= saham[i]["weight"];
        bound += saham[i]["value"];
        i++;
    }
    if (i < saham.length - 1) {
        bound += (saham[i]["value"] * remainWeight) / saham[i]["weight"];
    }
    return bound;
}

function createRows(pickedStocks) {
    var table = document.getElementById("resultTable");

    var tableHeaderRowCount = 1; // Delete table rows
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }

    for (var i = 0; i < pickedStocks.length; i++) {
        // add stocks to the table
        let row = document.createElement("tr");

        let c0 = document.createElement("td");
        let c1 = document.createElement("td");
        let c2 = document.createElement("td");
        let c3 = document.createElement("td");

        c0.innerText = i + 1;
        c1.innerText = pickedStocks[i]["name"];
        c2.innerText = pickedStocks[i]["value"];
        c3.innerText = pickedStocks[i]["weight"];

        row.appendChild(c0);
        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);

        table.appendChild(row);
    }

    window.setTimeout(function () {
        // for transition
        table.style.transform = "scale(1)";
    }, 500);
}

function createErrorRow() {
    var table = document.getElementById("resultTable");

    var tableHeaderRowCount = 1; // Delete table rows
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }

    let row = document.createElement("tr");

    let c0 = document.createElement("td");
    let c1 = document.createElement("td");
    let c2 = document.createElement("td");
    let c3 = document.createElement("td");

    c0.innerText = 0;
    c1.innerText = "Error occurred";
    c2.innerText = "I couldn't find stocks";
    c3.innerText = "This is my problem. Not yours";

    row.appendChild(c0);
    row.appendChild(c1);
    row.appendChild(c2);
    row.appendChild(c3);

    table.appendChild(row);

    window.setTimeout(function () {
        // for transition
        table.style.transform = "scale(1)";
    }, 500);
}

function Display() {
    var table = document.getElementById("resultTable");
    table.style.transform = "scale(0)"; // for transition

    var maxprofitTag = document.getElementById("maxprofit");
    maxprofitTag.style.transform = "scale(0)";

    var selectTag = document.getElementById("method");
    var method = selectTag.value;

    if (method === "greedy") {
        var pickedStocks = greedyByVW(saham);

        createRows(pickedStocks);

        var maxprofit = maxProfit(pickedStocks);
        maxprofitTag.innerHTML = "Max Profit: " + maxprofit;
        window.setTimeout(function () {
            // for transition
            maxprofitTag.style.transform = "scale(1)";
        }, 700);
    } else if (method === "dynamic") {
        let [maxP, picked] = dynamicPrograming(saham);

        createRows(picked);

        maxprofitTag.innerHTML = "Max Profit: " + maxP;
        window.setTimeout(function () {
            // for transition
            maxprofitTag.style.transform = "scale(1)";
        }, 700);
    } else if (method === "backtracking") {
        sortByVW(saham);
        saham.reverse();
        // console.log(saham);
        backtrack(0);  
        createErrorRow();

        maxprofitTag.innerHTML = "Max Profit: " + maxProfitBacktrack;
        window.setTimeout(function () {
            // for transition
            maxprofitTag.style.transform = "scale(1)";
        }, 700);
    }
}

function getAllData(){
    var table = document.getElementById("resultTable");
    table.style.transform = "scale(0)"; // for transition

    var maxprofitTag = document.getElementById("maxprofit");
    maxprofitTag.style.transform = "scale(0)";
    
    createRows(saham);
    var totalValue = 0;
    for(var i=0; i<saham.length; i++){
        totalValue += saham[i]['value'];
    }

    maxprofitTag.innerHTML = "Max  Value: " + totalValue;
    window.setTimeout(function () {
            // for transition
            maxprofitTag.style.transform = "scale(1)";
        }, 700);
}
