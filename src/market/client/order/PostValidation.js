import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Dialog, {DialogContent, DialogContentText, DialogTitle, DialogActions} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import List, {ListItem, ListItemText} from 'material-ui/List'
import Icon from 'material-ui/Icon'
import Typography from 'material-ui/Typography'
import MenuItem from 'material-ui/Menu/MenuItem'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import {validate} from './api-order.js'
import auth from './../auth/auth-helper'
import {getStatusValues, update, cancelProduct, processCharge} from './api-order.js'

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
    paddingBottom: 0
  },
  listImg: {
    width: '70px',
    verticalAlign: 'top',
    marginRight: '10px'
  },
  listDetails: {
    display: "inline-block"
  },
  listQty: {
    margin: 0,
    fontSize: '0.9em',
    color: '#5f7c8b'
  },
  card: {
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle
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
  statusMessage: {
    position: 'absolute',
    zIndex: '12',
    right: '5px',
    padding: '5px'
  }
})
class PostValidation extends Component {
  
  constructor({match}) {
    super()
    this.state = {
      open: 0,
      statusValues: [],
      success: false,
      txid: '',
      nameOfPage: '',
      nameOfSite: '',
      accessTime: '',
      url: '',
      validationId: '',
      error: ''
    }
  }
  componentDidMount = () => {
  }
  
  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }
  
  handleClose = () => {
    setOpen(false);
  };

  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const report = {
      txid: this.props.txid,
      nameOfPage: this.state.nameOfPage || undefined,
      nameOfSite: this.state.nameOfSite || undefined,
      password: this.state.password || undefined,
      accessTime: this.state.accessTime || undefined,
      url: this.state.url || undefined
    }
    validate({userId:jwt.user._id}, {
      t: jwt.token
    }, report).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({validationId: data, error: '', success: true})
      }
    })
  }
  
  render() {
    const {classes} = this.props
    return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <TextField id="nameOfPage" label="Name Of Page" className={classes.textField} value={this.state.nameOfPage} onChange={this.handleChange('nameOfPage')} margin="normal"/><br/>
          <TextField id="nameOfSite" type="nameOfSite" label="Name Of Site" className={classes.textField} value={this.state.nameOfSite} onChange={this.handleChange('nameOfSite')} margin="normal"/><br/>
          <TextField id="accessTime" label="Access Time" className={classes.textField} value={this.state.accessTime} onChange={this.handleChange('accessTime')} margin="normal"/><br/>
          <TextField id="url" label="URL" className={classes.textField} value={this.state.url} onChange={this.handleChange('url')} margin="normal"/><br/>
          <br/> {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}</Typography>)
          }

        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Report</Button>
        </CardActions>
      </Card>
      <Dialog open={this.state.success} disableBackdropClick={true}>
        <DialogTitle id='alert-dialog-title'>{"Validation is Reported"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            You need to check out the result
          </DialogContentText>
        </DialogContent>
      <DialogActions>
        <Button color="primary" autoFocus="autoFocus" variant="raised" href={'https://ropsten.etherscan.io/tx/'+this.state.validationId}>
          Link
        </Button>
      </DialogActions>
      </Dialog>

  </div>)
  }
}
PostValidation.propTypes = {
  classes: PropTypes.object.isRequired,
  txid: PropTypes.string.isRequired,
  transaction: PropTypes.object.isRequired,
  txIndex: PropTypes.number.isRequired,
}

export default withStyles(styles)(PostValidation)
