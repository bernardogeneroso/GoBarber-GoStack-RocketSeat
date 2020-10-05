import React, { useCallback, useRef, ChangeEvent } from "react";
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";

import api from "../../services/api";

import { useToast } from "../../hooks/Toast";

import getValidationErrors from "../../utils/getValidationErrors";
import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer, AvatarInput } from "./styles";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("The Name field is required"),
          email: Yup.string()
            .required("The E-mail field is required")
            .email("Write a valid email"),
          old_password: Yup.string(),
          password: Yup.string().when("old_password", {
            is: (old_password) => !!old_password.length,
            then: Yup.string().required("Required field"),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when("password", {
              is: (password) => !!password.length,
              then: Yup.string().required("Required field"),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref("password"), undefined], "Passwords must match"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = Object.assign({
          name,
          email,

          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        });

        const response = await api.put("/profile", formData);

        updateUser(response.data);

        history.push("/dashboard");

        addToast({
          type: "success",
          title: "Updated profile",
          description: "The fields have been changed",
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const erros = getValidationErrors(err);

          formRef.current?.setErrors(erros);

          return;
        }

        addToast({
          type: "error",
          title: "Update error",
          description: err.response.data.message,
        });
      }
    },
    [addToast, history]
  );

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append("avatar", e.target.files[0]);

        api.patch("/users/avatar", data).then((response) => {
          updateUser(response.data);

          addToast({
            type: "success",
            title: "Change avatar",
            description: "Avatar has been changeed!",
          });
        });
      }
    },
    [addToast, updateUser]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <AnimationContainer>
          <Form
            ref={formRef}
            initialData={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}
          >
            <AvatarInput>
              <img src={user.avatar_url} alt={user.name} />
              <label htmlFor="avatar">
                <FiCamera />

                <input type="file" id="avatar" onChange={handleAvatarChange} />
              </label>
            </AvatarInput>

            <h1>My profile</h1>

            <Input name="name" icon={FiUser} type="text" placeholder="Name" />
            <Input
              name="email"
              icon={FiMail}
              type="email"
              placeholder="E-mail"
            />

            <Input
              containerStyle={{
                marginTop: 24,
              }}
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="Old password"
            />
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
              placeholder="Confirm password"
            />

            <Button type="submit">Change profile</Button>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Profile;
