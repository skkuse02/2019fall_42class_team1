import {Order, CartItem} from '../models/order.model'
import User from '../models/user.model'
import Shop from '../models/shop.model'
import Product from '../models/product.model' 
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import config from './../../config/config'
import Web3 from 'web3'  

const web3 = new Web3(config.infuraUrl)
const contract = new web3.eth.Contract(config.abi, config.contractAddr, {
    gasPrice: '15990000000',
    gas: 3000000
})
const create = (req, res) => {

  console.log(config.contractAddr)
  req.body.order.user = req.profile 
  const order = new Order(req.body.order)
  User.findOne({_id: req.profile}).exec((err, buyer)=>{
    Shop.findOne({_id: order.products[0].shop}).exec((err, shop)=>{
      console.log(req.profile._id)
      console.log(shop.owner)
      if(req.profile._id.equals(shop.owner)){
        console.log("Tried to buy one's own item")
        return res.status(400).json({error: "Do not try to buy yours"})
      }
      User.findOne({_id: shop.owner}).exec((err, seller)=>{
        Product.findOne({_id: order.products[0].product}).exec((err, item)=>{
          web3.eth.accounts.wallet.add(buyer.account_key)  
          contract.from = buyer.account
          contract.methods.makeTx(order._id.toString(), seller.account, seller.email, seller.phone, item.price, "None", 100, item.price)
          .send({from: buyer.account}, (err, txid)=>{
            if(err) {
              console.log(err)
              return res.status(400).json({error: "Transaction failed"})
            }
            order.payment_id = txid
            console.log(order)
            order.save((err, result)=>{
              if(err) 
                return res.status(400).json({error: "Saving Order failed"})

              res.status(200).json(result)
            })
          })
        })
      })
    })
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

const completeTx = (req, res) => {
  var txid = req.body.txid
  var account = req.profile.account
  console.log("Completed Tx")
  web3.eth.accounts.wallet.add(req.profile.account_key)  

  contract.methods.completeTx(txid)
  .send({from: account}, (err, _txid)=> {
    if (err){ 
      console.log(err)
      return res.status(400).json({error: errorHandler.getErrorMessage(err)})
    }
    console.log(_txid)
    res.status('200').json(_txid)
  })
}

const terminateTx = (req, res) => {
  var txid = req.body.txid
  var account = req.profile.account
  console.log("terminated Tx")
  web3.eth.accounts.wallet.add(req.profile.account_key)  

  contract.methods.reportTx(txid)
  .send({from: account}, (err, _txid)=> {
    if (err){ 
      console.log(err)
      return res.status(400).json({error: errorHandler.getErrorMessage(err)})
    }
    console.log(_txid)
    res.status('200').json(_txid)
  })
}

const revertValidation = (req, res) => {
  var txid = req.body.txid
  var account = req.profile.account
  console.log("Revert Validation")
  web3.eth.accounts.wallet.add(req.profile.account_key)  

  contract.methods.revertValidation(txid)
  .send({from: account}, (err, _txid)=> {
    if (err){ 
      console.log(err)
      return res.status(400).json({error: errorHandler.getErrorMessage(err)})
    }
    console.log(_txid)
    res.status('200').json(_txid)
  })
}
const validationReport = (req, res) => {
  var report = req.body.report
  var account = req.profile.account
  console.log("ValidationReport")
  web3.eth.accounts.wallet.add(req.profile.account_key)  

  contract.methods.validate(report.txid, report.nameOfPage, report.nameOfSite, report.accessTime, report.url)
    .send({from: account}, (err, txid)=> {
      
      if (err){ 
        console.log(err)
        return res.status(400).json({error: errorHandler.getErrorMessage(err)})
      }
      console.log(txid)
      res.status('200').json(txid)
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
  read,
  validationReport,
  completeTx,
  terminateTx,
  revertValidation
}
