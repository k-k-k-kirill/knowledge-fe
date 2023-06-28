import { styled } from "@mui/material/styles";
import { TableRow } from "@mui/material";

export const ClickableTableRow = styled(TableRow)`
  td {
    padding: 1.5rem;
  }

  &:hover {
    cursor: pointer;
  }

  &:last-child td,
  &:last-child th {
    border: none;
  }
`;
