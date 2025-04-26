import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { matBlack } from '../../constants/color';

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: '100vh',
        py: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: '1.5rem',
          width: '100%',
          height: '100%',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={700}
          textTransform="uppercase"
          mb={4}
          color={matBlack}
        >
          {heading}
        </Typography>

        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            fontFamily: 'Roboto, sans-serif',
            backgroundColor: 'white',
            borderRadius: '1rem',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: matBlack,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {
                backgroundColor: '#f5f5f5',
              },
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #ddd',
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default Table;
