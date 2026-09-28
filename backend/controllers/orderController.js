 const Order = require("../model/Order");

const sendEmail = require("../utils/sendEmail");

// Create a new Order
const createOrder = async(req,res)=>{
    try{
      const {items , totalAmount , address , paymentId} = req.body;
      if(!items || items.length === 0 || !totalAmount ||  !address){
         res.status(400).json({message : 'Invalid order data'});
      }
      else{
        const order = new Order({
            userId:req.user._id,
            items,
            totalAmount,
            address,
            paymentId,
        });
        await order.save();
    
     const message = `
        <h2>Order Confirmation</h2>
        <p>Hello ${req.user.name},</p>
        <p>Your order has been successfully placed! Order ID: <strong>${Order._id}</strong></p>
        <p>Total Amount Paid: $${totalAmount.toFixed(2)}</p>
        <p>It will be shipped to: ${address.street}, ${address.city}</p>
        <p>Thank you for shopping with ShopNest!</p>
      `;

        await sendEmail(req.user.email , 'Order Created' , message);
        res.status(201).json({message : 'Order created succesfully' , order});
      }
    }
    catch(error){
        res.status(500).json({message : 'Server error' , error});
    }
}

const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("items.productId", "name price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getOrders = async(req,res)=>{
    try{
        const orders = await Order.find({}).populate('userId','id name');
        res.json(orders);
    }
    catch(error){
        res.status(500).json({message:'Error fetching orders',error});
    }
}


const updateOrderStatus = async(req,res)=>{
    try{
        const {status} = req.body;
        const order = await Order.findById(req.params.id);
        if(order){
            order.status = status;
            await order.save();
            res.json({message : 'Order status updated' , order});
        }
        else{
            res.status(404).json({message : 'Order not found'});
        }
    }
    catch(error){
        res.status(500).json({message : 'Server error' , error});
    }
}

module.exports = {createOrder , myOrders , getOrders , updateOrderStatus};