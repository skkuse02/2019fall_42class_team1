import {Order, CartItem} from '../models/order.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import config from './../../config/config'
import Web3 from 'web3'  

const web3 = new Web3(config.infuraUrl)
const contract = new web3.eth.Contract(config.abi, config.contractAddr, {
    gasPrice: '20000000000',
    gas: 500000
})
const create = (req, res) => {
  req.body.order.user = req.profile 
  let buyer = req.profile
  web3.eth.accounts.wallet.add(buyer.account_key)  
  contract.from = buter.account

  const order = new Order(req.body.order)

  req.body.order.products.map((item) => {
    let seller = item.shop.user
    contract.methods.makeTx(seller.accout, seller.email, seller.phone, item.price, "None", 100, item.price)
      .send({from: buyer.account}, (err, txid) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
          })
        }
        order.txid = txid
      })
  })

  order.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.status(200).json(result)
  })
}

const listByShop = (req, res) => {
  Order.find({"products.shop": req.shop._id})
  .populate({path: 'products.product', select: '_id name price'})
  .sort('-created')
  .exec((err, orders) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(orders)
  })
}

const update = (req, res) => {
  Order.update({'products._id':req.body.cartItemId}, {'$set': {
        'products.$.status': req.body.status
    }}, (err, order) => {
      if (err) {
        return res.status(400).send({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(order)
    })
}

const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path('status').enumValues)
}

const orderByID = (req, res, next, id) => {
  Order.findById(id).populate('products.product', 'name price').populate('products.shop', 'name').exec((err, order) => {
    if (err || !order)
      return res.status('400').json({
        error: "Order not found"
      })
    req.order = order
    next()
  })
}

const listByUser = (req, res) => {
  Order.find({ "user": req.profile._id })
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
              })
            }
            res.json(orders)
        })
}

const read = (req, res) => {
  return res.json(req.order)
}

export default {
  create,
  listByShop,
  update,
  getStatusValues,
  orderByID,
  listByUser,
  read
}
