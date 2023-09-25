import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess }) => {
  const paypalClientId = "AZBIpsTcpvQ7UwXeImV9LZQdltzRlXNiZVh-S0QF_r2O3Jsgq4b2CIJGuy9lrW13DRHkaDl1eAa69wOd"; // Replace with your PayPal Client ID

  const buttonStyles = {
    layout: "horizontal",
    color: "blue",
    shape: "rect",
    label: "pay",
  };

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
