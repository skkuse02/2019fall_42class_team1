import React, {Component} from 'react'
import Card, {CardContent, CardMedia} from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import {withStyles} from 'material-ui/styles'
import {read} from './api-order.js'
import {Link} from 'react-router-dom'
import config from './../../config/config'
import Web3 from 'web3'


const styles = theme => ({
  card: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    flexGrow: 1,
    margin: 30,
  },
  cart: {
    textAlign: 'left',
    width: '100%',
    display: 'inline-flex'
  },
  details: {
    display: 'inline-block',
    width: "100%",
    padding: "4px"
  },
  content: {
    flex: '1 0 auto',
    padding: '16px 8px 0px'
  },
  cover: {
    width: 160,
    height: 125,
    margin: '8px'
  },
  info: {
    color: 'rgba(83, 170, 146, 0.82)',
    fontSize: '0.95rem',
    display: 'inline'
  },
  thanks:{
    color: 'rgb(136, 183, 107)',
    fontSize: '0.9rem',
    fontStyle: 'italic'
  },
  innerCardItems: {
    textAlign: 'left',
    margin: '24px 10px 24px 24px',
    padding: '24px 20px 40px 20px',
    backgroundColor: '#80808017'
  },
  innerCard: {
    textAlign: 'left',
    margin: '24px 24px 24px 10px',
    padding: '30px 45px 40px 45px',
    backgroundColor: '#80808017'
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing.unit,
    color: theme.palette.openTitle
  },
  productTitle: {
    fontSize: '1.15em',
    marginBottom: '5px'
  },
  itemTotal: {
    float: 'right',
    marginRight: '40px',
    fontSize: '1.5em',
    color: 'rgb(72, 175, 148)'
  },
  itemShop: {
    display: 'block',
    fontSize: '1em',
    color: '#78948f'
  },
  checkout: {
    float: 'right',
    margin: '24px'
  },
  total: {
    fontSize: '1.2em',
    color: 'rgb(53, 97, 85)',
    marginRight: '16px',
    fontWeight: '600',
    verticalAlign: 'bottom'
  }
})

class Order extends Component {
  constructor({match}) {
    super()
    this.state = {
      order: {products:[], delivery_address:{}},
      validation: {time: '', nameOfPage: '', nameOfSite: '', accessTime: '', url: ''}
    }
    this.match = match
  }

  getValidation = (txid, callback) => {
    var web3 =  new Web3(config.infuraUrl)
    var contract = new web3.eth.Contract(config.abi, config.contractAddr)
    console.log(txid)
    contract.methods.getValidation(txid)
        .call({from: config.defaultAddr}, (err, res) => {
          var splited = res.split("#")
          var a = new Date(Number(splited[0])*1000)
          var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
          var year = a.getFullYear()
          var month = months[a.getMonth()]
          var date = a.getDate()
          var hour = a.getHours()
          var min = a.getMinutes()
          var sec = a.getSeconds()
          var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
          var nameOfPage = splited[1]
          var nameOfSite = splited[2]
          var accessTime = splited[3]
          var url = splited[4]
          this.setState({validation: {time, nameOfpage, nameOfSite, accessTime, url}})
        })
        callback()
  }

