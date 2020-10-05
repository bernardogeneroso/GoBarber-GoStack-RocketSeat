import styled, { keyframes } from "styled-components";
import { shade } from "polished";

export const Container = styled.div`
  > header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: -176px auto 0;

  place-content: center;

  width: 100%;
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  > img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    background: #ff9000;
    border: 0;
    transition: background-color 0.2s;

    > input {
      display: none;
    }

    &:hover {
      background: ${shade(0.2, "#ff9000")};
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }
  }
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  animation: ${appearFromRight} 1s;

  form {
    display: flex;
    flex-direction: column;

    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      font-size: 20px;
      margin-bottom: 24px;
      text-align: left;
    }
  }
`;
