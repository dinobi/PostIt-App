
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from '../../../../images/postit-icon.png';
import MainHeader // eslint-disable-line no-unused-vars
from '../MainHeader.jsx';
import {
	InputField, // eslint-disable-line no-unused-vars
	Button, Footer, Form // eslint-disable-line no-unused-vars
} from '../../../commonViews';
import { onResetPassword } from '../../../../actions';
/**
 *
 * @class ResetPassword
 * @extends {React.Component}
 */
class ResetPassword extends React.Component {
	/**
	 * Creates an instance of ResetPassword.
	 * @param {props} props - class properties
	 * @memberof ResetPassword
	 */
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
    this.onFocus = this.onFocus.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
  }
	/**
   * onFocus()
   * This method is called when the user focuses on an input field,
   * which clear any error messages afterwards.
   *
   * @memberof ResetPassword
   * @returns {void}
   */
  onFocus() {
    this.setState({ errorMessage: '' });
  }
	/**
	 * @param {any} event
	 * @memberof ResetPassword
	 * @returns {*} - New State object and actions creators
	 */
  handleResetPassword(event) {
    event.preventDefault();
    let { password, confirmPassword } = this;
    password = password.value.trim();
    confirmPassword = confirmPassword.value.trim();
    if (password === '' || confirmPassword === '') {
      return this.setState({
        errorMessage: 'Error. All fields are required'
      });
    }		else if (password !== confirmPassword) {
      this.setState({
        errorMessage: 'Error. Password do not match'
      });
    } else {
      this.props.onResetPassword({ password });
    }
  }
	/**
	 *
	 * @memberof ResetPassword
	 * @returns {*} react elements
	 */
  render() {
    const { loader } = this.props;
    return (
			<div>
				<MainHeader />
					<section className="container">
						<Form
							id="auth-form"
							onSubmit={ this.handleResetPassword }
						>
							<a href="/#">
								<img className="form-logo" src={Icon} alt="postit-icon" />
							</a>
							<p className="form-brief">Reset your password:</p>
							<InputField
								inputClass="input-field"
								onFocus = { this.onFocus }
								type="password"
								id="password"
								placeholder="Enter new password"
								inputRef={(input) => { this.password = input; }}
								label="Password"
							/>
							<InputField
								inputClass="input-field"
								onFocus = { this.onFocus }
								type="password"
								id="confirm-password"
								placeholder="Confirm password"
								inputRef={(input) => { this.confirmPassword = input; }}
								label="Confirm Password"
							/>
							{
								this.state.errorMessage === '' ? '' :
								<p className="alert error-alert">
									<i className="fa fa-exclamation-triangle"></i>
									&nbsp;{this.state.errorMessage}
								</p>
							}
							<Button
								type="submit"
								btnClass="btn btn-login"
								disabled={loader}
								name=
									{
										loader ?
										<p>processing...</p> :
										<p>Reset</p>
									}
							/>
						</Form>
					</section>
				<Footer />
			</div>
    );
  }
}

ResetPassword.propTypes = {
  onResetPassword: PropTypes.func.isRequired,
  loader: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loader: state.changePassword.passwordResetIsLoading
});

const mapDispatchToProps = dispatch =>
bindActionCreators({ onResetPassword }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
