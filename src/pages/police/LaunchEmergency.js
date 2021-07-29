import React, {Component} from "react";
import {Row, Col, Input, Button, Modal, Label} from "reactstrap";
import {DB_ACTION_UPDATE, getBackendAPI, TBL_DRIVERS} from "../../helpers/backend";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class LaunchEmergencyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drivers: [],
            search_drivers: [],
            isAdding: false,
            adding_id: null,
        };
        this.init();
    }

    init = async () => {
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

    onAddEmergency = (id) => {
        this.setState({isAdding: true, adding_id: id});
    }

    onAdd = async () => {
        const {adding_id} = this.state;
        let comment = document.getElementById('comment').value;
        if(comment.trim().length && adding_id){
            const params = {
                id: adding_id,
                alert_comment: comment,
                alert: 1
            }
            await getBackendAPI().setData(TBL_DRIVERS, DB_ACTION_UPDATE, params);
            this.setState({isAdding: false, adding_id: null});
            this.init();
        }
    }

    render() {
        const {search_drivers, isAdding} = this.state;
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
                                ref={(r) => this.search_text = r}
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
                                                        <th scope="row">
                                                            <div
                                                                className={item.alert ? "red-circle" : ""}>{index + 1}</div>
                                                        </th>
                                                        <td><img src={item.photo_url ?? ""} alt={''} width={64}
                                                                 height={64}/></td>
                                                        <td>{item.first_name}</td>
                                                        <td>{item.last_name}</td>
                                                        <td>{item.birthday}</td>
                                                        <td>{item.phone_number}</td>
                                                        <td>{item.city_of_work}</td>
                                                        <td>{item.address}</td>
                                                        <td> {!item.alert ? <Button
                                                            onClick={() => this.onAddEmergency(item.id)}
                                                            color="primary"
                                                            className="mx-2"
                                                        >
                                                            {" "}
                                                            Add Emergency{" "}
                                                        </Button> : null
                                                        }
                                                        </td>
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
                            <h2>Add Emergency</h2>
                            <Label for="comment" className="mt-4">Comment</Label>
                            <Input
                                ref={(r) => this.comment=r}
                                type={'textarea'}
                                id="comment"
                                className="emergency--comment"
                                name="comment"
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
                                    onClick={() => this.setState({isAdding: false, adding_id: null})}
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

export default LaunchEmergencyPage;
