const { Telegraf } = require('telegraf');
const axios = require("axios").default;
const { session } = require('telegraf');
const { Scenes } = require('telegraf');
const { Stage } = require('telegraf');
const Wizard = Scenes.WizardScene;

BOT_TOKEN = '5598653399:AAEP9BRyCXsXRp1PSiyK70JqKJfyNsVGZr0'

const bot = new Telegraf(BOT_TOKEN);

//START BOT
bot.start(ctx => {
  console.log(ctx.from)
  let optionsMessage = `▶️ Hello there! I am Currency Converter Bot. \n\nChoose among the following options \n💱 Convert Currency: converts the value in the given currency to another. \n📈 Compound Interest: calculates the compound interest given the principal, rate, intervals, and years. \n💹 View Rates: view the conversion rate between one currency to another. \n \nType /help to get list of commands.`;
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, optionsMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Convert Currency", callback_data: 'Convert' },
        { text: "View Rates", callback_data: 'View Rates' }],
        [{ text: "Calculate Compound Interest Rate", callback_data: 'Calculate Compound Interest Rate' }]
      ],
    }
  })
})

// bot.command('restart', (ctx, next) => {
//   console.log(ctx.from)
//   bot.telegram.sendMessage(ctx.chat.id, 'Restarting bot...');
// })

bot.help((ctx) => {
  ctx.reply("This bot can also perform the following commands\n /start: ▶️ starts the bot; this command can also be used to restart it. \n /help: ❓ view a list of commands and their descriptions. \n /allrates: 🌍 view all rates available for a given currency \n /quota: 🔐 view the number of requests remaining for the month \n")
})


// VIEW ALL RATES

const allrates = new Wizard(
  "allrates",

  (ctx) => {
    ctx.reply("🌍 Please type in the three letter code of the currency you would like to view all rates of. (ex. EUR)");
    return ctx.wizard.next();
  },

  (ctx) => {
    ctx.wizard.state.allratebase = ctx.message.text;
    const allrate = ctx.wizard.state.allratebase;
    urla = 'https://v6.exchangerate-api.com/v6/00c4fdd7d18ffef6b98e2d63/latest'

    // Retrieve Data 
    axios.get(`${urla}/${allrate}`)
      .then((res) => {
        const data = res.data.conversion_rates
        const resultsd = JSON.stringify(data, null, " ");
        console.log(resultsd)
        ctx.reply(resultsd);
      });
    return ctx.scene.leave();
  }
);


// allrates-Scene registration
const stage3 = new Scenes.Stage([allrates]);

bot.use(session());
bot.use(stage3.middleware());

bot.command('allrates', (ctx) => {
  ctx.scene.enter('allrates')
});

// VIEW RATES
const rates = new Wizard(
  "rates",

  // Enter base currency e.g. PHP
  (ctx) => {
    ctx.reply("Please type in the three letter code of the currency you would like to convert from. (ex. USD)");
    return ctx.wizard.next();
  },

  (ctx) => {
    ctx.wizard.state.baserate = ctx.message.text;
    ctx.reply(`Which currency would you like to see the equivalent value of 1 ${ctx.wizard.state.baserate} in? (ex: PHP)`);
    return ctx.wizard.next();
  },

  // Enter target currency
  (ctx) => {
    ctx.wizard.state.targetrate = ctx.message.text;
    const baserate = ctx.wizard.state.baserate;
    const targetrate = ctx.wizard.state.targetrate;
    urlb = 'https://v6.exchangerate-api.com/v6/00c4fdd7d18ffef6b98e2d63/pair'

    // Return converted amount 
    axios.get(`${urlb}/${baserate}/${targetrate}`)
      .then((res) => {
        resda = res.data
        resultse = `1 ${baserate} = ${resda.conversion_rate} ${targetrate}`
        console.log(resultse)
        ctx.reply(resultse);
      });
    return ctx.scene.leave();
  }
);


// rates-Scene registration
const stage = new Scenes.Stage([rates]);

bot.use(session());
bot.use(stage.middleware());

bot.action('View Rates', (ctx) => {
  ctx.scene.enter('rates')
});


