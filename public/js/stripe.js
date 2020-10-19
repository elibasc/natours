/* eslint-disable */
import axios from 'axios';
import { showAlert } from '/alerts';

const stripe = Stripe(
  'pk_test_51HdiqlHSRjIO37tkSttyAQsd3mj28lg4qRAvaTW4OkM0jsaDcmw9VkvdqMUKn3sZ4Sx1TOJcgxAuOBXVlsG7bFy800bzfqLPRo'
);

export const bookTour = async (tourId) => {
  try {
    //1 Get checkout session from endpoint from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    //2 Create checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
