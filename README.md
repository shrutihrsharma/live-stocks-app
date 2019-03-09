# (Live) Stocks App

This is a simple single page application that will list stocks and their prices. It will provvide live updates of stock prices using websockets.

This project is built using node and vanilla js.
Due to timing constraints, I used *ag-grid* for displaying stock data in tabular format, 
which I know is an overkill for this simple app. This could have been done with simple html table too.

For css, I have used *bootdtrap* css library.
For friendly readable time and auto refresh, I have used *timeago* library.

Not added any other enhancements.

You can run this project on express server using command:
    npm run start


Changing websocket url to wss instead of ws.
Connecting to *wss://stocks.mnet.website* to this websocket url unstead of ws on. Server needs to be configured to accept this request. I couldn't find any other workaround for this.

So my solution wont work on github pages as there, you hae to enforce https. 
I tried deploying over custom domain also, but kept getting some or the other error.
Try running it locally without wss, it works.