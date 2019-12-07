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
import PostValidation from './PostValidation'
import Iframe from 'react-iframe'
import config from './../../config/config'
import Web3 from 'web3'

const styles = theme => ({
  root: theme.mixins.gutters({
    margin: 'auto',
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    float: 'left',
    width: '50%'
  }),
  title: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 3}px ${theme.spacing.unit}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  iframe: {
    marginTop: theme.spacing.unit * 5,
    padding: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 10,
    frameborder: '0',
    float: 'right'
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
    var toReturn = []
    var count = 0
    array.forEach(function(el){
      contract.methods.getOpenTx(el)
        .call({from: config.defaultAddr}, (err, res) => {
          console.log(res)
          var txid = res['0']
          var _status = res['1']
          var seller = res['2']
          var splited = res['3'].split("#")
          var a = new Date(Number(splited[0])*1000)
          var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
          var year = a.getFullYear()
          var month = months[a.getMonth()]
          var date = a.getDate()
          var hour = a.getHours()
          var min = a.getMinutes()
          var sec = a.getSeconds()
          var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
       
          var tmp = {timestamp: time,
                     status: _status,
                     id: txid, 
                     sellerAccount: seller, 
                     sellerId: splited[1], 
                     sellerPhone: splited[2] }
          if(Number(tmp.status) == 0) 
            toReturn.push(tmp)
          count = count + 1
          if (count === array.length) {
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
                <ListItemText primary={'Transaction ID # '+ tx.id} secondary={tx.timestamp}/>
                {this.state.open == index ? <ExpandLess /> : <ExpandMore />}
              </ListItem><Divider/>
              <Collapse component="li" in={this.state.open == index} timeout="auto" unmountOnExit>
                <div className={classes.customerDetails}>
                  <Typography type="subheading" component="h3" className={classes.subheading}>
                    {'Seller ID: '+ tx.sellerId} 
                  </Typography>
                  <Typography type="subheading" component="h3" color="primary">{'Account: '+tx.sellerAccount}</Typography>
                  <Typography type="subheading" component="h3" color="primary">{'Phone: '+tx.sellerPhone}</Typography>
                </div>
                <PostValidation txid={tx.id} transaction={tx} txIndex={index} />  
              </Collapse>
              <Divider/>
            </span>})}
          </List>
        </Paper>
        <Iframe src="https://m.bunjang.co.kr/talk/account_check" className={classes.iframe} height="600" width="450" margin='auto' padding='auto'/ >
      </div>)
    }
  }

  Valid.propTypes = {
    classes: PropTypes.object.isRequired
  }

export default withStyles(styles)(Valid)
