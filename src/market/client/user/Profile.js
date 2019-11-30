import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Edit from 'material-ui-icons/Edit'
import Person from 'material-ui-icons/Person'
import Divider from 'material-ui/Divider'
import DeleteUser from './DeleteUser'
import auth from './../auth/auth-helper'
import {read} from './api-user.js'
import {Redirect, Link} from 'react-router-dom'
import config from './../../config/config'
import stripeButton from './../assets/images/stripeButton.png'
import MyOrders from './../order/MyOrders'
import Web3 from 'web3'

const styles = theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5
  }),
  title: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 2}px`,
    color: theme.palette.protectedTitle
  },
  stripe_connect: {
    marginRight: '10px',
  },
  stripe_connected: {
    verticalAlign: 'super',
    marginRight: '10px'
  }
})

class Profile extends Component {
  constructor({match}) {
    super()
    this.state = {
      user: '',
      balance: '',
      redirectToSignin: false
    }
    this.match = match
  }
  init = (userId) => {
    const jwt = auth.isAuthenticated()
    const web3 = new Web3(config.infuraUrl)
    const contract = new web3.eth.Contract(config.abi, config.contractAddr)
    read({
      userId: userId
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({redirectToSignin: true})
      } else {
        this.setState({user: data})
        contract.methods.getBalance(this.state.user.account)
          .call({from: this.state.user.account}, (err, res) => {
            if(err)
              this.setState({balance: 0})
            else {
              this.setState({balance: res})
            }
          })
      }
    })
  }
  componentWillReceiveProps = (props) => {
    this.init(props.match.params.userId)
  }
  componentDidMount = () => {
    this.init(this.match.params.userId)
  }
  render() {
    const {classes} = this.props
    const redirectToSignin = this.state.redirectToSignin
    if (redirectToSignin) {
      return <Redirect to='/signin'/>
    }
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Profile
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <Person/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={this.state.user.name} secondary={this.state.user.email}/> {
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == this.state.user._id &&
             (<ListItemSecondaryAction>
               <Link to={"/user/edit/" + this.state.user._id}>
                 <IconButton aria-label="Edit" color="primary">
                   <Edit/>
                 </IconButton>
               </Link>
               <DeleteUser userId={this.state.user._id}/>
             </ListItemSecondaryAction>)
            }
          </ListItem>
          <Divider/>
          <ListItem>
            <ListItemText primary={"Joined: " + (
              new Date(this.state.user.created)).toDateString()}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={"Address: " + this.state.user.address}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={"Phone: " + this.state.user.phone}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={"Account: " + this.state.user.account}/>
          </ListItem>
          <ListItem>
            <ListItemText primary={"Balance: " + this.state.balance}/>
          </ListItem>
        </List>
        <MyOrders/>
      </Paper>
    )
  }
}
Profile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Profile)
