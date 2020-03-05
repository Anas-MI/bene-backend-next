const express           = require('express');
const router            = express.Router();
const db                = require('../config/database');
const User              = db.User;
const OrderProduct      = db.orderProduct;


// Route to get all orders to be refunded
router.get('/all', ensureAuthenticated, function (req, res) {
    OrderProduct.find({deleted: "false"}).sort({_id: 'desc'}).then((data) => sort(data));

    async function sort(data){

        if(data.length > 1){

        } else {
            res.json({status: false, error: "There are no orders to be displayed"})
        }

    }
        if(err) {
            console.log(err);
        } else {
            res.render('all_orders.hbs', {
                pageTitle: 'All Orders',
                orders: orders 
            });
  
        }
    })
});