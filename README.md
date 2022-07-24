# Currency Telegram Bot
 Capstone Project Group E

### Overview
The Currency Telegram Bot aims to provide users with daily currency exchange rates including converting a certain amount into their desired currency. Additionally, it can easily calculate compound interest for the user. 
### Context
Joey, the banker, wants a quick bot to retrieve the exchange rates without going through the hassle of surfing the internet and converting XXXX amounts from one currency to another. At the same time, Joey wants a quick compound interest calculator for his investment and savings plans.
### Procedure
Create a telegram bot with Node.js and Telegraf library.
Use an API to retrieve exchange rate data.
Allow bot to save user input as variable.
Send to the user the output accordingly.
### What the Bot can do
- /start: starts the bot; shows an inline menu for the user.
  1. __Convert Currency__: converts the value in the given currency to another.
  2. __Compound Interest__: calculates the compound interest given the principal, rate, intervals, and years.
  3. __View Rates__: view the conversion rate between one currency to another.
- /help: view a list of commands and their descriptions.
- /allrates: view all rates available for a given currency 
- /quota: view the number of requests remaining for the month
