const express = require('express');
const { render } = require('../app');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error })
    conn.query(
      'SELECT * FROM products', 
      (error, result, field) => {
        if (error) return res.status(500).send({ error: error })
        const response = {
          amount: result.length,
          products: result.map(prod => {
            return {
              id_product: prod.id_produto,
              name: prod.name,
              price: prod.price,
              request: {
                type: 'GET',
                description: 'Return details of a specific product',
                url: 'http://localhost:3000/produtos/' + prod.id_produto
              }
            }
          })
        }
        return res.status(200).send(response);
      }
    )
  })
});

// Get data of an item
router.get('/:id_produto', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error })
    conn.query(
      'SELECT * FROM products WHERE id_produto = ?',
      [req.params.id_produto],
      (error, result, field) => {
        if (error) return res.status(500).send({ error: error })

        if (result.lenght == 0) {
          return res.status(404).send({
            message: 'Not be found with this id'
          })
        }

        const response = {
          product: {
            id_product: result[0].id_produto,
            name: result[0].name,
            price: result[0].price,
            request: {
              type: 'GET',
              description: 'Return all products',
              url: 'http://localhost:3000/produtos'
            }
          }
        }
        return res.status(200).send(response)
      }
    )
  })
});

// Insert an item
router.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error })
    conn.query(
      'INSERT INTO products (name, price) VALUES (?,?)',
      [req.body.name, req.body.price],
      (error, result, field) => {
        conn.release();
        if (error) return res.status(500).send({ error: error })

        const response = {
          message: 'Product inserted with success',
          productCreated: {
            id_product: result.id_produto,
            name: req.body.name,
            price: req.body.price,
            request: {
              type: 'POST',
              description: 'Return all products',
              url: 'http://localhost:3000/produtos'
            }
          }
        }
        return res.status(201).send(response);
      }
    )
  })
});

// Make changes to an item
router.patch('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error })
    conn.query(
      `UPDATE products
          SET name        = ?,
              price       = ?
         WHERE id_produto = ?`,
      [req.body.name, req.body.price, req.body.id_produto], 
      (error, result, field) => {
        conn.release();

        if (error) return res.status(500).send({ error: error })

        const response = {
          message: 'Product updated with success',
          productUpdated: {
            id_product: req.body.id_produto,
            name: req.body.name,
            price: req.body.price,
            request: {
              type: 'GET',
              description: 'Return details of a specific product',
              url: 'http://localhost:3000/produtos/' + req.body.id_produto
            }
          }
        }
        res.status(202).send(response)
      }
    )
  })
});

// Delete`s an item
router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error })
    conn.query(
      `DELETE FROM products WHERE id_produto = ?`,
      [req.body.id_produto], 
      (error, result, field) => {
        conn.release();

        if (error) return res.status(500).send({ error: error })

        const response = {
          message: 'Product deleted with success',
          request: {
            type: 'POST',
            description: 'Insert a product',
            url: 'http://localhost:3000/produtos',
            body: {
              name: 'String',
              price: 'Number'
            }
          }
        }
        res.status(202).send(response)
      }
    )
  })
});

module.exports = router;