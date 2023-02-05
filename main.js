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
console.log(saham);

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

function createRows(pickedStocks) {
    var table = document.getElementById("resultTable");

    var tableHeaderRowCount = 1; // Delete table rows
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }

    for (var i = 0; i < pickedStocks.length; i++) {   // add stocks to the table
        let row = document.createElement("tr");

        let c1 = document.createElement("td");
        let c2 = document.createElement("td");
        let c3 = document.createElement("td");

        c1.innerText = pickedStocks[i]["name"];
        c2.innerText = pickedStocks[i]["value"];
        c3.innerText = pickedStocks[i]["weight"];

        row.appendChild(c1);
        row.appendChild(c2);
        row.appendChild(c3);

        table.appendChild(row);
    }

    table.style.display = "inline-table";
}

function Display() {
    var maxprofitTag = document.getElementById("maxprofit");

    var selectTag = document.getElementById("method");
    var method = selectTag.value;

    if (method === "greedy") {
        var pickedStocks = greedyByVW(saham);

        createRows(pickedStocks);

        var maxprofit = maxProfit(pickedStocks);
        maxprofitTag.style.display = "block";
        maxprofitTag.innerHTML = "Max Profit: " + maxprofit;
    }

    else if(method === "dynamic"){
        
    }
}
