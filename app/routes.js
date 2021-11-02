module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    let produce = [
      { name: "lemons", season: "january" },
      { name: "parsnips", season: "january" },
      { name: "tangerines", season: "january" },
      { name: "kale", season: "february" },
      { name: "cabbage", season: "february" },
      { name: "turnips", season: "february" },
      { name: "artichokes", season: "march" },
      { name: "pineapples", season: "march" },
      { name: "mushrooms", season: "march" },
      { name: "asparagus", season: "april" },
      { name: "lettuce", season: "april" },
      { name: "rhubarb", season: "april" },
      { name: "mangoes", season: "may" },
      { name: "okra", season: "may" },
      { name: "strawberries", season: "may" },
      { name: "blueberries", season: "june" },
      { name: "cherries", season: "june" },
      { name: "kiwi", season: "june" },
      { name: "blackberries", season: "july" },
      { name: "apricots", season: "july" },
      { name: "cucumbers", season: "july" },
      { name: "eggplant", season: "august" },
      { name: "figs", season: "august" },
      { name: "peppers", season: "august" },
      { name: "pomegranates", season: "september" },
      { name: "spinach", season: "september" },
      { name: "tomatoes", season: "september" },
      { name: "apples", season: "october" },
      { name: "cauliflower", season: "october" },
      { name: "pumpkin", season: "october" },
      { name: "oranges", season: "november" },
      { name: "pears", season: "november" },
      { name: "sweet potatoes", season: "november" },
      { name: "grapefruit", season: "december" },
      { name: "papayas", season: "december" },
      { name: "tangerines", season: "december" },
    ];
    const d = new Date();
    let month = d.getMonth();
    console.log(month);
    switch (month) {
      case 0:
        month = "january";
        break;
      case 1:
        month = "february";
        break;
      case 2:
        month = "march";
        break;
      case 3:
        month = "april";
        break;
      case 4:
        month = "may";
        break;
      case 5:
        month = "june";
        break;
      case 6:
        month = "july";
        break;
      case 7:
        month = "august";
        break;
      case 8:
        month = "september";
        break;
      case 9:
        month = "october";
        break;
      case 10:
        month = "november";
        break;
      case 10:
        month = "december";
        break;
    }
    console.log(month);
    let inSeasonProduce = produce.filter((el) => el.season === month);
    console.log(inSeasonProduce);
    db.collection("produce")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          produce: result,
          inRightNow: inSeasonProduce,
          allProduce: produce
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // message board routes ===============================================================

  app.post("/save", (req, res) => {
    db.collection("produce").save(
      { name: req.body.name, season: req.body.season, like: 0 },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.send({});
      }
    );
  });

  app.put("/like", (req, res) => {
    db.collection("produce").findOneAndUpdate(
      { like: req.body.like},
      {

        $set: {
          like: req.body.like + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.delete("/deleteSavedProduce", (req, res) => {
    db.collection("produce").findOneAndDelete(
      { name: req.body.produceName },
      function (err, result) {
        if (err) return res.send(500, err);
        res.send(result);
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
