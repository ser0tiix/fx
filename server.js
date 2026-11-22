require("dotenv").config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')

const app = express();

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {

  const { plan, email } = req.body;

  let priceId = '';

  // Stripeの商品ID
  switch(plan) {

    case 'STARTER':
      priceId = 'price_1TXMfJDZAAVZEXXLVQh1fnaU';
      break;

    case 'STANDARD':
      priceId = 'price_1TXMf8DZAAVZEXXLzcqh7KCp';
      break;

    case 'PREMIUM':
      priceId = 'price_1TXMevDZAAVZEXXLp4Kdt7CN';
      break;

    default:
      return res.status(400).json({
        error: 'プランが不正です'
      });

  }

  try {

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ['card'],

      mode: 'subscription',

      customer_email: email,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: 'http://127.0.0.1:5500/success.html',
      cancel_url: 'http://127.0.0.1:5500/cancel.html',

    });

    res.json({
      id: session.id
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.listen(3000, () => {

  console.log('Stripe server running on port 3000');

});