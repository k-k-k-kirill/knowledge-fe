import { styled } from "@mui/system";
import { ReactComponent as ArrowLeft } from "../../../../assets/arrow-left.svg";
import { ReactComponent as ArrowRight } from "../../../../assets/arrow-right.svg";

const arrowStyles = `
transition: all 0.2s ease-in-out;

&:hover {
  path {
    stroke: #272727;
  }
}
`;

export const SourcesArrowLeft = styled(ArrowLeft)`
  ${arrowStyles}
`;

export const SourcesArrowRight = styled(ArrowRight)`
  ${arrowStyles}
`;
