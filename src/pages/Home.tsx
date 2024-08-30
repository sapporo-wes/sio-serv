import { Box, Container } from "@mui/material"
import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"
import CodeBlock from "@/components/CodeBlock"
import { useAuth } from "react-oidc-context"
import { loadUITable, loadSchema, schemaToUITable, validateInputtedUITable, convertToSchemaForForm } from "@/lib/configs"

export default function Home() {
  const auth = useAuth()
  const inputtedUITable = loadUITable(UI_TABLE_FILE_CONTENT)
  const schema = loadSchema()
  validateInputtedUITable(inputtedUITable, schemaToUITable(schema))
  const schemaForForm = convertToSchemaForForm(inputtedUITable)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, justifyContent: "center" }}>
        {auth.isAuthenticated ? (
          <>
            <h1>Auth Object の中身</h1>
            <CodeBlock language="json" codeString={JSON.stringify(auth.user, null, 2)} />
          </>
        ) : (
          <>
            <h1>Home</h1>
            {JSON.stringify(schemaForForm, null, 2)}
          </>
        )}
      </Container>
      <AppFooter />
    </Box>
  )
}
