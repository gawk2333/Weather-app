import React, { useState, useContext } from "react";
import { Form, Button, Modal } from "semantic-ui-react";
import { toast } from "react-toastify";
import { LoginContext } from "../../../../store/loginContext";
import { signInApi } from "../../../../api/userApi";

function SignInPage({ signInFormOpen, setSignInFormOpen }) {
  const loginDispatch = useContext(LoginContext.Dispatch);

  const [signInForm, setsignInForm] = useState({
    email: "",
    password: "",
  });

  const signInHandler = async () => {
    const result = await signInApi(signInForm);
    if (!result.error) {
      const payload = {
        authToken: result.authToken,
        userProfile: {
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
        },
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
      <Modal.Content>
        <Form>
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
            />
          </Form.Group>
          <Button onClick={signInHandler} primary>
            Sign In
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default SignInPage;
