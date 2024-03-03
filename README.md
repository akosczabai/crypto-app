# CryptoApp

This is a crypto currency exchange Angular app created by Ákos Czabai.

## How to use?

After downloading run `npm i` to download all dependecies. After the download finished, run `ng s` in terminal to start the application. After this open `http://localhost:4200/` in a browser.

The application is running on Coinapi API defaultly, but you can run it on Mock API as well.

## Running json-server for mock api

There is a mock api json-server in the `app/db` folder for developing. To run the mock api server right-click to the `db.json` file an click to `Open in integrated terminal`. In the terminal type in `json-server db.json` command.

To use the mock api server, you have to change the endpoints in the `services/crypto.service.ts` service file.

Open the file and do the following changes:

- Switch the cryptoURL variable to the empty string
- In the `getAllCrypto()` function switch the endpoint to the localhost one.
- In the `exchange()` function switch the endpoint to the localhost one.
- In the `gettingHistoricalData()` function switch the endpoint to the localhost one and comment out the `.pipe` part.
- In the `gettingCurrentData()` function switch the endpoint to the localhost one
- Disabling the WebSocket for current exchange rate is not necessary, but you can do that by switch the API key to empty string over the `gettingWebSocketData()` function.

## The UI of the application

After you open the application, you will see a log-in screen. If you have an account, you can log in with your username and password. If the username is not existing, then a new account will be created after submitting the form. If the username is exists and the password is wring, then you will get an error message until you type in the correct password.

After you logged in there is the main dashboard. If you don't have any saved cryptocurrencies, then you can click to the `+` icon to add one. In the pop-up window you can select a cryptocurrency and you can add it to yout collection by clicking to `ADD` button.

In the top row you will see all you currencies in a list and you can see the selected crypto's tab.

In the tab you can exchange the crypto to USD on the current exchange rate. You can reverse the currencies by clicking the `⇄` icon.

On the bottom of the tab there is a daily chart of the closing exchange rates of last week.

On the other tab there is you crypto collections high and low rates of the last minute.
