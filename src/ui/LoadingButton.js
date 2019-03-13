import React from 'react';
import { Icon, Button } from '@deskpro/apps-components';
import PropTypes from "prop-types";

export class LoadingButton extends React.Component
{
  static propTypes = {
    label                 : PropTypes.string.isRequired,
    onClick               : PropTypes.func,
    labelSuccess          : PropTypes.string.isRequired,
    onClickSuccess        : PropTypes.func,
  };

  state = {
    isLoading: false,
    isSuccess: false,
  };

  onClick = () => {
    const { isLoading } = this.state;
    if (! isLoading) {
      this.setState({ isLoading: true });
      this.props.onClick().then(() => {
        this.setState({ isLoading: false, isSuccess: true });
      })
    }
  };

  onClickSuccess = () => {
    this.props.onClickSuccess();
    this.setState({ isSuccess: false });
  };

  render() {
    const { isLoading, isSuccess } = this.state;

    if (isLoading) {
      return this.renderLoading();
    }

    if (isSuccess) {
      return this.renderSuccess();
    }

    return this.renderNormal();
  }

  renderNormal() {
    return <Button onClick={this.onClick} size={"normal"}>{this.props.label}</Button>;
  }

  renderSuccess() {
    return <Button appearance={"success"} onClick={this.onClickSuccess} size={"normal"}>{this.props.labelSuccess}</Button>;
  }

  renderLoading() {
    return <Button disabled={true} size={"normal"}>
      <span>
        <Icon name={"refreshing"} style={{ width:10, height:10 }} /> {this.props.label}
      </span>
    </Button>
  }
}
