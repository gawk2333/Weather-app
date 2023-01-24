import React, { useState, useContext, useEffect } from "react";
import { LoginContext } from "../../../../store/loginContext";
import { Form, Button, Modal, Message } from "semantic-ui-react";
import { signUpApi } from "../../../../api/userApi";
import { toast } from "react-toastify";

function SignUpPage({ signUpFormOpen, setSignUpFormOpen }) {
  const loginDispatch = useContext(LoginContext.Dispatch);
  const [emailValidation, setEmailValidation] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  const [signUpForm, setSignUpForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setEmailValidation(validateEmail(signUpForm.email));
  }, [signUpForm.email]);

  useEffect(() => {
    let messageList = [];
    if (
      !signUpForm.firstname ||
      !signUpForm.lastname ||
      !signUpForm.email ||
      !signUpForm.password
    ) {
      messageList.push("All input is required.");
    }
    if (!emailValidation) {
      messageList.push("Email is invalid.");
    }
    setErrorMessage(messageList);
  }, [
    emailValidation,
    signUpForm.email,
    signUpForm.firstname,
    signUpForm.lastname,
    signUpForm.password,
  ]);

  const signUpHandler = async () => {
    if (emailValidation) {
      const result = await signUpApi(signUpForm);
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
        setSignUpFormOpen(false);
      } else {
        toast.error(result.message);
      }
    } else {
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <Modal
      onClose={() => setSignUpFormOpen(false)}
      onOpen={() => setSignUpFormOpen(true)}
      open={signUpFormOpen}
      centered
    >
      <Modal.Header>Sign Up</Modal.Header>
      <Modal.Content>
        <Form error>
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
              error={signUpForm.firstname === ""}
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
              error={signUpForm.lastname === ""}
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
              error={!emailValidation}
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
              error={signUpForm.password === ""}
            />
          </Form.Group>
          <Message
            hidden={errorMessage.length === 0}
            header="There was some errors with your submission"
            error
            list={errorMessage}
          />
          <Button primary onClick={signUpHandler}>
            Sign Up
          </Button>
          <Button onClick={() => setSignUpFormOpen(false)} color="red">
            Cancel
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
}

export default SignUpPage;
