import React from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

export const ChatInput: React.FC<TextareaAutosizeProps> = (props) => {
  return (
    <TextareaAutosize
      minRows={1}
      maxRows={4}
      style={{
        flexGrow: 1,
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "12px",
        paddingBottom: "12px",
        border: "none",
        backgroundColor: "#f5f5f5",
        marginRight: "0.5rem",
        lineHeight: 1,
        overflowY: "auto",
        fontFamily: "Inter",
        borderRadius: "28px",
        resize: "none",
      }}
      {...props}
    />
  );
};
