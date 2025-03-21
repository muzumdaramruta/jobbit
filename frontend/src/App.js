import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
import Home from "./components/Home";
import About from "./components/About";
import JobListings from "./components/JobListings";
import Contact from "./components/Contact";
import FAQs from "./components/FAQs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import CompanyList from "./components/CompanyList";
import Company from "./components/Company";
import ProfilePage from "./components/ProfilePage";
import Job from "./components/Job";
import EditProfile from "./components/EditProfile";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import EditJob from "./components/EditJob.js";
import CreateJob from "./components/CreateJob";
import PageNotFound from "./components/PageNotFound";
import Employees from "./components/Employees";
import CreateCompany from "./components/CreateCompany";
import EditCompany from "./components/EditCompany";
import OtherUserProfile from "./components/OtherUserProfile.js";


function App() {
    return (
        <Router>
            <div className="App d-flex flex-column min-vh-100">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/jobs" element={<JobListings />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/company-list" element={<CompanyList />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/company/:id" element={<Company />} />
                    <Route path="/jobs/:id" element={<Job />} />
                    <Route path="/edit-job/:id" element={<EditJob />} />
                    <Route path="/create-job/:id" element={<CreateJob />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/create-company" element={<CreateCompany />} />
                    <Route path="/edit-company/:id" element={<EditCompany />} />
                    <Route path="/FAQs" element={<FAQs />} />
                    <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                    <Route path="/users/:id" element={<OtherUserProfile />} />
                    {/* Route for 404 Not Found */}
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
