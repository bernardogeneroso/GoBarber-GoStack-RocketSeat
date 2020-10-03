import React, { useCallback, useRef } from "react";
import { FiLock } from "react-icons/fi";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { useHistory, useLocation } from "react-router-dom";

import { useToast } from "../../hooks/Toast";
import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, Background, AnimationContainer } from "./styles";

import logoImg from "../../assets/start/logo.svg";
import api from "../../services/api";

interface ResetPasswordFromData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();
  const location = useLocation();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFromData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required("The Password field is required"),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref("password"), undefined],
            "Passwords must match"
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;

        const token = location.search.replace("?token=", "");

        if (!token) {
          throw new Error();
        }

        await api.post("/password/reset", {
          token,
          password,
          password_confirmation,
        });

        addToast({
          type: "success",
          title: "Password as been changed",
        });

        history.push("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const erros = getValidationErrors(err);

          formRef.current?.setErrors(erros);

          return;
        }

        addToast({
          type: "error",
          title: "Error changing password",
        });
      }
    },
    [addToast, history, location.search]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recovery password</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="New password"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Password confirmation"
            />

            <Button type="submit">Change passowrd</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
