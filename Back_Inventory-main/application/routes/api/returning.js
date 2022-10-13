const router = require('express').Router();
const ReturningController = require('../../controllers/ReturningController');
const auth = require('../../middleware/auth');

router.post('/create',auth.verifyBranchChief,ReturningController.create);

router.get('/list',auth.verifyBranchChief, ReturningController.list);
router.get('/id', auth.verifyBranchChief,ReturningController.detail);
router.get('/makefile', auth.verifyWarehouseManager, ReturningController.makefile);

router.put('/approved', auth.verifyWarehouseManager,ReturningController.approve);
router.put('/rejected', auth.verifyWarehouseManager, ReturningController.reject);

router.put('/update', auth.verifyBranchChief,ReturningController.update);

module.exports = router;