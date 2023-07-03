import { styled } from "@mui/material/styles";

export const TextInputContainer = styled("div")`
  display: flex;
  flex-direction: column;
`;

export const TextInputField = styled("input")`
  border-radius: 28px;
  padding: 1rem;
  font-size; 0.875rem;
  background-color: #F5F5F5;
  font-family: Inter, Roboto;
  border: none;
`;

export const ErrorMessage = styled("div")`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  margin-left: 1rem;
  color: #ff9454;
`;
