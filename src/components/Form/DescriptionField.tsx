// https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/mui/src/DescriptionField/DescriptionField.tsx

import { Link } from "@mui/material"
import Typography from "@mui/material/Typography"
import { DescriptionFieldProps, FormContextType, RJSFSchema, StrictRJSFSchema } from "@rjsf/utils"
import React from "react"

import { theme } from "@/theme"

const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s)]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <Link
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: theme.palette.primary.light, textDecoration: "none" }}
          children={part}
        />
      )
    }
    return part
  })
}

const addLineBreaks = (content: (string | JSX.Element)[]) => {
  return content.flatMap((part, index) =>
    typeof part === "string"
      ? part.split("\n").map((line, lineIndex) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < part.split("\n").length - 1 && <br />}
        </React.Fragment>
      ))
      : [part],
  )
}

/** The `DescriptionField` is the template to use to render the description of a field
 *
 * @param props - The `DescriptionFieldProps` for this component
 */
export default function DescriptionField<
  T = any, // eslint-disable-line
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any, // eslint-disable-line
>(props: DescriptionFieldProps<T, S, F>) {
  const { id, description } = props
  if (description) {
    const linkedDescription = linkify(description as string)
    const content = addLineBreaks(linkedDescription)
    return (
      <Typography id={id} style={{ color: theme.palette.text.secondary }}>
        {content}
      </Typography>
    )
  }

  return null
}
