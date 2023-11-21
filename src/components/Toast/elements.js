import styled from "styled-components";

export const ToastContainer = styled.div`
  position: fixed;
  width: 100%;
  left: 0;
  display: flex;
  justify-content: center;
  opacity: 0;
  top: -3rem;
  transition: opacity 0.2s ease-in-out, top 0.2s ease-in-out;
  &.show {
    top: 12vh;
    opacity: 1;
  }
`;

export const ToastOutput = styled.output`
  padding: 1rem;
  border-radius: 2rem;
  color: #171717;
  background-color: ${(props) =>
    props.type === "success" ? "#77dd77" : "#ff6961"};
`;
