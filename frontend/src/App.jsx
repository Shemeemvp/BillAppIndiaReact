import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/index/Index";
import Login from "./components/login/Login";
import AdminPrivateRoutes from "./components/routes/AdminPrivateRoutes";
import AdminHome from "./components/admin/AdminHome";
import PaymentTerms from "./components/admin/PaymentTerms";
import AddPaymentTerm from "./components/admin/AddPaymentTerm";
import DemoClients from "./components/admin/DemoClients";
import PurchasedClients from "./components/admin/PurchasedClients";
import CompanyPrivateRoutes from "./components/routes/CompanyPrivateRoutes";
import Dashboard from "./components/user/Dashboard";
import Items from "./components/user/Items";
import AddItems from "./components/user/AddItems";
import EditTransaction from "./components/user/EditTransaction";
import ViewItem from "./components/user/ViewItem";
import EditItem from "./components/user/EditItem";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}></Route>
          <Route path="/login" element={<Login />}></Route>

          <Route element={<AdminPrivateRoutes />}>
            <Route path="/registered_clients" element={<AdminHome />}></Route>
            <Route path="/payment_terms" element={<PaymentTerms />}></Route>
            <Route path="/add_payment_terms" element={<AddPaymentTerm />}></Route>
            <Route path="/demo_clients" element={<DemoClients />}></Route>
            <Route path="/purchased_clients" element={<PurchasedClients />}></Route>
          </Route>

          <Route element={<CompanyPrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/items" element={<Items />}></Route>
            <Route path="/add_items" element={<AddItems />}></Route>
            <Route path="/edit_item/:itemId/" element={<EditItem />}></Route>
            <Route path="/view_item/:itemId/" element={<ViewItem />}></Route>
            <Route path="/edit_item_transaction/:transactionId/" element={<EditTransaction />}></Route>
          </Route>
        </Routes>  
      </BrowserRouter>
    </>
  );
}

export default App;
