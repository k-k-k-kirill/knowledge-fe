import { styled } from "@mui/material/styles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export const ToggleContainer = styled(ToggleButtonGroup)`
  background-color: #f5f5f5;
  border-radius: 100px !important;
`;

export const Toggle = styled(ToggleButton)`
  display: flex;
  align-items: center;
  text-transform: none;
  border: none;
  border-radius: 100px !important;
  background-color: #f5f5f5;
  font-size: 0.875rem;
  font-weight: 500;
  width: 161px !important;
  padding: 10px 12px;

  &.Mui-selected {
    background-color: #ff9454;

    &:hover {
      background-color: #ff9454;
    }
  }
`;
