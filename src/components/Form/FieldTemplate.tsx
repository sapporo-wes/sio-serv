// https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/mui/src/FieldTemplate/FieldTemplate.tsx

import { Box } from "@mui/material"
import FormControl from "@mui/material/FormControl"
import {
  FieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  getTemplate,
  getUiOptions,
} from "@rjsf/utils"

/** The `FieldTemplate` component is the template used by `SchemaField` to render any field. It renders the field
 * content, (label, description, children, errors and help) inside of a `WrapIfAdditional` component.
 *
 * @param props - The `FieldTemplateProps` for this component
 */
export default function FieldTemplate<
  T = any, // eslint-disable-line
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any, // eslint-disable-line
>(props: FieldTemplateProps<T, S, F>) {
  const {
    id,
    children,
    classNames,
    style,
    disabled,
    displayLabel,
    hidden,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    rawErrors = [],
    errors,
    help,
    description,
    rawDescription,
    schema,
    uiSchema,
    registry,
  } = props
  const uiOptions = getUiOptions<T, S, F>(uiSchema)
  const WrapIfAdditionalTemplate = getTemplate<"WrapIfAdditionalTemplate", T, S, F>(
    "WrapIfAdditionalTemplate",
    registry,
    uiOptions,
  )

  if (hidden) {
    return <div style={{ display: "none" }}>{children}</div>
  }
  return (
    <WrapIfAdditionalTemplate
      classNames={classNames}
      style={style}
      disabled={disabled}
      id={id}
      label={label}
      onDropPropertyClick={onDropPropertyClick}
      onKeyChange={onKeyChange}
      readonly={readonly}
      required={required}
      schema={schema}
      uiSchema={uiSchema}
      registry={registry}
    >
      <FormControl fullWidth={true} error={rawErrors.length ? true : false} required={required}>
        {children}
        {displayLabel && rawDescription ? (
          <Box sx={{ mt: "0.5rem", ml: "1.5rem", mr: "1.5rem" }}>
            {description}
          </Box>
        ) : null}
        <Box sx={{ mt: "0.25rem", ml: "1.5rem", mr: "1.5rem" }}>
          {errors}
        </Box>
        {help}
      </FormControl>
    </WrapIfAdditionalTemplate>
  )
}
