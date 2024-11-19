// https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/mui/src/RadioWidget/RadioWidget.tsx

import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import {
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  optionId,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils"
import { FocusEvent } from "react"

/** The `RadioWidget` is a widget for rendering a radio group.
 *  It is typically used with a string property constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function RadioWidget<
  T = any,  // eslint-disable-line
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,  // eslint-disable-line
>({
  id,
  options,
  value,
  label,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps<T, S, F>) {
  const enumOptions = [
    {
      label: "1KGP multi-ancestry panel (GRCh37)",
      description: "A reference panel consisting of unrelated subjects of diverse ancestries(N = 2504) from the 1000 Genomes Project (phase 3, version 5).The X-chromosome is included.",
      value: "multi-ancestry-panel-grch37",
    },
    {
      label: "TEST 1KGP multi-ancestry panel (GRCh37)",
      description: "FOR TEST SMALL DATA. A reference panel consisting of unrelated subjects of diverse ancestries(N = 2504) from the 1000 Genomes Project (phase 3, version 5).The X-chromosome is included.",
      value: "test-multi-ancestry-panel-grch37",
    },
    {
      label: "1KGP East Asian-ancestry panel (GRCh37)",
      description: "A reference panel consisting of unrelated subjects of East Asian ancestries(N = 504) from the 1000 Genomes Project (phase 3, version 5).The X-chromosome is included.",
      value: "east-asian-ancestry-panel-grch37",
    },
    {
      label: "1KGP multi-ancestry panel (GRCh38)",
      description: "A reference panel consisting of unrelated subjects of diverse ancestries(N = 2548) from the 1000 Genomes Project (30x on GRCh38).The X-chromosome is not included.",
      value: "multi-ancestry-panel-grch38",
    },
    {
      label: "TEST 1KGP multi-ancestry panel (GRCh38)",
      description: "FOR TEST SMALL DATA. A reference panel consisting of unrelated subjects of diverse ancestries(N = 2548) from the 1000 Genomes Project (30x on GRCh38).The X-chromosome is not included.",
      value: "test-multi-ancestry-panel-grch38",
    },
    {
      label: "1KGP East Asian-ancestry panel (GRCh38)",
      description: "A reference panel consisting of unrelated subjects of East Asian ancestries(N = 508) from the 1000 Genomes Project (30x on GRCh38).The X-chromosome is not included.",
      value: "east-asian-ancestry-panel-grch38",
    },
  ]
  const emptyValue = ""

  const _onChange = (_: any, value: any) => onChange(enumOptionsValueForIndex<S>(value, enumOptions, emptyValue))  // eslint-disable-line
  const _onBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
    onBlur(id, enumOptionsValueForIndex<S>(target && target.value, enumOptions, emptyValue))
  const _onFocus = ({ target }: FocusEvent<HTMLInputElement>) =>
    onFocus(id, enumOptionsValueForIndex<S>(target && target.value, enumOptions, emptyValue))

  const row = options ? options.inline : false
  const selectedIndex = enumOptionsIndexForValue<S>(value, enumOptions) ?? null

  return (
    <Box>
      <Box sx={{ mb: "0.5rem" }}>
        <Typography
          children={label}
          sx={{ fontSize: "1.1rem", fontWeight: "bold", mb: "0.75rem" }}
        />
        <Typography
          children="Please select the genotype imputation panel."
          sx={{ color: "#757575" }}
        />
      </Box>
      <RadioGroup
        id={id}
        name={id}
        value={selectedIndex}
        row={row as boolean}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        sx={{ ml: "1rem" }}
      >
        {Array.isArray(enumOptions) &&
          enumOptions.map((option, index) => {
            const radio = (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <FormControlLabel
                  control={
                    <Radio
                      name={id}
                      id={optionId(id, index)}
                      color="primary"
                    />
                  }
                  label={option.label}
                  value={String(index)}
                  key={index}
                />
                <Typography sx={{ ml: "2rem", color: "#757575", fontSize: "1rem", mb: "1rem" }}>
                  {option.description}
                </Typography>
              </Box>
            )
            return radio
          })}
      </RadioGroup>
    </Box>
  )
}
