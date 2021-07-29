import React, { Component } from "react";
import {Row, Card, Dropdown} from "reactstrap";
import { Link } from "react-router-dom";
// import images
import bg from "../../assets/images/bg.jpg";
import logoDark from "../../assets/images/logo-dark.png";
import {loginSuccess as LoginSuccessAction} from "../../store/auth/login/actions";
import { initBackendAPI } from "../../helpers/backend";
import {connect} from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";

const backendAPI = initBackendAPI();

class VerifyCodePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFailedDialog: false
    };
  }

  onVerify = (e) => {
    let code = document.getElementById('authcode').value;
    let passcode = document.getElementById('passcode').value;
    console.log('code', code);
    if(!window.confirmationResult){
      this.props.history.push('/login');
      return;
    }
    window.confirmationResult.confirm(code).then(async (result) => {
      // User signed in successfully.
      const user = result.user;
      const role = await backendAPI.getRole(user.phoneNumber, passcode);
      if(!role){
        this.setState({openFailedDialog: true});
        return;
      }
      const userInfo = {
        phone_number: user.phoneNumber,
        role: role,
        id: user.uid
      };

      console.log('userInfo', userInfo);
      backendAPI.setLoggeedInUser(userInfo);
      this.props.loginSuccess(userInfo);
      this.props.history.push('/dashboard');

      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
      console.log('error', error);
      this.props.history.push('/login');
    });
    e.preventDefault();
  }

  render() {
    const {openFailedDialog} = this.state;
    return (
      <React.Fragment>
        <div
          className="accountbg"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${bg})`
          }}
        ></div>

        <div className="wrapper-page account-page-full">
          <Card className="shadow-none">
            <div className="card-block">
              <div className="account-box">
                <div className="card-box shadow-none p-4">
                  <div className="p-2">
                    <div className="text-center mt-4">
                      <Link to="/">
                        <img src={logoDark} height="22" alt="logo" />
                      </Link>
                    </div>

                    <h4 className="font-size-18 mt-5 text-center">
                      Verify Phone
                    </h4>

                    <form className="mt-4" action="#">
                      <div className="alert alert-success mt-4" role="alert">
                        Enter auth code that you received!
                      </div>

                      <div className="form-group">
                        <label htmlFor="authcode">Auth Code</label>
                        <input
                          type="number"
                          className="form-control"
                          id="authcode"
                          placeholder="Enter auth code"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="passcode">Pass Code</label>
                        <input
                            type="password"
                            className="form-control"
                            id="passcode"
                            placeholder="Enter your passcode"
                        />
                      </div>

                      <Row className="form-group">
                        <div className="col-12 text-right">
                          <button
                            className="btn btn-primary w-md waves-effect waves-light"
                            type="submit"
                            onClick={this.onVerify}
                          >
                            Verify
                          </button>
                        </div>
                      </Row>
                    </form>

                    <div className="mt-5 pt-4 text-center">
                      <p>
                        © {new Date().getFullYear()}
                        KaoTech.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        { openFailedDialog ?
            <SweetAlert
                title="Your account was not registered!"
                warning
                showCancel={false}
                confirmBtnText="Ok"
                confirmBtnBsStyle="danger"
                onConfirm={() => this.setState({openFailedDialog: false})}
            >
            </SweetAlert>
            :
            null}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginSuccess : params => dispatch(LoginSuccessAction(params))
})
export default connect(null, mapDispatchToProps)(VerifyCodePage);
