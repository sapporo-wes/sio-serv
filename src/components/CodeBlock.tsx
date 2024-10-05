import { Check, FileCopyOutlined, UnfoldLessOutlined, UnfoldMoreOutlined } from "@mui/icons-material"
import { Card, Tooltip, IconButton, Box } from "@mui/material"
import { SxProps } from "@mui/system"
import { useState } from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs"

interface CodeBlockProps {
  sx?: SxProps
  codeString: string
  language?: string
}

export default function CodeBlock({ sx, codeString, language }: CodeBlockProps) {
  codeString = codeString ?? ""

  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    })
  }

  const codeLines = codeString.split("\n")
  const headCodeString = codeLines.length <= 10 ?
    codeString :
    `${codeLines.slice(0, 10).join("\n")}\n... truncated (click the icon in the upper right to expand) ...`

  return (
    <Card sx={{ ...sx, position: "relative" }} variant="outlined">
      <IconButton onClick={() => setIsExpanded(!isExpanded)} sx={{ position: "absolute", top: 8, right: 8, cursor: "pointer" }}>
        {isExpanded ? <UnfoldLessOutlined /> : <UnfoldMoreOutlined />}
      </IconButton>
      <Tooltip title="Copied!" arrow placement="left" open={copied} disableFocusListener disableHoverListener disableTouchListener>
        <IconButton onClick={handleCopy} sx={{ position: "absolute", top: 8, right: 48, cursor: "pointer" }} >
          {copied ? <Check /> : <FileCopyOutlined />}
        </IconButton>
      </Tooltip>
      <Box sx={{
        ["& .react-syntax-highlighter-line-number"]: {
          minWidth: "5em",
        },
      }}>
        <SyntaxHighlighter
          showLineNumbers
          language={language}
          style={github}
          customStyle={{ margin: 0, padding: "1rem 0.5rem", fontSize: "0.8rem", overflowX: "auto" }}
          lineNumberStyle={{ minWidth: "3em" }}
        >
          {isExpanded ? codeString : headCodeString}
        </SyntaxHighlighter>
      </Box>
    </Card >
  )
}
