var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");

// Validates Price
const priceValidator = async (value, {req}) => {
  if (req.body.price < 0) {
    throw new Error('Price is Below 0');
  }
};

// Renders/Gets All Products
router.get("/", async function (req, res, next) {
  const products = await Product.findAll();
  if (req.query.msg) {
    res.locals.msg = req.query.msg;
  }
  res.render("mainView", { products });
});

// What Happens When You Create a Product
router.post(
  "/create",
  // Added in Validations
  body("price").custom(priceValidator),

  async function (req, res) {
    try {
      const result = validationResult(req);
      const result2 = result.formatWith((error) => error.msg);
      const errors2 = result2.array();
      console.log(errors2);
      if (!result.isEmpty()) {
        throw new Error(errors2[0]);
      } else {
        await Product.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            image: req.file ? req.file.filename: null,
        });
        res.redirect("/?msg=success");
      }
    } catch (error) {
      res.redirect("/?msg=" + new URLSearchParams(error.toString()).toString());
    }
  }
);

// Commenting this Out Unless We Decide We Want to Delete Products


// // Key Parameter is Product ID
// router.get("/delete/:firstname", async function(req, res, next) {
//   const patient = await Patient.findPatient(req.params.firstname);
//   if(patient){
//     await patient.destroy()
//     res.redirect('/?msg=successdel&?firstname='+req.params.firstname);
//   }else{
//     res.redirect('/?msg=patient+not+found&?firstname='+req.params.firstname);
//   }
// });

module.exports = router;
