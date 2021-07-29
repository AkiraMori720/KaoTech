import React, { Component } from "react";
import {Row, Col, Input, Label, Button} from "reactstrap";
import {DB_ACTION_ADD, DB_ACTION_UPDATE, getBackendAPI, TBL_DRIVERS, TBL_GOVERNMENTS} from "../../helpers/backend";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class StopEmergencyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drivers: [],
      search_drivers: [],
    };
    this.init();
  }

  init = async() => {
    let drivers = await getBackendAPI().getData(TBL_DRIVERS);
    drivers = drivers.filter(d => d.alert);
    console.log('teams', drivers);
    this.setState({drivers: drivers, search_drivers: drivers});
  }

  onChangeText = (e) => {
    const search_text = e.target.value.trim();
    const {drivers} = this.state;
    const search_drivers = drivers.filter(d =>
        d.first_name.indexOf(search_text) > -1 || d.last_name.indexOf(search_text) > -1
        || d.phone_number.indexOf(search_text) > -1 || d.address.indexOf(search_text) > -1);
    this.setState({search_drivers});
  }

  onStopAlert = async (id) => {
    const params = {
      id,
      alert: 0
    }
    await getBackendAPI().setData(TBL_DRIVERS, DB_ACTION_UPDATE, params);
    this.init();
}

  render() {
    const { search_drivers } = this.state;
    return (
      <React.Fragment>
        <div className="container-fluid">
          <Row className="align-items-center">
            <Col sm={6}>
              <div className="page-title-box">
                <h4 className="font-size-18">Drivers</h4>
              </div>
            </Col>
            <Col sm={6}>
              <Input
                  ref={(r) => this.search_text=r}
                  placeholder="Search"
                  type="text"
                  id="search_text"
                  name="search_text"
                  onChange={this.onChangeText}
              />
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
                            search_drivers.map((item, index) => (
                              <tr key={index}>
                                <th scope="row"><div className="red-circle">{index + 1}</div></th>
                                <td><img src={item.photo_url??""} alt={''} width={64} height={64}/></td>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>{item.birthday}</td>
                                <td>{item.phone_number}</td>
                                <td>{item.city_of_work}</td>
                                <td>{item.address}</td>
                                <td> <Button
                                    onClick={() => this.onStopAlert(item.id)}
                                    color="primary"
                                    className="mx-2"
                                >
                                  {" "}
                                  Stop Emergency{" "}
                                </Button></td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                </Col>
            </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default StopEmergencyPage;
