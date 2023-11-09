import { createTheme } from '@mantine/core';

export const theme = createTheme({});

export const cssMainSize = 'calc(100vh - var(--app-shell-header-height) - 64px)';
export const cssHalfMainSize = `calc(${cssMainSize} / 2)`;
