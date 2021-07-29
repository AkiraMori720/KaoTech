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

class PolicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingPolice: false,
      polices: [],
      currentDriver: 0,
    };
    this.init();
  }

  componentDidMount() {
  }

  init = async() => {
    let polices = await getBackendAPI().getData(TBL_POLICES);
    console.log('polices', polices);
    this.setState({polices: polices});
  }

  handleImageSelect = (e) => {
    this.setState({imageSrc: URL.createObjectURL(e.target.files[0]), imageFile: e.target.files[0]});
  }

  addPolice = async() => {
    const { polices } = this.state;
    let name = document.getElementById('name').value;
    let first_name = document.getElementById('first_name').value;
    let last_name = document.getElementById('last_name').value;
    let phone_number = document.getElementById('phone_number').value;
    let city_of_work = document.getElementById('city_of_work').value;
    let address = document.getElementById('address').value;
    let passcode = document.getElementById('passcode').value;

    if(name.trim().length && first_name.trim().length && last_name.trim().length && phone_number.trim().length && city_of_work.trim().length  && address.trim().length && passcode.trim().length){

        const params = {
          name,
          first_name,
          last_name,
          phone_number,
          city_of_work,
          address,
          passcode,
        };

        await getBackendAPI().setData(TBL_POLICES, DB_ACTION_ADD, params);
        this.setState({addingPolice: false});
        this.init();
    }
  }


  onRemove = async(id) => {
    await getBackendAPI().setData(TBL_POLICES, DB_ACTION_DELETE, {id});
    this.init();
  }

  render() {
    const { imageSrc, addingPolice, polices } = this.state;
    return (
        <React.Fragment>
          <div className="container-fluid">
            <Row className="align-items-center">
              <Col sm={6}>
                <div className="page-title-box">
                  <h4 className="font-size-18">Police Precincts</h4>
                </div>
              </Col>
            </Row>
            {/*  Members */}
            <Row>
              <Col sm={12}>
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Police Precincts</h4>

                    <div className="table-responsive">
                      <table className="table table-striped mb-0">
                        <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>PhoneNumber</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>City Of Work</th>
                          <th>Address</th>
                          <th>Passcode</th>
                          <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          polices.map((item, index) => (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.name}</td>
                                <td>{item.phone_number}</td>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>{item.city_of_work}</td>
                                <td>{item.address}</td>
                                <td>*************</td>
                                <td><i className="mdi mdi-delete noti-icon" onClick={() => this.onRemove(item.id)}></i></td>
                              </tr>
                          ))
                        }
                        </tbody>
                      </table>
                    </div>

                    {!addingPolice?
                        <div className="float-right  mt-4">
                          <Button
                              color="primary"
                              className="btn btn-primary waves-effect waves-light"
                              onClick={()=>this.setState({addingPolice: true})}
                          >
                            Add +
                          </Button>
                        </div>
                        :
                        <div className="mt-4">
                          <Row  className="align-items-end">
                            <Col lg="2" className="form-group">
                              <Label for="name">Name</Label>
                              <Input
                                  ref={(r) => this.name_input=r}
                                  type="text"
                                  id="name"
                                  name="name"
                              />
                            </Col>
                            <Col lg="1" className="form-group">
                              <Label for="phone_number">PhoneNumber</Label>
                              <Input
                                  ref={(r) => this.phone_number=r}
                                  type="text"
                                  id="phone_number"
                                  name="phone_number"
                              />
                            </Col>
                            <Col lg="2" className="form-group">
                              <Label for="name">First Name</Label>
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
                              <Label for="city_of_work">City Of Work</Label>
                              <Input
                                  ref={(r) => this.city_of_work=r}
                                  type="text"
                                  id="city_of_work"
                                  name="city_of_work"
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
                            <Col lg="1" className="form-group">
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
                                onClick={this.addPolice}
                                color="primary"
                                className="mx-2"
                                style={{ width: "100%", whiteSpace: "nowrap" }}
                            >
                              {" "}
                              Add Police Precinct{" "}
                            </Button>
                            <Button
                                onClick={()=>this.setState({addingPolice: false})}
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

export default PolicesPage;
