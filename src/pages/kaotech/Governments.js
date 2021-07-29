import React, { Component } from "react";
import { Row, Col, Input, Label, Button } from "reactstrap";
import {
  DB_ACTION_ADD,
  DB_ACTION_DELETE,
  getBackendAPI,
  TBL_DRIVERS,
  TBL_GOVERNMENTS,
  TBL_POLICES
} from "../../helpers/backend";
import ImageUpload from 'image-upload-react'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class GovernmentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingGovernment: false,
      governments: [],
      currentDriver: 0,
    };
    this.init();
  }

  componentDidMount() {
  }

  init = async() => {
    let governments = await getBackendAPI().getData(TBL_GOVERNMENTS);
    console.log('governments', governments);
    this.setState({governments: governments});
  }

  handleImageSelect = (e) => {
    this.setState({imageSrc: URL.createObjectURL(e.target.files[0]), imageFile: e.target.files[0]});
  }

  addGovernment = async() => {

    let agency_type = document.getElementById('agency_type').value;
    let phone_number = document.getElementById('phone_number').value;
    let first_name = document.getElementById('first_name').value;
    let last_name = document.getElementById('last_name').value;
    let address = document.getElementById('address').value;
    let passcode = document.getElementById('passcode').value;

    if(agency_type.trim().length && first_name.trim().length && last_name.trim().length && phone_number.trim().length && address.trim().length && passcode.trim().length){

      const params = {
        agency_type,
        phone_number,
        first_name,
        last_name,
        address,
        passcode,
      };

      await getBackendAPI().setData(TBL_GOVERNMENTS, DB_ACTION_ADD, params);
      this.setState({addingGovernment: false});
      this.init();
    }
  }

  onRemove = async(id) => {
    await getBackendAPI().setData(TBL_GOVERNMENTS, DB_ACTION_DELETE, {id});
    this.init();
  }

  render() {
    const { imageSrc, addingGovernment, governments } = this.state;
    return (
        <React.Fragment>
          <div className="container-fluid">
            <Row className="align-items-center">
              <Col sm={6}>
                <div className="page-title-box">
                  <h4 className="font-size-18">Governments</h4>
                </div>
              </Col>
            </Row>
            {/*  Members */}
            <Row>
              <Col sm={12}>
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Governments</h4>

                    <div className="table-responsive">
                      <table className="table table-striped mb-0">
                        <thead>
                        <tr>
                          <th>#</th>
                          <th>Agency Type</th>
                          <th>PhoneNumber</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Address</th>
                          <th>Passcode</th>
                          <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          governments.map((item, index) => (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.agency_type}</td>
                                <td>{item.phone_number}</td>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>{item.address}</td>
                                <td>*************</td>
                                <td><i className="mdi mdi-delete noti-icon" onClick={() => this.onRemove(item.id)}></i></td>
                              </tr>
                          ))
                        }
                        </tbody>
                      </table>
                    </div>

                    {!addingGovernment?
                        <div className="float-right  mt-4">
                          <Button
                              color="primary"
                              className="btn btn-primary waves-effect waves-light"
                              onClick={()=>this.setState({addingGovernment: true})}
                          >
                            Add +
                          </Button>
                        </div>
                        :
                        <div className="mt-4">
                          <Row  className="align-items-end">
                            <Col lg="2" className="form-group">
                              <Label for="agency_type">Name</Label>
                              <Input
                                  ref={(r) => this.agency_type=r}
                                  type="text"
                                  id="agency_type"
                                  name="agency_type"
                              />
                            </Col>
                            <Col lg="2" className="form-group">
                              <Label for="phone_number">PhoneNumber</Label>
                              <Input
                                  ref={(r) => this.phone_number=r}
                                  type="text"
                                  id="phone_number"
                                  name="phone_number"
                              />
                            </Col>
                            <Col lg="2" className="form-group">
                              <Label for="first_name">First Name</Label>
                              <Input
                                  ref={(r) => this.first_name=r}
                                  type="text"
                                  id="first_name"
                                  name="first_name"
                              />
                            </Col>
                            <Col lg="2" className="form-group">
                              <Label for="last_name">Last Name</Label>
                              <Input
                                  ref={(r) => this.last_name=r}
                                  type="text"
                                  id="last_name"
                                  name="last_name"
                              />
                            </Col>
                            <Col lg="2" className="form-group">
                              <Label for="address">Address</Label>
                              <Input
                                  ref={(r) => this.address=r}
                                  type="text"
                                  id="address"
                                  name="address"
                              />
                            </Col>
                            <Col lg="2" className="form-group">
                              <Label for="passcode">Passcode</Label>
                              <Input
                                  ref={(r) => this.passcode=r}
                                  type="password"
                                  id="passcode"
                                  name="passcode"
                              />
                            </Col>
                          </Row>
                          <div className="float-right d-flex">
                            <Button
                                onClick={this.addGovernment}
                                color="primary"
                                className="mx-2"
                                style={{ width: "100%", whiteSpace: "nowrap" }}
                            >
                              {" "}
                              Add Government{" "}
                            </Button>
                            <Button
                                onClick={()=>this.setState({addingGovernment: false})}
                                color="secondary"
                                style={{ width: "100%" }}
                            >
                              {" "}
                              Close{" "}
                            </Button>
                          </div>
                        </div>
                    }

                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </React.Fragment>
    );
  }
}

export default GovernmentsPage;
