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
import Sales from "./components/user/Sales";
import AddSales from "./components/user/AddSales";
import ViewSales from "./components/user/ViewSales";
import EditSales from "./components/user/EditSales";
import Purchases from "./components/user/Purchases";
import AddPurchases from "./components/user/AddPurchases";
import EditPurchases from "./components/user/EditPurchases";
import ViewPurchases from "./components/user/ViewPurchases";
import StockReports from "./components/user/StockReports";
import Profile from "./components/user/Profile";
import ScrollToTop from "./components/ScrollToTop";
import Blog from "./components/index/Blog";
import SalesReports from "./components/user/SalesReports";
import PurchaseReports from "./components/user/PurchaseReports";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />}></Route>
          <Route path="/blog" element={<Blog />}></Route>
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
            <Route path="/profile" element={<Profile />}></Route>

            {/* Items */}
            <Route path="/items" element={<Items />}></Route>
            <Route path="/add_items" element={<AddItems />}></Route>
            <Route path="/edit_item/:itemId/" element={<EditItem />}></Route>
            <Route path="/view_item/:itemId/" element={<ViewItem />}></Route>
            <Route path="/edit_item_transaction/:transactionId/" element={<EditTransaction />}></Route>

            {/* Sales */}
            <Route path="/sales" element={<Sales />}></Route>
            <Route path="/add_sales" element={<AddSales />}></Route>
            <Route path="/edit_sales_bill/:saleId/" element={<EditSales />}></Route>
            <Route path="/view_sales_bill/:saleId/" element={<ViewSales />}></Route>
            
            {/* Purchase */}
            <Route path="/purchases" element={<Purchases />}></Route>
            <Route path="/add_purchases" element={<AddPurchases />}></Route>
            <Route path="/edit_purchase_bill/:purchaseId/" element={<EditPurchases />}></Route>
            <Route path="/view_purchase_bill/:purchaseId/" element={<ViewPurchases />}></Route>

            {/* Reports */}
            <Route path="/stock_reports" element={<StockReports />}></Route>
            <Route path="/sales_reports" element={<SalesReports />}></Route>
            <Route path="/purchase_reports" element={<PurchaseReports />}></Route>

          </Route>
        </Routes>  
      </BrowserRouter>
    </>
  );
}

export default App;
