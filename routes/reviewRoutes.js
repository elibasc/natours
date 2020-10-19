const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

//mergeParams en true para poder acceder al parámetro :tourId
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.checkIfAuthor,
    reviewController.deleteReview
  )
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.checkIfAuthor,
    reviewController.updateReview
  );

module.exports = router;
