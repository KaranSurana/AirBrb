import { React } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HostedListing from './components/HostedListingScreen/HostedListing';
import HostedListingCreate from './components/HostedListingCreate/HostedListingCreate';
import HostedListingEdit from './components/HostedListingEdit/HostedListingEdit';
import Login from './components/admin/Login.jsx';
import Register from './components/admin/Register.jsx';
import AllListingScreen from './components/AllListingScreen/AllListingScreen.jsx';
import { AuthProvider } from './utils/AuthContext.jsx';
import { NavigationWrapper } from './components/admin/NavWrapper.jsx';
import ListingDetailsParent from './components/ListingDetails/ListingDetailsParent.jsx';
import ManageHostingBooking from './components/bookings/ManageHostingBookings.jsx';

function App () {
  return (
    <AuthProvider>
      <Router>
        <NavigationWrapper>
          <Routes>
            <Route path="/" element={<AllListingScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hosted-listings" element={<HostedListing />} />
            <Route path="/edit/:id" element={<HostedListingEdit />} />
            <Route path="/new-listing" element={<HostedListingCreate />} />
            <Route path= "/listing-details/:id" element={<ListingDetailsParent />} />
            <Route path= "/manage-booking-requests/:id" element={<ManageHostingBooking />} />
          </Routes>
        </NavigationWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
