import React, { useState, useContext } from "react";
import { LoginContext } from "../../../../store/loginContext";
import { Form, Button, Modal } from "semantic-ui-react";
import { signUpApi } from "../../../../api/userApi";
import { toast } from "react-toastify";

function SignUpPage({ signUpFormOpen, setSignUpFormOpen }) {
  const loginDispatch = useContext(LoginContext.Dispatch);
  const [signUpForm, setSignUpForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const signUpHandler = async () => {
    const result = await signUpApi(signUpForm);
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
      setSignUpFormOpen(false);
    } else {
      toast.error(result.message);
    }
  };
  return (
    <Modal
      onClose={() => setSignUpFormOpen(false)}
      onOpen={() => setSignUpFormOpen(true)}
      open={signUpFormOpen}
      centered
    >
      <Modal.Content>
        <Form>
          <Form.Group unstackable widths={2}>
            <Form.Input
              label="First name"
              placeholder="First name"
              onChange={(e) =>
                setSignUpForm({
                  ...signUpForm,
                  firstname: e.target.value,
                })
              }
            />
            <Form.Input
              label="Last name"
              placeholder="Last name"
              onChange={(e) =>
                setSignUpForm({
                  ...signUpForm,
                  lastname: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input
              label="Email"
              placeholder="Email"
              onChange={(e) =>
                setSignUpForm({
                  ...signUpForm,
                  email: e.target.value,
                })
              }
            />
            <Form.Input
              label="PassWord"
              placeholder="Password"
              autoComplete="current-password"
              type="password"
              onChange={(e) =>
                setSignUpForm({
                  ...signUpForm,
                  password: e.target.value,
                })
              }
            />
          </Form.Group>
          <Button onClick={signUpHandler}>Sign Up</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default SignUpPage;
