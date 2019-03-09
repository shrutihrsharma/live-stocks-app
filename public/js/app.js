let self = this;
let gridData = new Array();
let columnDefs = [
    {
        headerName: "Name",
        field: "name",
        width: 350
    },
    {
        headerName: "Price",
        field: "price",
        width: 350,
        cellClass: function(params) {
            if(params.data.isFirstUpdate) {
                return '';
            }else if(params.data.isStockPriceUp) {
                return 'bg-success';
            } else {
                return 'bg-danger';
            }
        }
    },
    {
        headerName: "Last Update",
        field: "lastUpdate",
        width: 400,
        cellRenderer: function(params) {
           return timeago.format(params.data.lastUpdate, 'en');
        }
    }
];
let gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
        window.addEventListener('resize', function() {
          setTimeout(function() {
            params.api.sizeColumnsToFit();
          });
        });
    }
};
document.body.onload = () => {    
    let agGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(agGridDiv, gridOptions);

    this.setupWebsocket();
};

setupWebsocket = () => {
    if('WebSocket' in window || 'MozWebSocket' in window) {
        console.log('WebSocket is supported by this browser');
        // I don't know if the server is configured for wss because even wss isnt working.
        let ws = new WebSocket("wss://stocks.mnet.website");
        ws.onopen = onWsOpen;
        ws.onmessage = onWsMessage;
        ws.onclose = onWsClose;
        ws.onerror = onWsError;
    } else {
        console.log("Your browser does not support websockets :(");
    }
};

onWsOpen = (e) => {
    console.log("Connection established. Client is ready to receive messages as and when they arrive!!");
}

onWsError = (e) => {
    console.log("Oops!! Error from server: "+e);
}

onWsClose = (e) => {
    console.log("Server has disconnected. Reason: "+e.reason);
}

onWsMessage = (e) => {    
    console.log("Message received from server: "+e.data);
    let data = e.data;
    if(data) {
        self.computeDataForGrid(data);
    }
}

computeDataForGrid = (data) => {
    let stocks = [];
    let jsonData = JSON.parse(data);
    if(gridData.length === 0) {
        //TODO: this can be done in a far elegant manner. think of a better solution.
        jsonData.forEach(function(el) {
            let stock =  {
                name: el[0],
                price: el[1],
                lastUpdate: new Date(),
                isFirstUpdate: true
            };
            gridData.push(stock);
        });
        gridOptions.api.setRowData(gridData);
    }
    else {
        jsonData.forEach(function(el) {
            let stock =  {
                name: el[0],
                price: el[1],
                lastUpdate: new Date(),
                isFirstUpdate: true
            };
            let idx = gridData.findIndex(e => e.name === stock.name);
            if(idx === -1) {
                gridData.push(stock);
            }else {
                stock.isFirstUpdate = false;
                stock.isStockPriceUp = stock.price > gridData[idx].price ? true : false;
                gridData[idx] = stock;
            }
        });
        gridOptions.api.setRowData(gridData);
    }


    //This should auto refresh the time in last update column.
    let nodes = document.querySelectorAll('.timeag-cls');
    timeago.render(nodes, 'zh_CN');
        
};