const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const {
  deleteMe,
  updateMe,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = userController;

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Protegemos las siguientes rutas
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.uploadUserPhoto,
userController.resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

//Solo admins
router.use(authController.restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
