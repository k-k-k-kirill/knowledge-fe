import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { styled } from "@mui/material/styles";

export const StyledMarkdown = styled(ReactMarkdown)`
  pre {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 0.5em;
    overflow-x: auto;
  }

  code:not(pre > code) {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 0.2em 0.4em;
  }
`;
