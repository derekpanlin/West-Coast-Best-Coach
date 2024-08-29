import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import SideNavigation from "../components/SideNavigation/SideNavigation";
import "./Layout.css"

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user)

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        {isLoaded && (
          <>
            {sessionUser && <SideNavigation />} {/* Render SideNavigation if the user is logged in */}
            <Outlet />
          </>
        )}
        <Modal />
      </ModalProvider>
    </>
  );
}
