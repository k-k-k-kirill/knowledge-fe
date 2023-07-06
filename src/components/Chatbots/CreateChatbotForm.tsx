import React from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Button, Box, TextField, Chip } from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { Wikis as WikisApi } from "../../api/Wikis";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  AutocompleteRenderInputParams,
  AutocompleteRenderGetTagProps,
} from "@mui/material";
import { Wiki } from "../../types";
import { useAuth0 } from "@auth0/auth0-react";
import { TextInput } from "../Forms/TextInput/TextInput";
import { ReactComponent as DropdownIcon } from "../../assets/dropdown.svg";
import { useNavigate } from "react-router-dom";

interface CreateChatbotFormProps {
  onCancel: () => void;
}

interface CreateChatbotParams {
  name: string;
  wikiIds: string[];
}

const CreateChatbotSchema = Yup.object().shape({
  name: Yup.string().required("Chatbot name is required"),
  wikis: Yup.array().min(1, "At least one wiki must be selected"),
});

export const CreateChatbotForm: React.FC<CreateChatbotFormProps> = ({
  onCancel,
}) => {
  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: wikis } = useQuery({
    queryKey: ["wikis"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      return wikisApi.getAll();
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ name, wikiIds }: CreateChatbotParams) => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      const chatbotId = await chatbotsApi.create(name, wikiIds);
      return chatbotId;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chatbots"] });
      navigate(`/chatbots/${data}`);
      onCancel();
    },
    onError: () => onCancel(),
  });

  return (
    <Formik
      validationSchema={CreateChatbotSchema}
      initialValues={{ name: "", wikis: [] }}
      onSubmit={(values) => {
        mutation.mutate({
          name: values.name,
          wikiIds: values.wikis.map((wiki: Wiki) => wiki.id),
        });
        onCancel();
      }}
    >
      {({ errors, values, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <TextInput
            sx={{ marginBottom: "1rem" }}
            type="text"
            id="outlined-basic"
            name="name"
            placeholder="Chatbot name"
            variant="outlined"
            required={true}
            error={!!errors.name}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={errors.name ?? ""}
          />
          <FieldArray name="wikis">
            {() => (
              <Autocomplete
                multiple
                id="wikis"
                options={wikis || []}
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
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ marginRight: "1rem" }}
              onClick={onCancel}
              variant="text"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
