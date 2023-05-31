import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const BaseModalContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${(props) => props.theme.palette.background.paper};
  padding: 2rem;
  min-width: 400px;
`;

export const BaseModalHeader = styled(Box)`
  margin-bottom: 1rem;
`;