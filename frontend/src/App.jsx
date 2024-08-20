import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/index/Index";
import Login from "./components/login/Login";
import AdminPrivateRoutes from "./components/routes/AdminPrivateRoutes";
import AdminHome from "./components/admin/AdminHome";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}></Route>
          <Route path="/login" element={<Login />}></Route>

          <Route element={<AdminPrivateRoutes />}>
            <Route path="/registered_clients" element={<AdminHome />}></Route>
          </Route>
        </Routes>  
      </BrowserRouter>
    </>
  );
}

export default App;
