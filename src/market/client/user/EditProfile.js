import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import { FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import auth from './../auth/auth-helper'
import {read, update} from './api-user.js'
import {Redirect} from 'react-router-dom'

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.protectedTitle
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  },
  subheading: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
  }
})

class EditProfile extends Component {
  constructor({match}) {
    super()
    this.state = {
      name: '',
      email: '',
      password: '',
      address: '',
      phone: '',
      accout: '',
      accout_key: '',
      seller: false,
      validator: false,
      redirectToProfile: false,
      error: ''
    }
    this.match = match
  }

  componentDidMount = () => {
    const jwt = auth.isAuthenticated()
    read({
      userId: this.match.params.userId
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({name: data.name, email: data.email, seller: data.seller,
          address: data.address, phone: data.phone, account: data.account, 
          account_key: data.account_key, validator: data.validator})
      }
    })
  }
  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const user = {
      name: this.state.name || undefined,
      email: this.state.email || undefined,
      password: this.state.password || undefined,
      address: this.state.address || undefined,
      phone: this.state.phone || undefined,
      account: this.state.account || undefined,
      account_key: this.state.account_key || undefined,
      seller: this.state.seller,
      validator: this.state.validator
    }
    update({
      userId: this.match.params.userId
    }, {
      t: jwt.token
    }, user).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        auth.updateUser(data, ()=> {
            this.setState({'userId':data._id,'redirectToProfile': true})
        })
      }
    })
  }
  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }
  handleCheckSeller = (event, checked) => {
    this.setState({'seller': checked})
  }
  handleCheckValidator = (event, checked) => {
    this.setState({'validator': checked})
  }
  render() {
    const {classes} = this.props
    if (this.state.redirectToProfile) {
      return (<Redirect to={'/user/' + this.state.userId}/>)
    }
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Edit Profile
          </Typography>
          <TextField id="name" label="Name" className={classes.textField} value={this.state.name} onChange={this.handleChange('name')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} margin="normal"/>
          <TextField id="address" label="Address" className={classes.textField} value={this.state.address} onChange={this.handleChange('address')} margin="normal"/><br/>
          <TextField id="phone" label="Phone" className={classes.textField} value={this.state.phone} onChange={this.handleChange('phone')} margin="normal"/><br/>
          <TextField id="account" label="Account" className={classes.textField} value={this.state.account} onChange={this.handleChange('account')} margin="normal"/><br/>
          <TextField id="account_key" label="Account_key" className={classes.textField} value={this.state.account_key} onChange={this.handleChange('account_key')} margin="normal"/><br/>


          <Typography type="subheading" component="h4" className={classes.subheading}>
            Seller Account
          </Typography>
          <FormControlLabel
            control={
              <Switch classes={{
                                checked: classes.checked,
                                bar: classes.bar
                              }}
                      checked={this.state.seller}
                      onChange={this.handleCheckSeller}
              />}
            label={this.state.seller? 'Active' : 'Inactive'}
          />
          
          <Typography type="subheading" component="h4" className={classes.subheading}>
            Validator Account
          </Typography>
          <FormControlLabel
            control={
              <Switch classes={{
                                checked: classes.checked,
                                bar: classes.bar
                              }}
                      checked={this.state.validator}
                      onChange={this.handleCheckValidator}
              />}
            label={this.state.validator? 'Active' : 'Inactive'}
          />
          <br/> {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
    )
  }
}

EditProfile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(EditProfile)
