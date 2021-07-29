import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import MetisMenu from "metismenujs";

import SimpleBar from "simplebar-react";
import { initBackendAPI } from "../../helpers/backend";

const SidebarContent = props => {
  const backendAPI = initBackendAPI();
  const user = backendAPI.getAuthenticatedUser();
  const role = user.role;
  //const role = 'police';

  const permissions = {
    'police': ['police'],
    'government': ['police', 'government'],
    'admin': ['police', 'government', 'kaotech']
  };
  const user_permissions = permissions[role];
  return (
    <div id="sidebar-menu">
      <ul className="metismenu list-unstyled" id="side-menu">

        <li>
          <Link to="/dashboard" className="waves-effect">
            <i className="ti-home"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="menu-title">Main</li>
        {/*POLICE Database */}
        {
          user_permissions.includes('police')?
            <>
              <li>
                <Link to="/#" className="has-arrow waves-effect">
                  <i className="ti-email"></i>
                  <span>DRIVERS LIST</span>
                </Link>
                <ul className="sub-menu" aria-expanded="false">
                  <li>
                    <Link to="/active_drivers">ACTIVE DRIVERS</Link>
                  </li>
                  <li>
                    <Link to="/wanted_drivers">WANTED DRIVERS</Link>
                  </li>
                  <li>
                    <Link to="/delinquent_drivers">TAX DELINQUENT DRIVERS</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/check_drivers" className="has-arrow waves-effect">
                  <i className="ti-package"></i>
                  <span>CHECK DRIVER</span>
                </Link>
              </li>

              <li>
                <Link to="/launch_emergency" className="has-arrow waves-effect">
                  <i className="ti-receipt"></i>
                  <span>LAUNCH EMERGENCY</span>
                </Link>
              </li>

              <li>
                <Link to="/add_summons" className="has-arrow waves-effect">
                  <i className="ti-pie-chart"></i>
                  <span>ADD SUMMONS</span>
                </Link>
              </li>
              <li>
                <Link to="/troubled_drivers" className="has-arrow waves-effect">
                  <i className="ti-pie-chart"></i>
                  <span>TROUBLE DRIVERS</span>
                </Link>
              </li>
            </>
           : null
        }


        {/*Government Database*/}
        {
          user_permissions.includes('government')?
              <>
                <li>
                  <Link to="/search_drivers" className="has-arrow waves-effect">
                    <i className="ti-package"></i>
                    <span>ALL DRIVERS</span>
                  </Link>
                </li>
                <li>
                  <Link to="/stop_emergency" className="has-arrow waves-effect">
                    <i className="ti-email"></i>
                    <span>STOP EMERGENCY</span>
                  </Link>
                </li>
                <li>
                  <Link to="/tax_status" className="has-arrow waves-effect">
                    <i className="ti-receipt"></i>
                    <span>TAX STATUS</span>
                  </Link>
                </li>
              </> :
              null
        }


        {/*KAOTECH*/}
        {
          user_permissions.includes('kaotech')?
              <>
                <li>
                <Link to="/drivers" className="has-arrow waves-effect">
                  <i className="ti-package"></i>
                  <span>DRIVER REGISTRATION</span>
                </Link>
              </li>
                <li>
                  <Link to="/polices" className="has-arrow waves-effect">
                    <i className="ti-email"></i>
                    <span>POLICE PRECINCT REGISTRATION</span>
                  </Link>
                </li>
                <li>
                  <Link to="/governments" className="has-arrow waves-effect">
                    <i className="ti-receipt"></i>
                    <span>GOVERNMENT REGISTRATION</span>
                  </Link>
                </li>
              </>:
              null
        }

      </ul>
    </div>
  );
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type) {
      this.initMenu();
    }
  }

  initMenu() {
    if (this.props.type !== "condensed" || this.props.isMobile) {
      new MetisMenu("#side-menu");

      var matchingMenuItem = null;
      var ul = document.getElementById("side-menu");
      var items = ul.getElementsByTagName("a");
      for (var i = 0; i < items.length; ++i) {
        if (this.props.location.pathname === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  activateParentDropdown = item => {
    item.classList.add("mm-active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active"); // li
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        {this.props.type !== "condensed" ? (
          <SimpleBar style={{ maxHeight: "100%" }}>
            <SidebarContent />
          </SimpleBar>
        ) : (
          <SidebarContent />
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Sidebar);
