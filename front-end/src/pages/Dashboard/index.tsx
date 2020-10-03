import React, { useEffect } from "react";
import { FiPower } from "react-icons/fi";

import { useAuth } from "../../hooks/Auth";
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
} from "./styles";
import logoImg from "../../assets/start/logo.svg";

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Welcome,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule></Schedule>
        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
