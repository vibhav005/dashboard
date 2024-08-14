import { Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import Widget from './Widget';

const Category = ({ category }) => {
    return (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>{category.name}</Typography>
            <Grid container spacing={2}>
                {category.widgets.map(widget => (
                    <Grid item xs={12} sm={6} md={4} key={widget.id}>
                        <Widget categoryId={category.id} widget={widget} />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default Category;