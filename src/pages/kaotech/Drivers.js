import React, { Component } from "react";
import { Row, Col, Input, Label, Button } from "reactstrap";
import {DB_ACTION_ADD, DB_ACTION_DELETE, getBackendAPI, TBL_DRIVERS, TBL_GOVERNMENTS} from "../../helpers/backend";
import ImageUpload from 'image-upload-react'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class DriversPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingDriver: false,
      drivers: [],
      currentDriver: 0,
      imageSrc: '',
      imageFile: null,
    };
    this.init();
  }

  componentDidMount() {
  }

  init = async() => {
    let drivers = await getBackendAPI().getData(TBL_DRIVERS);
    console.log('teams', drivers);
    this.setState({drivers: drivers});
  }

  handleImageSelect = (e) => {
    this.setState({imageSrc: URL.createObjectURL(e.target.files[0]), imageFile: e.target.files[0]});
  }

  addDriver = async() => {
    const { drivers, imageFile } = this.state;
    let newDrivers = drivers;
    let first_name = document.getElementById('first_name').value;
    let last_name = document.getElementById('last_name').value;
    let birthday = document.getElementById('birthday').value;
    let phone_number = document.getElementById('phone_number').value;
    let city_of_work = document.getElementById('city_of_work').value;
    let address = document.getElementById('address').value;

    if(first_name.trim().length && last_name.trim().length && birthday.trim().length && phone_number.trim().length && city_of_work.trim().length  && address.trim().length){
      if (imageFile) {
        console.log('imageFIle', imageFile);
        getBackendAPI().uploadMedia(TBL_DRIVERS, imageFile).then(async (image_url) => {
          await this.updateData({
            first_name,
            last_name,
            birthday,
            phone_number,
            photo_url: image_url,
            city_of_work,
            address,
            tax_status: 'current',
            alert: 0
          });
        }).catch((error) => {
          console.log('err', error);
        })
      } else {
        await this.updateData({
            first_name,
            last_name,
            birthday,
            phone_number,
            photo_url: '',
            city_of_work,
            address,
            tax_status: 'current',
            alert: 0
        });
      }
    }
  }

  onRemove = async(id) => {
    await getBackendAPI().setData(TBL_GOVERNMENTS, DB_ACTION_DELETE, {id});
    this.init();
  }

  updateData = async (params) => {
    await getBackendAPI().setData(TBL_DRIVERS, DB_ACTION_ADD, params);
    this.setState({addingDriver: false});
    this.init();
  }

  render() {
    const { imageSrc, addingDriver, drivers } = this.state;
    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Drivers</h4>
              </div>
            </Col>
          </Row>
            {/*  Members */}
            <Row>
              <Col sm={12}>
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Drivers</h4>

                    <div className="table-responsive">
                      <table className="table table-striped mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Photo</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Birthday</th>
                            <th>PhoneNumber</th>
                            <th>City Of Work</th>
                            <th>Address</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            drivers.map((item, index) => (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td><img src={item.photo_url??""} alt={''} width={64} height={64}/></td>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>{item.birthday}</td>
                                <td>{item.phone_number}</td>
                                <td>{item.city_of_work}</td>
                                <td>{item.address}</td>
                                <td><i className="mdi mdi-delete noti-icon" onClick={() => this.onRemove(item.id)}></i></td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>

                      {!addingDriver?
                        <div className="float-right  mt-4">
                          <Button
                              color="primary"
                              className="btn btn-primary waves-effect waves-light"
                              onClick={()=>this.setState({addingDriver: true})}
                            >
                            Add +
                          </Button>
                        </div>
                      :
                      <div className="mt-4">
                      <Row  className="align-items-end">
                        <Col lg="2" className="form-group">
                          <Label for="name">Photo</Label>
                          <ImageUpload
                              handleImageSelect={this.handleImageSelect}
                              imageSrc={imageSrc}
                              setImageSrc={(image) => this.setState({imageSrc: '', imageFile: null})}
                              style={{
                                width: 100,
                                height: 100,
                                background: '#f2f2f2'
                              }}
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
                        <Col lg="1" className="form-group">
                          <Label for="birthday">Birthday</Label>
                          <Input
                            ref={(r) => this.birthday=r}
                            type="text"
                            id="birthday"
                            name="birthday"
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
                      </Row>
                      <div className="float-right d-flex">
                        <Button
                          onClick={this.addDriver}
                          color="primary"
                          className="mx-2"
                          style={{ width: "100%", whiteSpace: "nowrap" }}
                        >
                          {" "}
                          Add Driver{" "}
                        </Button>
                        <Button
                          onClick={()=>this.setState({addingDriver: false})}
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

export default DriversPage;
