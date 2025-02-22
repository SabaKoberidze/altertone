const CloudIpsp = require("cloudipsp-node-js-sdk");

export function isTimeslotValid() {
  const checkout = new CloudIpsp({
    merchantId: Number(process.env.MERCHANT_ID),
    secretKey: process.env.SECRET_KEY as string,
  });
  const requestData = {
    order_id: "Your Order Id",
    order_desc: "test order",
    currency: "GEL",
    amount: "1000",
    server_callback_url: "/api/process",
    response_url: "",
  };
  checkout
    .Checkout(requestData)
    .then((data: any) => {
      //
    })
    .catch((error: any) => {
      //
    });
}
