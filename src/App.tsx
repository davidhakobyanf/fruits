import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './components/common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile/Profile.tsx';
import ProfileList from './pages/Profile/ProfileList';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import ToysSingle from './pages/Toys/ToysSingle.tsx';
import CreateToys from './pages/Toys/CreateToys';
import Toys from './pages/Toys/Toys.tsx';
import Categories from './pages/Categories/Categories.tsx';
import CreateCategories from './pages/Categories/CreateCategories';
import Order from './pages/Order.tsx';
import Home from './pages/Home.tsx';
import CategoriesSingleEdit from './pages/Categories/CategoriesSingleEdit.tsx';
function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Mytoy.am | Admin" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/toys/create"
          element={
            <>
              <PageTitle title="Mytoy.am | Create a toy" />
              <CreateToys />
            </>
          }
        />
        <Route
          path="/toys"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Toys />
            </>
          }
        />
        <Route
          path="/toys/:slug"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <ToysSingle />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Home />
            </>
          }
        />
        <Route
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <ProfileList />
            </>
          }
        />
        <Route
          path="/categories"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Categories />
            </>
          }
        />
        <Route
          path="/categories/create"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <CreateCategories />
            </>
          }
        />
        <Route
          path="/categories/:slug"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <CategoriesSingleEdit />
            </>
          }
        />
        <Route
          path="/profile/:slug"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Chart />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Order />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Mytoy.am | Toys" />
              <SignIn />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
