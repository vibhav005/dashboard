import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, ButtonGroup, Container, Grid, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddWidgetDrawer from "./AddWidgetForm";
import Navbar from './Navbar';
import Widget from './Widget';

const Dashboard = () => {
    const categories = useSelector(state => state.dashboard.categories);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const allWidgets = categories.flatMap(category =>
        category.widgets.map(widget => ({ ...widget, categoryId: category.id }))
    );

    const filteredWidgets = allWidgets.filter(widget =>
        widget.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Navbar onSearch={setSearchTerm} />
            <Toolbar />
            <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
                <Typography variant="h1">Dashboard</Typography>
                <ButtonGroup variant='outlined' sx={{ display: 'flex', justifyContent: "flex-end", alignItems: 'center', mb: 3 }}>
                    <Button
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setDrawerOpen(true)}
                    >
                        Add Widget
                    </Button>
                    <Button
                        color="primary"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                </ButtonGroup>
                <Grid container spacing={2}>
                    {filteredWidgets.map(widget => (
                        <Grid item xs={12} sm={6} md={4} key={`${widget.id}-${refreshKey}`}>
                            <Widget categoryId={widget.categoryId} widget={widget} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <AddWidgetDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </Box>
    );
};

export default Dashboard;