  componentDidMount = () => {
    read({
      orderId: this.match.params.orderId
    }).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({order: data})
        this.getValidation(data.payment_id, () => {
          console.log(this.state.validation)
        })
      }
    })
  }

  getTotal(){
    return this.state.order.products.reduce((a, b) => {
       const quantity = b.status == "Cancelled" ? 0 : b.quantity
        return a + (quantity*b.product.price)
    }, 0)
  }

  render() {
    const {classes} = this.props
    return (
      <Card className={classes.card}>
        <Typography type="headline" component="h2" className={classes.title}>
            Order Details
        </Typography>
        <Typography type="subheading" component="h2" className={classes.subheading}>
            Order Code: <strong>{this.state.order._id}</strong> <br/> Placed on {(new Date(this.state.order.created)).toDateString()}
        </Typography>          
        <a href={'http://ropsten.etherscan.io/tx/'+this.state.order.payment_id}><Typography type="subheading" component="h2" className={classes.subheading}><strong>Link To Blockchain Network</strong></Typography></a><br/>
        <Grid container spacing={8}>
            <Grid item xs={7} sm={7}>
                <Card className={classes.innerCardItems}>
                  {this.state.order.products.map((item, i) => {
                    return  <span key={i}>
                      <Card className={classes.cart} >
                        <CardMedia
                          className={classes.cover}
                          image={'/api/product/image/'+item.product._id}
                          title={item.product.name}
                        />
                        <div className={classes.details}>
                          <CardContent className={classes.content}>
                            <Link to={'/product/'+item.product._id}><Typography type="title" component="h3" className={classes.productTitle} color="primary">{item.product.name}</Typography></Link>
                            <Typography type="subheading" component="h3" className={classes.itemShop} color="primary">$ {item.product.price} x {item.quantity}</Typography>
                            <span className={classes.itemTotal}>${item.product.price * item.quantity}</span>
                            <span className={classes.itemShop}>Shop: {item.shop.name}</span>
                            <Typography type="subheading" component="h3" color={item.status == "Cancelled" ? "error":"secondary"}>Status: {item.status}</Typography>
                          </CardContent>
                        </div>
                      </Card>
                      <Divider/>
                    </span>})
                  }
                  <div className={classes.checkout}>
                    <span className={classes.total}>Total: ${this.getTotal()}</span>
                  </div>
                </Card>
            </Grid>
            <Grid item xs={5} sm={5}>
              <Card className={classes.innerCard}>
                <Typography type="subheading" component="h2" className={classes.productTitle} color="primary">
                 Deliver to:
                </Typography>
                <Typography type="subheading" component="h3" className={classes.info} color="primary"><strong>{this.state.order.customer_name}</strong></Typography><br/>
                <Typography type="subheading" component="h3" className={classes.info} color="primary">{this.state.order.customer_email}</Typography><br/>
                <br/>
                <Divider/>
                <br/>
                <Typography type="subheading" component="h3" className={classes.itemShop} color="primary">{this.state.order.delivery_address.street}</Typography>
                <Typography type="subheading" component="h3" className={classes.itemShop} color="primary">{this.state.order.delivery_address.city}, {this.state.order.delivery_address.state} {this.state.order.delivery_address.zipcode}</Typography>
                <Typography type="subheading" component="h3" className={classes.itemShop} color="primary">{this.state.order.delivery_address.country}</Typography><br/>
                <Typography type="subheading" component="h3" className={classes.thanks} color="primary">Thank you for shopping with us! <br/>You can track the status of your purchased items on this page.</Typography>
              </Card>
            </Grid>
        </Grid>
        <Grid container spacing={8}>
            <Grid item xs={12} sm={12}>
              <Card className={classes.innerCard}>
                <Typography type="subheading" component="h2" className={classes.productTitle} color="primary">
                  Validation Report
                </Typography>
                <br/>
                <Typography type="subheading" component="h3" className={classes.itemShop} color="primary">
                  {this.state.validation.time}
                </Typography>
                <Typography type="subheading" component="h3" className={classes.itemShop} color="primary">
                  {this.state.validation.nameOfPage}
                </Typography>
                <Typography type="subheading" component="h3" className={classes.itemShop} color="primary">
                  {this.state.validation.nameOfSite}
                </Typography>
                <Typography type="subheading" component="h3" className={classes.itemShop} color="primary">
                  {this.state.validation.accessTime}
                </Typography>
                <a href={'http://'+this.state.validation.url}>Link To Resource</a>
              </Card>
            </Grid>
        </Grid>
      </Card>
    )
  }
}

Order.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Order)
