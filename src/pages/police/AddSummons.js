import React, { Component } from "react";
import {Row, Col, Input, Label, Button, Modal} from "reactstrap";
import {DB_ACTION_UPDATE, getBackendAPI, TBL_DRIVERS} from "../../helpers/backend";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class AddSummonsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drivers: [],
      search_drivers: [],
      isAdding: false,
      adding_item: null
    };
    this.init();
  }

  init = async() => {
    let drivers = await getBackendAPI().getData(TBL_DRIVERS);
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

  onAddSummons = async (item) => {
   this.setState({isAdding: true, adding_item: item});
  }

  onAdd = async () => {
    const {adding_id, adding_item} = this.state;
    let location = document.getElementById('location').value;
    if(location.trim().length && adding_item.id) {
      let summons = adding_item.summons??[];
      summons.push({
        'location' : location,
        'datetime' : Date.now()
      });

      const params = {
        id: adding_item.id,
        summons
      }
      await getBackendAPI().setData(TBL_DRIVERS, DB_ACTION_UPDATE, params);
      this.setState({isAdding: false, adding_item: null});
      this.init();
    }
  }

  render() {
    const { search_drivers, isAdding } = this.state;
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
                            <th>PhoneNumber</th>
                            <th>City Of Work</th>
                            <th>Address</th>
                            <th>Number Of Summons</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            search_drivers.map((item, index) => (
                              <tr key={index}>
                                <th scope="row"><div
                                    className={item.alert ? "red-circle" : ""}>{index + 1}</div></th>
                                <td><img src={item.photo_url??""} alt={''} width={64} height={64}/></td>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>{item.phone_number}</td>
                                <td>{item.city_of_work}</td>
                                <td>{item.address}</td>
                                <td>{item.summons?item.summons.length:0}</td>
                                <td> <Button
                                    onClick={() => this.onAddSummons(item)}
                                    color="primary"
                                    className="mx-2"
                                >
                                  {" "}
                                  Add Summons{" "}
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
          <Modal
            isOpen={isAdding}
          >
            <div className="modal--content">
              <h2>Add Summon</h2>
              <Label for="location">location</Label>
              <Input
                  ref={(r) => this.location=r}
                  type="text"
                  id="location"
                  name="location"
              />
              <div className="float-right mt-4 d-flex">
                <Button
                    onClick={this.onAdd}
                    color="primary"
                    className="mx-2"
                    style={{ width: "100%", whiteSpace: "nowrap" }}
                >
                  {" "}
                  Add{" "}
                </Button>
                <Button
                    onClick={() => this.setState({isAdding: false, adding_item: null})}
                    color="secondary"
                    className="mx-2"
                    style={{ width: "100%", whiteSpace: "nowrap" }}
                >
                  {" "}
                  close{" "}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

export default AddSummonsPage;
