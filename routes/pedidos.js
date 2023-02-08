const express = require('express');
const router = express.Router();

// Testing route
router.get('/', (req, res, next) => {
  res.status(200).send({
    message: 'Return orders'
  });
});

// Insert an item
router.post('/', (req, res, next) => {
  const order = {
    idProduct: req.body.idProduct,
    amount: req.body.amount
  };

  res.status(201).send({
    message: 'Order created',
    orderCreated: order
  });
});

// Get data of an item
router.get('/:id_order', (req, res, next) => {
  const id = req.params.id_order

  res.status(200).send({
    message: 'Details of order',
    id: id
  });
});

// Delete`s an item
router.delete('/', (req, res, next) => {
  res.status(201).send({
    message: 'Order deleted'
  });
});

module.exports = router;