import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { LoginContext } from "../../store/loginContext";
import styles from "./headerBar.module.css";
import { Icon, Popup, Checkbox, Button, Dropdown } from "semantic-ui-react";
import { SignInPage, SignUpPage } from "./components/auth";
import { getWeatherByGeoPositionApi } from "../../api/weatherApi";
import { toast } from "react-toastify";

export default function HeaderBar({
  showSidebar,
  setShowSidebar,
  userLocation,
  isMarker,
  setIsMarker,
}) {
  const [userState, setUserState] = useState(null);
  const [signInFormOpen, setSignInFormOpen] = useState(false);
  const [signUpFormOpen, setSignUpFormOpen] = useState(false);
  const loginState = useContext(LoginContext.State);
  const loginDispatch = useContext(LoginContext.Dispatch);

  const handleSignOut = useCallback(() => {
    loginDispatch({ type: LoginContext.types.LOGOUT });
  }, [loginDispatch]);

  const options = useMemo(() => {
    if (loginState.loggedIn === true) {
      return [
        {
          key: "sign-out",
          icon: "sign-out",
          text: "Sign out",
          value: "sign-out",
          onClick: () => handleSignOut(),
        },
      ];
    } else if (loginState.loggedIn === false) {
      return [
        {
          key: "sign-in",
          icon: "sign-in",
          text: "Sign in",
          value: "sign-in",
          onClick: () => setSignInFormOpen(!signInFormOpen),
        },
        {
          key: "sign-up",
          icon: "pen square",
          text: "Sign up",
          value: "sign-up",
          onClick: () => setSignUpFormOpen(!signUpFormOpen),
        },
      ];
    }
  }, [handleSignOut, loginState.loggedIn, signInFormOpen, signUpFormOpen]);

  useEffect(() => {
    try {
      const fetchUserWeather = async (position) => {
        const result = await getWeatherByGeoPositionApi(position);
        if (result) {
          setUserState(result);
        }
      };
      if (userLocation) {
        fetchUserWeather(userLocation);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [userLocation]);

  return (
    <>
      <div className={styles.header}>
        <div as="h1" className={styles.logo}>
          Weather App
          {/* <AuthenticationButton /> */}
        </div>
        <div className="spacer" />
        {userState && (
          <>
            <div as="h3" className={styles.logo}>
              {userState.location.name}
            </div>
            <div
              as="h3"
              className={styles.logo}
            >{`${userState.current.temp_c}℃`}</div>
            <img src={userState.current.condition.icon} alt="" />
            <div as="h3" className={styles.logo}>
              {userState.current.condition.text}
            </div>
          </>
        )}
        <div className="halfspacer" />
        <Checkbox
          toggle
          label="Use marker"
          checked={isMarker}
          onChange={() => setIsMarker(!isMarker)}
          style={{ marginTop: 8 }}
        />
        <div className="halfspacer" />
        <Popup
          trigger={
            <Icon
              onClick={() => setShowSidebar(!showSidebar)}
              name="map marker alternate"
              color="orange"
              size="large"
              style={{ cursor: "pointer", marginTop: 8 }}
            />
          }
          content="Saved markers"
        />
        <Button.Group color="black">
          <Button icon="list"></Button>
          <Dropdown
            className="button icon"
            floating
            options={options}
            trigger={<></>}
            style={{ zIndex: 1000 }}
          />
        </Button.Group>
      </div>
      <SignInPage
        setSignInFormOpen={setSignInFormOpen}
        signInFormOpen={signInFormOpen}
      />
      <SignUpPage
        setSignUpFormOpen={setSignUpFormOpen}
        signUpFormOpen={signUpFormOpen}
      />
    </>
  );
}
