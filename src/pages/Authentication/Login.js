import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card } from "reactstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

// import images
import bg from "../../assets/images/bg.jpg";
import logoDark from "../../assets/images/logo.png";
import { loginUser as loginUserAction } from "../../store/actions";
import PropTypes from 'prop-types';
import firebase from "firebase";


class Login extends Component {
  static propTypes = {
    history: PropTypes.object,
    loginUser: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      is_passed_recaptcha: false
    };
  }

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.recaptcha, {
      'size': 'normal',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        this.setState({is_passed_recaptcha: true});
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    });
    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  }

  onLogin = (e) => {
    const { loginUser, history } = this.props;
    let phonenumber = document.getElementById('phonenumber').value;
    if(phonenumber.trim().length){
      if(phonenumber[0] !== '+'){
        phonenumber = '+' + phonenumber;
      }
      loginUser({phone: phonenumber}, history);
    }
    e.preventDefault();
  }

  render() {
    const { is_passed_recaptcha } = this.state;
    return (
      <React.Fragment>
        {" "}
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
                    <div className="text-center">
                      <Link to="/">
                        <img src={logoDark} height="300" alt="logo" />
                      </Link>
                    </div>

                    <h4 className="font-size-18 mt-5 text-center">
                      Welcome Back !
                    </h4>
                    <p className="text-muted text-center">
                      Sign in to continue to KaoTech.
                    </p>

                    <form className="mt-4" action="#">
                      <div className="form-group">
                        <label htmlFor="phonenumber">PhoneNumber</label>
                        <input
                          type="text"
                          className="form-control"
                          id="phonenumber"
                          placeholder="Enter PhoneNumber"
                        />
                      </div>

                      <div ref={(ref)=>this.recaptcha=ref}></div>

                      <Row className="form-group mt-4">
                        <Col sm={6}>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customControlInline"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customControlInline"
                            >
                              Remember me
                            </label>
                          </div>
                        </Col>

                        <Col sm="6" className="text-right">
                          <button
                              disabled={!is_passed_recaptcha}
                            className="btn btn-primary w-md waves-effect waves-light"
                            onClick={this.onLogin}
                          >
                            Log In
                          </button>
                        </Col>
                      </Row>

                      {/*<Row className="form-group mt-2 mb-0">*/}
                      {/*  <div className="col-12 mt-3">*/}
                      {/*    <Link to="forget-password">*/}
                      {/*      <i className="mdi mdi-lock"></i> Forgot your*/}
                      {/*      password?*/}
                      {/*    </Link>*/}
                      {/*  </div>*/}
                      {/*</Row>*/}
                    </form>

                    <div className="mt-5 pt-4 text-center">
                      {/*<p>*/}
                      {/*  Don't have an account ?{" "}*/}
                      {/*  <Link*/}
                      {/*    to="register"*/}
                      {/*    className="font-weight-medium text-primary"*/}
                      {/*  >*/}
                      {/*    {" "}*/}
                      {/*    Signup now{" "}*/}
                      {/*  </Link>{" "}*/}
                      {/*</p>*/}
                      <p>
                        © {new Date().getFullYear()} KaoTech.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginUser: (param1, param2) => dispatch(loginUserAction(param1, param2)),
});

export default connect(null, mapDispatchToProps)(withRouter(Login));
