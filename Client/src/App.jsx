import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import MerchantSignup from "./Pages/Merchant/MerchantSignup";
import MerchantLogin from "./Pages/Merchant/MerchantLogin";
import MerchantDashboard from "./Pages/Merchant/MerchantDashboard";
import YourAllProducts from "./Pages/Merchant/YourAllProducts";
import YourEachProduct from "./Pages/Merchant/YourEachProduct";
import CustomerSignup from "./Pages/Customer/CustomerSignup";
import CustomerLogin from "./Pages/Customer/CustomerLogin";
import CustomerDashboard from "./Pages/Customer/CustomerDashboard";
import AllProducts from "./Components/CustomerComponents/AllProducts";
import EachProduct from "./Pages/Customer/EachProduct";
import Contact from "./Pages/Contact";


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            {/* Start For Merchants */}
            <Route path="/merchant/signup" element={<MerchantSignup />} />
            <Route path="/merchant/login" element={<MerchantLogin />} />
            <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
            <Route path="/merchant/my-products" element={<YourAllProducts />} />
            <Route path="/merchant/my-products/:id" element={<YourEachProduct />} />
            {/* End For Merchants */}

            {/* Start For Customers */}
            <Route path="/customer/signup" element={<CustomerSignup />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/products" element={<AllProducts />} />
            <Route path="/customer/products/:id" element={<EachProduct />} />
            {/* End For Customers */}
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
