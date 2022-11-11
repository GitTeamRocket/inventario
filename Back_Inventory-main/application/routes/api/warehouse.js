const router = require('express').Router();
const WarehouseController = require('../../controllers/WarehouseController');
const auth = require('../../middleware/auth');

router.post('/create', auth.verifyAdmin, WarehouseController.create);
router.get('/list',  WarehouseController.list);

router.put('/update', WarehouseController.update);

router.get('/detail', WarehouseController.detail);

router.delete('/delete', WarehouseController.delete);

module.exports = router;