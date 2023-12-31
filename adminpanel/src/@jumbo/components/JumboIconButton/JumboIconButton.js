import React from 'react';
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { alpha } from "@mui/material/styles";

const JumboIconButton = ({ children, elevation, badge, newnotification, ...restProps }) => {

  return (
    <IconButton
      sx={{
        width: 40,
        height: 40,
        boxShadow: elevation,
        padding: 1.25,
      }}
      {...restProps}
    >
      {
        newnotification === '0' ?
          badge ?
            <Badge
              variant={badge.variant}
              sx={{
                '& .MuiBadge-badge': {
                  top: -5,
                  right: -5,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: 2,
                  borderColor: 'common.white',
                  boxShadow: theme => `0 0.5rem 1.25rem ${alpha(theme.palette.primary.main, .7)}`,
                  backgroundImage: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  animation: 'blink 1s infinite', // Add blink animation
                },
                // Define the animation keyframes
                '@keyframes blink': {
                  '0%': {
                    opacity: 0,
                  },
                  '50%': {
                    opacity: 1,
                  },
                  '100%': {
                    opacity: 0,
                  },
                },
              }}
            >
              {children}
            </Badge>
            :
            null
          :
          children

      }
    </IconButton>
  );
};

export default JumboIconButton;
