import { Fragment } from "react/jsx-runtime";
import { Provider } from "react-redux";
import { Home } from "./Pages/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Page404 } from "./Pages/404";
import { Leave } from "./Pages/Leave";
import { reduxStore } from "./redux";

function App() {
  return (
    <Provider store={reduxStore}>
      <Fragment>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="home" />} />

            <Route path="*" element={<Page404 />} />
            <Route path="home" element={<Home />} />
            <Route path="leave/ID/:leaveid/*" element={<Leave />} />
          </Routes>
        </BrowserRouter>
      </Fragment>
    </Provider>
  );
}

export default App;
