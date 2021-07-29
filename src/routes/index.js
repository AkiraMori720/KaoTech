import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import VerifyCode from "../pages/Authentication/VerifyCode";
import CreatePwd from "../pages/Authentication/CreatePassword";

// Dashboard
import Dashboard from "../pages/Dashboard";

//Police
import ActiveDrivers from "../pages/police/ActiveDrivers";
import WantedDrivers from "../pages/police/WantedDrivers";
import DelinquentDrivers from "../pages/police/DelinquentDrivers";
import CheckDrivers from "../pages/police/CheckDrivers";
import LaunchEmergency from "../pages/police/LaunchEmergency";

//Government
import SearchDrivers from "../pages/government/SearchDrivers";
import StopEmergency from "../pages/government/StopEmergency";
import TaxStatus from "../pages/government/TaxStatus";

// KaoTech
import Drivers from "../pages/kaotech/Drivers";
import Polices from "../pages/kaotech/Polices";
import Governments from "../pages/kaotech/Governments";
import TroubledDrivers from "../pages/police/TroubledDrivers";
import AddSummons from "../pages/police/AddSummons";


const authProtectedRoutes = [
    // Police
  { path: "/active_drivers", component: ActiveDrivers },
  { path: "/wanted_drivers", component: WantedDrivers },
  { path: "/delinquent_drivers", component: DelinquentDrivers },
  { path: "/check_drivers", component: CheckDrivers },
  { path: "/launch_emergency", component: LaunchEmergency },
  { path: "/add_summons", component: AddSummons },
  { path: "/troubled_drivers", component: TroubledDrivers },

    //Government
  { path: "/search_drivers", component: SearchDrivers },
  { path: "/stop_emergency", component: StopEmergency },
  { path: "/tax_status", component: TaxStatus },

    // KAOTECH
  { path: "/drivers", component: Drivers },
  { path: "/polices", component: Polices },
  { path: "/governments", component: Governments },

  // Dashboard
  { path: "/dashboard", component: Dashboard },
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/verify", component: VerifyCode },
  { path: "/register", component: Register },
  { path: "/create-password", component: CreatePwd}
];

export { authProtectedRoutes, publicRoutes };
