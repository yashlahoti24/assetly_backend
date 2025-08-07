const express = require('express');

const router = express.Router()

const portfolioController = require("../controllers/portfolioController")

router.get("/", portfolioController.getPortfolioC)

module.exports = router