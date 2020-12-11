require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const passport = require("passport");
const hbs = require("hbs");
const flash = require("connect-flash");
const db = require("./config/database");
const errorHandler = require("./config/error-handler");
const cookieparser = require("cookie-parser");
const User = db.User;
const User2 = require("./models/user2");
const moment = require("moment");
const PORT = process.env.PORT || 3000;
const app = express();
const morgan = require("morgan");
const Notify = db.Notify;
const OrderProduct = db.orderProduct;
const compression = require('compression');
// const flashm = require('express-flash-notification');

app.use(
  session({
    key: "user_sid",
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      expires: 60000000,
    },
  })
);

require("./config/passport")(passport);
hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
// app.use(flashm(app));
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);
//app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(morgan("dev"));
app.use(errorHandler);
app.use(cookieparser());

app.use(express.static(path.join(__dirname, "public")));
app.use("*/css", express.static("public/css"));
app.use("*/js", express.static("public/js"));
app.use("*/images", express.static("public/images"));
app.use("*/fonts", express.static("public/fonts"));
app.use("*/uploads", express.static("public/uploads"));

hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

hbs.registerHelper("equal", function (lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
  let newlvalue = JSON.stringify(lvalue);
  let newrvalue = JSON.stringify(rvalue);
  if (newlvalue !== newrvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

hbs.registerHelper("dateformat", function (datetime, format) {
  var expires = moment(datetime).valueOf();
  return expires;
  //return moment(datetime).format(format);
});

hbs.registerHelper("termcheck", function (lvalue, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error("Handlebars Helper termcheck needs 2 parameters");
  }
  let n = rvalue.includes(lvalue);
  if (n === true) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper("greaterorequal", function (lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue == rvalue || lvalue >= rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

hbs.registerHelper("notequal", function (lvalue, rvalue, options) {
  if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue == rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

hbs.registerHelper("variationmatch", function (slug, lvalue, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error("Handlebars Helper termcheck needs 2 parameters");
  }
  let newrvalue = rvalue[slug];
  if (newrvalue === lvalue) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper("select", function (selected, options) {
  return options
    .fn(this)
    .replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"');
});

hbs.registerHelper("list", function (context, lvalue, rvalue, options) {
  if (context) {
    var ret =
      "<select class='form-control' name='attribute_taxonomy' id='offerproductname'>";
    for (var i = 0, j = context.length; i < j; i++) {
      if (options.fn(context[i]).trim() == lvalue.trim()) {
        ret =
          ret +
          "<option value='" +
          options.fn(context[i]).trim() +
          "' selected='' data-productid='" +
          context[i]._id +
          "'>" +
          options.fn(context[i]).trim() +
          "</option>";
      } else {
        ret =
          ret +
          "<option value='" +
          options.fn(context[i]).trim() +
          "' data-productid='" +
          context[i]._id +
          "'>" +
          options.fn(context[i]).trim() +
          "</option>";
      }
    }
    return ret + "</select>";
  } else {
    var ret =
      "<select class='form-control' name='" +
      rvalue +
      "' id='offerproductname'>";
    return ret + "</select>";
  }
});

hbs.registerHelper("splitTitle", function (lvalue, options) {
  var str;
  if (lvalue) {
    str = lvalue.split(" ").join("_");
  } else {
    str = "default page";
    str = str.split(" ").join("_");
  }
  var res = str.toLowerCase();
  return res;
});

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

require("./Strategies/google");

app.use(passport.initialize());
app.use(passport.session());

app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get("/", loggedIn, async function (req, res) {
  let usercount = await User2.count();
  Notify.find({ title: "New Order" })
    .sort({ notificationtime: "desc" })
    .then((data) => sort(data));
  // let ordercount = await OrderProduct.count();
  let ordercount = 2;
  function sort(data) {
    if (data.length > 1) {
      let olddate = data[0].notificationtime;
      let newdate = Date.now();
      var d = Math.abs(olddate - newdate) / 1000;
      var r = {};
      var s = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };

      Object.keys(s).forEach(function (key) {
        r[key] = Math.floor(d / s[key]);
        d -= r[key] * s[key];
      });

      var time_elapsed;
      if (r.year !== 0) {
        time_elapsed = r.year + " Years ago";
      } else if (r.month !== 0 && r.year == 0) {
        time_elapsed = r.month + " Months ago";
      } else if (r.week !== 0 && r.month == 0 && r.year == 0) {
        time_elapsed = r.week + " Weeks ago";
      } else if (r.week == 0 && r.month == 0 && r.year == 0 && r.day !== 0) {
        time_elapsed = r.day + " Days ago";
      } else if (
        r.week == 0 &&
        r.month == 0 &&
        r.year == 0 &&
        r.day == 0 &&
        r.hour !== 0
      ) {
        time_elapsed = r.hour + " Hours ago";
      } else if (
        r.week == 0 &&
        r.month == 0 &&
        r.year == 0 &&
        r.day == 0 &&
        r.hour == 0 &&
        r.minute !== 0
      ) {
        time_elapsed = r.minute + " Minutes ago";
      } else if (
        r.week == 0 &&
        r.month == 0 &&
        r.year == 0 &&
        r.day == 0 &&
        r.hour == 0 &&
        r.minute == 0 &&
        r.second !== 0
      ) {
        time_elapsed = r.second;
        +" Seconds ago";
      }
    }
    res.render("index.hbs", {
      pageTitle: "Home Page",
      usercount: usercount,
      ordercount: ordercount,
      order_elapsedtime: time_elapsed,
    });
  }
});

function loggedIn(req, res, next) {
  if (req.user) {
    console.log({ "user request": req.user });
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/users/login");
  }
}

app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/categories", require("./routes/categories"));
app.use("/menus", require("./routes/menus"));
app.use("/options", require("./routes/options"));
app.use("/getinfo", require("./routes/getcountry"));
app.use("/stripe", require("./routes/stripe"));
app.use("/order", require("./routes/orders"));
app.use("/", require("./routes/subscribed"));
app.use("/wishlist", require("./routes/wishlist"));
app.use("/pages", require("./routes/pages"));
app.use("/", require("./routes/google"));
app.use("/paypal", require("./routes/paypal"));
app.use("/", require("./routes/paypal_subscription"));
app.use("/footermenus", require("./routes/footermenu"));
app.use("/vendor", require("./routes/vendor"));
app.use("/packagetype", require("./routes/packagetype"));
app.use("/barcodes", require("./routes/barcodes"));
app.use("/ambassador-portal", require("./routes/affiliation"));
app.use("/ship", require("./routes/easyPost"));
app.use("/review", require("./routes/reviews"));
app.use("/authorize", require("./routes/Authorize"));
app.use("/contact-us", require("./routes/contactus"));
app.use("/folders", require("./routes/folder"));
app.use("/subscribedData", require("./routes/subscriberData"));


app.listen(PORT, () => console.log("Listening on " + PORT));
