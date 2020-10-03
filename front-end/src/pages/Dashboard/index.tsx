import React, { useEffect, useState } from "react";
import { FiPower, FiClock } from "react-icons/fi";

import { useAuth } from "../../hooks/Auth";
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from "./styles";
import logoImg from "../../assets/start/logo.svg";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
        <Schedule>
          <h1>Scheduled times</h1>

          <p>
            <span>Hoje</span>
            <span>Dia 3</span>
            <span>Sexta-feira</span>
          </p>

          <NextAppointment>
            <strong>Attendance below</strong>

            <div>
              <img
                src="https://avatars0.githubusercontent.com/u/58465456?s=460&u=05a258c08282945ed4792189821c5b8ac17907de&v=4"
                alt="Bernardo Generoso"
              />

              <strong>Bernardo Generoso</strong>
              <span>
                <FiClock />
                10:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Morning</strong>

            <Appointment>
              <span>
                <FiClock />
                11:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/58465456?s=460&u=05a258c08282945ed4792189821c5b8ac17907de&v=4"
                  alt="Bernardo Generoso"
                />
                <strong>Bernardo Generoso</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                12:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/58465456?s=460&u=05a258c08282945ed4792189821c5b8ac17907de&v=4"
                  alt="Bernardo Generoso"
                />
                <strong>Bernardo Generoso</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Afternoon</strong>

            <Appointment>
              <span>
                <FiClock />
                15:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/58465456?s=460&u=05a258c08282945ed4792189821c5b8ac17907de&v=4"
                  alt="Bernardo Generoso"
                />
                <strong>Bernardo Generoso</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                16:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/58465456?s=460&u=05a258c08282945ed4792189821c5b8ac17907de&v=4"
                  alt="Bernardo Generoso"
                />
                <strong>Bernardo Generoso</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                17:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/58465456?s=460&u=05a258c08282945ed4792189821c5b8ac17907de&v=4"
                  alt="Bernardo Generoso"
                />

                <strong>Bernardo Generoso</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>
        <Calendar />
      </Content>
    </Container>
  );
};

export default Dashboard;
