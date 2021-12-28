async function reqData(stock) {
    data = [];
    await (await fetch("http://localhost:3000/wallstreet-bets/" + stock)).text().then( function(result) {
        data = eval(result);
    })
    console.log(data[0]);
    return data;
}

function createChart(stock, data) {
    var ctx = document.getElementById('myChart');
    console.log(typeof(data));

    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data[0],
        datasets: [{
            label: stock,
            data: data[1]
        }]
    },
    })
}