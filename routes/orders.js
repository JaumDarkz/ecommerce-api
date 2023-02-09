const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error });
    conn.query("SELECT * FROM orders", (error, result, field) => {
      if (error) return res.status(500).send({ error: error });
      const response = {
        amount: result.length,
        orders: result.map((order) => {
          return {
            id_order: order.id_order,
            id_product: order.id_product,
            amount: order.amount,
            request: {
              type: "GET",
              description: "Return details of a specific order",
              url: "http://localhost:3000/orders/" + order.id_order,
            },
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
});

// Get data of a specific order
router.get("/:id_order", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error });
    conn.query(
      "SELECT * FROM orders WHERE id_order = ?",
      [req.params.id_order],
      (error, result, field) => {
        if (error) return res.status(500).send({ error: error });

        if (result.lenght == 0) {
          return res.status(404).send({
            message: "Not be found order with this id",
          });
        }

        const response = {
          product: {
            id_order: result[0].id_order,
            id_product: result[0].id_product,
            amount: result[0].amount,
            request: {
              type: "GET",
              description: "Return all orders",
              url: "http://localhost:3000/orders",
            },
          },
        };
        return res.status(200).send(response);
      }
    );
  });
});

// Insert an item
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM products WHERE id_product = ?',
    [req.body.id_product],
    (error, result, field) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
            return res.status(404).send({
                mensagem: 'Product not found'
            })
        }
        conn.query(
            'INSERT INTO orders (id_product, amount) VALUES (?,?)',
            [req.body.id_product, req.body.amount],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Order inserted with success',
                    orderCreated: {
                        id_order: result.id_order,
                        id_product: req.body.id_product,
                        amount: req.body.amount,
                        request: {
                            type: 'GET',
                            description: 'Return all orders',
                            url: 'http://localhost:3000/orders'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )

    })
});
});

// Delete`s an item
router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error });
    conn.query(
      `DELETE FROM orders WHERE id_order = ?`,
      [req.body.id_order],
      (error, result, field) => {
        conn.release();

        if (error) return res.status(500).send({ error: error });

        const response = {
          message: "Order deleted with success",
          request: {
            type: "POST",
            description: "Insert a order",
            url: "http://localhost:3000/orders",
            body: {
              id_product: "Number",
              amount: "Number",
            },
          },
        };
        res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
