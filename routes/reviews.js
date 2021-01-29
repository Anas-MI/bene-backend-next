const express = require("express");
const app = express();
const router = express.Router();
const db = require("../config/database");
const Review = require("../models/reviews");
const Productmeta = db.ProductMeta;
const OProduct = require("../models/orderedProduct");

//Route to add a review to any particular product
router.post("/add", async (req, res) => {
  let ProductMetaId = req.body.productmetaid;
  let review = new Review(req.body);
  review
    .save()
    .then((review) => addToProduct(review))
    .catch(console.log);
  function addToProduct(review) {
    console.log({ reviewid: review._id });
    Productmeta.findOneAndUpdate(
      { _id: ProductMetaId },
      { $push: { reviews: review._id } },
      { new: true }
    )
      .populate({
        path: "reviews",
        populate: {
          path: "usermetaid",
        },
      })
      .populate({
        path: "reviews",
        populate: {
          path: "userid",
        },
      })
      .then((review) => res.status(200).json({ status: true, review }))
      .catch((error) => res.status(400).json({ status: false, error }));
  }
  let orderid = req.body.orderId;
  let productId = req.body.productId;
  if (!req.body.isCombo) {
    OProduct.findOneAndUpdate(
      { orderid, productId },
      { $set: { reviewed: true } },
      { new: true }
    )
      .then(() => console.log("Review Updated"))
      .catch(console.log);
  } else {
    let comboId = req.body.comboId;
    OProduct.findOneAndUpdate(
      { orderid, comboId },
      { $set: { reviewed: true } },
      { new: true }
    )
      .then(() => console.log("Review Updated"))
      .catch(console.log);
  }
});

//Route to display all the reviews in the backend
router.get("/show", async (req, res) => {
  Review.find()
    .then((data) => showData(data))
    .catch((error) => console.log(error));
  function showData(data) {
    res.render("all_reviews.hbs", { reviews: data });
  }
});

router.get("/getReviews", async (req, res) => {
  Review.find()
    .populate("userid")
    .then((data) => res.status(200).json({ reviews: data }))
    .catch((error) => res.status(404).json({ message: error.message }));
});

//Route to show the pending reviews
router.get("/show/approve", async (req, res) => {
  Review.find({ approved: false })
    .then((data) => render(data))
    .catch(console.log);
  const render = (reviews) => {
    res.render("approve_reviews.hbs", { reviews });
  };
});
router.get("/get/approved", async (req, res) => {
  Review.find({ approved: true })
    .then((data) => res.send(data))
    .catch(console.log);
  
});

//Route to delete a review
router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  Review.findByIdAndRemove(id).then(() => res.json({ status: true }));
});

//Route to approve the review from the backend
router.get("/approve/:id/:value", (req, res) => {
  let id = req.params.id,
    value = req.params.value;
  Review.findByIdAndUpdate(id, { approved: value }, { new: true })
    .then((review) => res.status(200).json({ review }))
    .catch((error) => console.log(error.message));
});

//Route to get all the reviews for the front end as per product
router.get("/getall/:id", (req, res) => {
  let id = req.params.id;
  Productmeta.findById(id)
    .populate("reviews")
    .populate({
      path: "reviews",
      populate: {
        path: "userid",
      },
    })
    .populate({
      path: "reviews",
      populate: {
        path: "usermetaid",
      },
    })
    .then((data) => res.json({ status: true, reviews: data.reviews }))
    .catch((error) => res.status(400).json({ status: false, error }));
});

module.exports = router;
