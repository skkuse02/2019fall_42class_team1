import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemText} from 'material-ui/List'
import Typography from 'material-ui/Typography'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import Collapse from 'material-ui/transitions/Collapse'
import Divider from 'material-ui/Divider'
import auth from './../auth/auth-helper'
import ProductOrderEdit from './ProductOrderEdit'
import config from './../../config/config'
import Web3 from 'web3'

const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
  }),
  title: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 3}px ${theme.spacing.unit}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing.unit,
    color: '#434b4e',
    fontSize: '1.1em'
  },
  customerDetails: {
    paddingLeft: '36px',
    paddingTop: '16px',
    backgroundColor:'#f8f8f8'
  }
})
class Valid extends Component {
  constructor({match}) {
    super()
    this.state = {
      open: 0,
      transactions:[],
      total: 0,
    }
    this.match = match
  }


  findOpenTx = (array, callback) => {
    var web3 =  new Web3(config.infuraUrl)
    var contract = new web3.eth.Contract(config.abi, config.contractAddr)
    var toReturn = [];

    array.forEach(function(el){
      contract.methods.getOpenTx(el)
        .call({from: config.defaultAddr}, (err, res) => {
          toReturn.push(res)
          if (toReturn.length === array.length) {
          // that was the last push - we have completed
            callback(null, toReturn);
          }
      })
    })
  }


  loadTxs = () => {
        
    var web3 =  new Web3(config.infuraUrl)
    var contract = new web3.eth.Contract(config.abi, config.contractAddr)
    contract.methods.getTxLen()
      .call({from: config.defaultAddr}, (err, res) => {
        if(err)
          console.log(err)

        var array = []
        for(var i = 0; i < res; i++){
          array.push(i)
        }

        this.findOpenTx(array, (err, txs)=>{
          this.setState({transactions: txs})
          console.log(txs)
          console.log("Transactions Loaded")
        })
      })

  }

  componentDidMount = () => {
    this.loadTxs()
  }

  handleClick = index => event => {
    this.setState({open: index})
  }

  updateOrders = (index, updatedOrder) => {
    let orders = this.state.orders
    orders[index] = updatedOrder
    this.setState({orders: orders})
  }

  render() {
    const {classes} = this.props
    return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Open Transactions {this.state.transactions.length}
        </Typography>
        <List dense >
          {this.state.transactions.map((tx, index) => {
            return   <span key={index}>
              <ListItem button onClick={this.handleClick(index)}>
                <ListItemText primary={'TX ID # '+tx['0']} secondary={(new Date()).toDateString()}/>
                {this.state.open == index ? <ExpandLess /> : <ExpandMore />}
              </ListItem><Divider/>
              <Collapse component="li" in={this.state.open == index} timeout="auto" unmountOnExit>
                  <div className={classes.customerDetails}>
                    <Typography type="subheading" component="h3" className={classes.subheading}>
                      Deliver to:
                    </Typography>
                    <Typography type="subheading" component="h3" color="primary">{tx['1']}</Typography>
                  </div>
                </Collapse>
                <Divider/>
              </span>})}
          </List>
        </Paper>
      </div>)
    }
  }

  Valid.propTypes = {
    classes: PropTypes.object.isRequired
  }

export default withStyles(styles)(Valid)
