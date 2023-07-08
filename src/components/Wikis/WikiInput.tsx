import { FieldArray, useFormikContext } from "formik";
import { Autocomplete } from "@mui/lab";
import { Chip, TextField } from "@mui/material";
import {
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
} from "@mui/material";
import { Wiki } from "../../types";
import React from "react";
import { ReactComponent as DropdownIcon } from "../../assets/dropdown.svg";

interface WikiInputProps {
  wikiOptions: Wiki[];
}

interface FormValues {
  name: string;
  wikis: Wiki[];
}

export const WikiInput: React.FC<WikiInputProps> = ({ wikiOptions }) => {
  const { values, setFieldValue } = useFormikContext<FormValues>();
  return (
    <FieldArray name="wikis">
      {() => (
        <Autocomplete
          multiple
          id="wikis"
          options={wikiOptions || []}
          getOptionLabel={(option: Wiki) => option.name}
          value={values.wikis}
          onChange={(event: any, newValue: Wiki[]) => {
            setFieldValue("wikis", newValue);
          }}
          popupIcon={<DropdownIcon style={{ marginTop: "0.25rem" }} />}
          renderTags={(
            value: any,
            getTagProps: AutocompleteRenderGetTagProps
          ) =>
            value.map((option: Wiki, index: number) => (
              <Chip
                variant="outlined"
                label={option.name}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField
              sx={{
                fontSize: "0.875rem",
                paddingLeft: "0.75rem",
                paddingRight: "0.5rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                marginBottom: "2rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              {...params}
              variant="outlined"
              placeholder="Add wikis"
              InputLabelProps={{
                shrink: false,
                style: { fontSize: 14 },
              }}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                style: {
                  padding: 0,
                  fontSize: "0.875rem",
                  color: "#272727",
                },
              }}
              style={{
                backgroundColor: "#F5F5F5",
                borderRadius: 28,
              }}
            />
          )}
        />
      )}
    </FieldArray>
  );
};
