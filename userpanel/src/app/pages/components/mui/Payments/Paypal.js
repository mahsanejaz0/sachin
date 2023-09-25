import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess }) => {
  const paypalClientId = "AX6zxLbqt40EAKk4f7sBxsN3hX1EfCNQvLer-TJ8rztWJ4_-94ugH94ynwYuWdCJfUVJfn_Hra9xcJwW"; // Replace with your PayPal Client ID


  return (
    <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
      <PayPalButtons  createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount, // Pass the amount as a prop
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(function (details) {
            // Call the onSuccess callback with the transaction details
            onSuccess(details);

            // Log success message to the console
            console.log("Payment completed successfully!");
            console.log("Transaction details:", details);
          });
        }}
        onError={(err) => {
          // Log error message to the console
          console.error("An error occurred during payment:", err);
        }} />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
