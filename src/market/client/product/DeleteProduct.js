import React, {Component} from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import DeleteIcon from 'material-ui-icons/Delete'
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'
import auth from './../auth/auth-helper'
import {remove} from './api-product.js'

class DeleteProduct extends Component {
  state = {
    open: false,
    errorState: false,
    error: ''
  }
  clickButton = () => {
    this.setState({open: true})
  }
  deleteProduct = () => {
    const jwt = auth.isAuthenticated()
    remove({
      shopId: this.props.shopId,
      productId: this.props.product._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        console.log(data.error)
        this.setState({error: data.error, errorState: true})
      } else {
        this.setState({open: false}, () => {
          this.props.onRemove(this.props.product)
        })
      }
    })
  }
  handleRequestClose = () => {
    this.setState({open: false})
    this.setState({errorState: false})
  }
  render() {
    return (<span>
      <IconButton aria-label="Delete" onClick={this.clickButton} color="secondary">
        <DeleteIcon/>
      </IconButton>
      <Dialog open={this.state.open} onClose={this.handleRequestClose}>
        <DialogTitle>{"Delete "+this.props.product.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your product {this.props.product.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.deleteProduct} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={this.state.errorState} onClose={this.handleRequestClose}>
        <DialogTitle>{"Error Occured"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.state.error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            Close 
          </Button>
        </DialogActions>
      </Dialog>

    </span>)
  }
}
DeleteProduct.propTypes = {
  shopId: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}
export default DeleteProduct
