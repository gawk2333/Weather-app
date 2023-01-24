import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Modal, Message, Divider } from "semantic-ui-react";
import { toast } from "react-toastify";
import { LoginContext } from "../../../../store/loginContext";
import { signInApi } from "../../../../api/userApi";

function SignInPage({ signInFormOpen, setSignInFormOpen }) {
  const loginDispatch = useContext(LoginContext.Dispatch);
  const [errorMessage, setErrorMessage] = useState([]);

  const [signInForm, setsignInForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    let messageList = [];
    if (!signInForm.email || !signInForm.password) {
      messageList.push("All input is required.");
    }
    setErrorMessage(messageList);
  }, [signInForm.email, signInForm.password]);

  const signInHandler = async () => {
    const result = await signInApi(signInForm);
    if (!result.error) {
      const payload = {
        authToken: result.user.token,
        userProfile: {
          firstname: result.user.firstname,
          lastname: result.user.lastname,
          email: result.user.email,
        },
        markers: result.user.markers,
      };
      loginDispatch({
        type: LoginContext.types.LOGIN,
        payload,
      });
      setSignInFormOpen(false);
    } else {
      toast.error(result.message);
    }
  };
  return (
    <Modal
      onClose={() => setSignInFormOpen(false)}
      onOpen={() => setSignInFormOpen(true)}
      open={signInFormOpen}
      centered
    >
      <Modal.Header>Sign In</Modal.Header>
      <Modal.Content>
        <Form error>
          <Form.Group unstackable widths={2}>
            <Form.Input
              label="Email"
              placeholder="Email"
              onChange={(e) =>
                setsignInForm({
                  email: e.target.value,
                  password: signInForm.password,
                })
              }
              error={signInForm.email === ""}
            />
            <Form.Input
              label="PassWord"
              placeholder="Password"
              autoComplete="current-password"
              type="password"
              onChange={(e) =>
                setsignInForm({
                  email: signInForm.email,
                  password: e.target.value,
                })
              }
              error={signInForm.password === ""}
            />
          </Form.Group>
          <Divider />
          <Message
            hidden={errorMessage.length === 0}
            header="There was some errors with your submission"
            error
            list={errorMessage}
          />
          <Button onClick={signInHandler} primary>
            Sign In
          </Button>
          <Button onClick={() => setSignInFormOpen(false)} color="red">
            Cancel
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default SignInPage;