// CONVERT CURRENCY
const converter = new Wizard(
  "converter",

  // Enter base currency e.g. PHP
  (ctx) => {
    ctx.reply("Please type in the three letter code of the currency you would like to convert from. (ex. PHP)");
    return ctx.wizard.next();
  },

  (ctx) => {
    ctx.wizard.state.base = ctx.message.text;
    ctx.reply(`What currency would you like to convert ${ctx.wizard.state.base} to? (ex. USD)`);
    return ctx.wizard.next();
  },

  // Enter target currency
  (ctx) => {
    ctx.wizard.state.target = ctx.message.text;
    ctx.reply(`Please type the exact value of the currency you would like to convert ${ctx.wizard.state.base} to ${ctx.wizard.state.target}. (ex. 10000)`);
    return ctx.wizard.next();
  },

  // Enter amount to convert e.g. 750
  (ctx) => {
    ctx.wizard.state.amount = ctx.message.text;
    const amt = ctx.wizard.state.amount;
    const base = ctx.wizard.state.base;
    const target = ctx.wizard.state.target;
    urlc = 'https://v6.exchangerate-api.com/v6/00c4fdd7d18ffef6b98e2d63/pair'

    // Return converted amount 
    axios.get(`${urlc}/${base}/${target}/${amt}`)
      .then((res) => {
        resdata = res.data
        resultsa = `${amt} ${base} = ${resdata.conversion_result} ${target}`
        console.log(resultsa)
        ctx.reply(resultsa);
      });
    return ctx.scene.leave();
  }
);

// converter-Scene registration
const stage2 = new Scenes.Stage([converter]);

bot.use(session());
bot.use(stage2.middleware());

bot.action('Convert', (ctx) => {
  ctx.scene.enter('converter')
});

// VIEW QUOTA
bot.command('quota', (ctx) => {

  // Retrieve data
  urld = 'https://v6.exchangerate-api.com/v6/00c4fdd7d18ffef6b98e2d63/quota'
  axios.get(urld)
    .then((res) => {
      data = res.data
      resultsb = `This command returns the number of requests the bot still has available. \nMaximum requests: ${data.plan_quota} \nRequests Remaining: ${data.requests_remaining} \nRefresh day of month: ${data.refresh_day_of_month}`
      console.log(resultsb)
      ctx.reply(resultsb);
    });
}
);

// CALCULATE COMPOUND INTEREST
const compoundinterest = new Wizard(
  "compoundinterest",

  (ctx) => {
    ctx.reply(`Please type in the principal amount. (ex.10000) \n<i>Do not use commas.</i>`, { parse_mode: 'HTML' });
    return ctx.wizard.next();
  },

  // Get variable (initial) principal
  (ctx) => {
    ctx.wizard.state.principal = ctx.message.text;
    ctx.reply(`Please type in the interest rate per year. (ex. 0.5) \n<i>Convert percentage to decimal.</i>`, { parse_mode: 'HTML' });
    return ctx.wizard.next();
  },

  // Get variable rate
  (ctx) => {
    ctx.wizard.state.rate = ctx.message.text;
    ctx.reply(`Please type in the number corresponding to the intervals of interest. (ex. 12) \nAnnually: 1 \nSemi-annually: 2 \nQuarterly: 4 \nMonthly: 12`);
    return ctx.wizard.next();
  },

  // Get variable (how long) interval
  (ctx) => {
    ctx.wizard.state.interval = ctx.message.text;
    ctx.reply(`For how many years will interest be accrued? (ex. 2)`);
    return ctx.wizard.next();
  },

  // Get variable time
  (ctx) => {
    ctx.wizard.state.time = ctx.message.text;

    // Compiled variables
    const principal = ctx.wizard.state.principal;
    const rate = ctx.wizard.state.rate;
    const interval = ctx.wizard.state.interval;
    const time = ctx.wizard.state.time;

    // Calculations
    const result_product = principal * ((1 + (rate / interval)) ** (interval * time))
    const rate_percent = rate * 100

    resultsc = `Principal Amount: ${principal} \nInterest Rate: ${rate_percent}% \nInterval: ${interval} \nTime: ${time} years \n\nUsing the interest rate of ${rate_percent}%, your initial amount of ${principal} will be ${result_product} in ${time} year/s.`

    console.log(resultsc)
    ctx.reply(resultsc);
    return ctx.scene.leave();
  }
);

// converter-Scene registration
const stage4 = new Scenes.Stage([compoundinterest]);

bot.use(session());
bot.use(stage4.middleware());

bot.action('Calculate Compound Interest Rate', (ctx) => {
  ctx.scene.enter('compoundinterest')
});



//method to start get the script to pulling updates for telegram
bot.launch();