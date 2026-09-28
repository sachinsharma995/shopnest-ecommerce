import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";

const Checkout = () => {
  const { user } = useContext(AuthContext);

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================
  // SHIPPING ADDRESS
  // ==========================================

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      Number(item.price) * Number(item.qty),
    0
  );

  // ==========================================
  // SAVE ORDER
  // ==========================================

  const saveOrder = async (paymentId) => {
    try {
      if (!user?.token) {
        alert("Please login first.");
        navigate("/login");
        return false;
      }

      const saveOrderRes = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },

          body: JSON.stringify({
            items: cartItems,
            totalAmount: totalPrice,
            address,
            paymentId,
          }),
        }
      );

      const data = await saveOrderRes.json();

      if (!saveOrderRes.ok) {
        alert(
          data.message ||
            "Order saving failed."
        );

        return false;
      }

      console.log(
        "✅ Order saved successfully:",
        data
      );

      // Clear cart
      dispatch(clearCart());

      // Go to success page
      navigate("/ordersuccess");

      return true;
    } catch (error) {
      console.error(
        "SAVE ORDER ERROR:",
        error
      );

      alert(
        "Order saving failed. Please try again."
      );

      return false;
    }
  };

  // ==========================================
  // STUDENT BYPASS MODE
  // ==========================================

  const bypassPayment = async () => {
    try {
      setLoading(true);

      const paymentId =
        "bypass_txn_" + Date.now();

      await saveOrder(paymentId);
    } catch (error) {
      console.error(
        "BYPASS PAYMENT ERROR:",
        error
      );

      alert("Bypass payment failed.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DEMO PAYMENT MODE
  // ==========================================

  const demoPayment = async () => {
    try {
      setLoading(true);

      const paymentId =
        "demo_txn_" + Date.now();

      console.log(
        "🎓 Demo Payment:",
        paymentId
      );

      const success = await saveOrder(
        paymentId
      );

      if (success) {
        console.log(
          "✅ Demo payment successful"
        );
      }
    } catch (error) {
      console.error(
        "DEMO PAYMENT ERROR:",
        error
      );

      alert("Demo payment failed.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RAZORPAY PAYMENT
  // ==========================================

  const handleRazorpayPayment = (
    orderData
  ) => {
    try {
      if (!window.Razorpay) {
        setLoading(false);

        alert(
          "Razorpay Checkout is not loaded. Please check your Razorpay script."
        );

        return;
      }

      // ==========================================
      // RAZORPAY OPTIONS
      // ==========================================

      const options = {
        key: orderData.key,

        amount: orderData.amount,

        currency: orderData.currency,

        name: "ShopNest",

        description:
          "ShopNest Test Transaction",

        order_id: orderData.orderId,

        // ==========================================
        // PAYMENT SUCCESS
        // ==========================================

        handler: async function (
          response
        ) {
          try {
            setLoading(true);

            console.log(
              "RAZORPAY RESPONSE:",
              response
            );

            // ==========================================
            // VERIFY PAYMENT
            // ==========================================

            const verifyRes =
              await fetch(
                "/api/payment/verify",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }),
                }
              );

            const verifyData =
              await verifyRes.json();

            console.log(
              "VERIFY RESPONSE:",
              verifyData
            );

            // Verification failed
            if (!verifyRes.ok) {
              alert(
                verifyData.message ||
                  "Payment verification failed."
              );

              return;
            }

            // ==========================================
            // PAYMENT VERIFIED
            // ==========================================

            console.log(
              "✅ Payment verified successfully"
            );

            // Save order
            await saveOrder(
              response.razorpay_payment_id
            );
          } catch (error) {
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error
            );

            alert(
              "Payment verification failed. Please try again."
            );
          } finally {
            setLoading(false);
          }
        },

        // ==========================================
        // CUSTOMER DETAILS
        // ==========================================

        prefill: {
          name: address.fullName,

          email:
            user?.email || "",

          contact:
            "9999999999",
        },

        // ==========================================
        // THEME
        // ==========================================

        theme: {
          color: "#f97316",
        },

        // ==========================================
        // MODAL CLOSE
        // ==========================================

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay checkout closed."
            );

            setLoading(false);
          },
        },
      };

      // ==========================================
      // CREATE RAZORPAY
      // ==========================================

      const razorpay =
        new window.Razorpay(
          options
        );

      // ==========================================
      // PAYMENT FAILED
      // ==========================================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );

          setLoading(false);

          alert(
            response.error
              ?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      // ==========================================
      // OPEN RAZORPAY
      // ==========================================

      razorpay.open();
    } catch (error) {
      console.error(
        "RAZORPAY CHECKOUT ERROR:",
        error
      );

      setLoading(false);

      alert(
        "Unable to open Razorpay checkout."
      );
    }
  };

  // ==========================================
  // MAIN PAYMENT FUNCTION
  // ==========================================

  const handlePayment = async () => {
    try {
      setLoading(true);

      // ==========================================
      // CREATE PAYMENT ORDER
      // ==========================================

      const orderRes = await fetch(
        "/api/payment/order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            amount: totalPrice,
          }),
        }
      );

      const orderData =
        await orderRes.json();

      console.log(
        "PAYMENT ORDER RESPONSE:",
        orderData
      );

      // ==========================================
      // DEMO MODE
      // ==========================================

      if (
        orderData.mode === "demo"
      ) {
        console.log(
          "🎓 ShopNest Demo Payment Mode"
        );

        setLoading(false);

        const confirmDemo =
          window.confirm(
            "Demo Payment Mode is enabled.\n\n" +
              "No real payment will be charged.\n\n" +
              "Do you want to place this test order?"
          );

        if (!confirmDemo) {
          return;
        }

        await demoPayment();

        return;
      }

      // ==========================================
      // STUDENT BYPASS MODE
      // ==========================================

      if (
        orderData.mode ===
          "bypass" ||
        orderRes.status === 503
      ) {
        setLoading(false);

        const useBypass =
          window.confirm(
            "Razorpay is not configured.\n\n" +
              "Do you want to use Student Bypass Mode for this test order?"
          );

        if (useBypass) {
          await bypassPayment();
        }

        return;
      }

      // ==========================================
      // BACKEND ERROR
      // ==========================================

      if (!orderRes.ok) {
        setLoading(false);

        alert(
          orderData.message ||
            "Payment could not be initialized."
        );

        return;
      }

      // ==========================================
      // CHECK RAZORPAY DATA
      // ==========================================

      if (
        !orderData.orderId ||
        !orderData.amount ||
        !orderData.currency ||
        !orderData.key
      ) {
        setLoading(false);

        console.error(
          "Invalid Razorpay response:",
          orderData
        );

        alert(
          "Invalid Razorpay order data received from server."
        );

        return;
      }

      // ==========================================
      // OPEN RAZORPAY
      // ==========================================

      handleRazorpayPayment(
        orderData
      );
    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error
      );

      setLoading(false);

      alert(
        "Something went wrong while starting the payment."
      );
    }
  };

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    // Login check
    if (!user) {
      alert(
        "Please login first."
      );

      navigate("/login");

      return;
    }

    // Cart check
    if (
      cartItems.length === 0
    ) {
      alert(
        "Your cart is empty."
      );

      return;
    }

    // Amount check
    if (totalPrice <= 0) {
      alert(
        "Invalid order amount."
      );

      return;
    }

    // Start payment
    handlePayment();
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-content">
        <form
          onSubmit={handleSubmit}
          className="shipping-form"
        >
          <h3>
            Shipping Address
          </h3>

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            required
            value={
              address.fullName
            }
            onChange={(e) =>
              setAddress({
                ...address,
                fullName:
                  e.target.value,
              })
            }
          />

          {/* Street */}
          <input
            type="text"
            placeholder="Street"
            required
            value={
              address.street
            }
            onChange={(e) =>
              setAddress({
                ...address,
                street:
                  e.target.value,
              })
            }
          />

          {/* City */}
          <input
            type="text"
            placeholder="City"
            required
            value={
              address.city
            }
            onChange={(e) =>
              setAddress({
                ...address,
                city:
                  e.target.value,
              })
            }
            className={
              address.city
                ? "city-filled"
                : ""
            }
          />

          {/* State */}
          <input
            type="text"
            placeholder="State"
            required
            value={
              address.state
            }
            onChange={(e) =>
              setAddress({
                ...address,
                state:
                  e.target.value,
              })
            }
          />

          {/* Postal Code */}
          <input
            type="text"
            placeholder="Postal Code"
            required
            value={
              address.postalCode
            }
            onChange={(e) =>
              setAddress({
                ...address,
                postalCode:
                  e.target.value,
              })
            }
          />

          {/* Country */}
          <input
            type="text"
            placeholder="Country"
            required
            value={
              address.country
            }
            onChange={(e) =>
              setAddress({
                ...address,
                country:
                  e.target.value,
              })
            }
          />

          {/* ==========================================
              PAYMENT SUMMARY
          ========================================== */}

          <div className="checkout-summary">
            <h4>
              Total to Pay: ₹
              {totalPrice.toFixed(2)}
            </h4>

            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;