import { styled } from "@mui/material/styles";

export const ChatLoaderContainer = styled("div")`
  padding: 12px 12px;
  background-color: #f5f5f5; // Grey color
  border-radius: 25px; // Circular edges
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const ChatLoader = styled("div")`
  display: inline-block;
  position: relative;
  width: 40px;
  height: 10px;

  & > div {
    position: absolute;
    top: 0;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.4);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
  }

  & > div:nth-child(1) {
    left: 0px;
    animation-name: dot1;
  }

  & > div:nth-child(2) {
    left: 15px;
    animation-name: dot2;
    animation-delay: 0.2s;
  }

  & > div:nth-child(3) {
    left: 30px;
    animation-name: dot3;
    animation-delay: 0.4s;
  }

  @keyframes dot1 {
    0%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-6px);
    }
  }

  @keyframes dot2 {
    0%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-6px);
    }
  }

  @keyframes dot3 {
    0%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-6px);
    }
  }
`;
