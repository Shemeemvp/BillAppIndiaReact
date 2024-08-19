import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/index/Index";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}></Route>

          {/* <Route element={<AdminPrivateRoutes />}>
            <Route path="/admin_home" element={<AdminHome />}></Route>
          </Route> */}
        </Routes>  
      </BrowserRouter>
    </>
  );
}

export default App;
