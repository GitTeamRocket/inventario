const router = require('express').Router()
const BorrowingController = require('../../controllers/BorrowingController')
const auth = require('../../middleware/auth')

router.post('/create', auth.verifyBranchChief, BorrowingController.create)

router.get('/list', auth.verifyBranchChief, BorrowingController.list)
router.get('/id', auth.verifyBranchChief, BorrowingController.detail)
router.get('/makefile', auth.verifyWarehouseManager, BorrowingController.makefile)

router.put(
  '/approved',
  auth.verifyWarehouseManager,
  BorrowingController.approve
)
router.put('/rejected', auth.verifyWarehouseManager, BorrowingController.reject)

router.put('/update', auth.verifyBranchChief, BorrowingController.update)

module.exports = router
