import { AccountCircleOutlined, ArrowDropDownOutlined, LoginOutlined, LogoutOutlined, Check, FileCopyOutlined } from "@mui/icons-material"
import { Button, Menu, MenuItem } from "@mui/material"
import { SxProps, darken } from "@mui/system"
import React from "react"
import { useAuth } from "react-oidc-context"

import AppHeaderBase from "@/components/AppHeaderBase"
import theme from "@/theme"

export interface AppHeaderProps {
  sx?: SxProps
}

export default function AppHeader({ sx }: AppHeaderProps) {
  const auth = useAuth()

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null)
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(auth.user?.access_token || "").then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    })
  }

  return (
    <AppHeaderBase
      sx={sx}
      rightContent={
        auth.isAuthenticated ? (
          <>
            <Button
              variant="text"
              sx={{
                color: "white",
                textTransform: "none",
                "&:hover": {
                  bgcolor: darken(theme.palette.primary.dark, 0.2),
                },
              }}
              onClick={(e) => { setMenuAnchorEl(e.currentTarget) }}
            >
              <AccountCircleOutlined sx={{ mr: "0.5rem" }} />
              {auth.user?.profile.preferred_username}
              <ArrowDropDownOutlined />
            </Button>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={() => setMenuAnchorEl(null)}
            >
              <MenuItem onClick={handleCopy}>
                {copied ? <>
                  <Check sx={{ mr: "0.5rem" }} />
                  {"Copied!"}
                </> : <>
                  <FileCopyOutlined sx={{ mr: "0.5rem" }} />
                  {"Copy Access Token"}
                </>}
              </MenuItem>
              <MenuItem onClick={() => auth.removeUser()}>
                <LogoutOutlined sx={{ mr: "0.5rem" }} />
                {"Sign Out"}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            sx={{
              color: "white",
              textTransform: "none",
              border: "1px solid white",
              "&:hover": {
                bgcolor: darken(theme.palette.primary.dark, 0.2),
              },
            }}
            onClick={() => auth.signinRedirect()}
          >
            <LoginOutlined sx={{ mr: "0.5rem" }} />
            {"Sign In"}
          </Button>
        )
      }
    />
  )
}
