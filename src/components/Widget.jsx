import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useDispatch } from 'react-redux';
import { removeWidget } from '../store/dashboardSlice';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Widget = ({ categoryId, widget }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmRemove = () => {
        dispatch(removeWidget({ categoryId, widgetId: widget.id }));
        setOpen(false);
    };

    const renderContent = () => {
        switch (widget.type) {
            case 'doughnut':
                return <Doughnut data={widget.data} options={{ responsive: true, maintainAspectRatio: false }} />;
            case 'bar':
                return <Bar data={widget.data} options={{ responsive: true, maintainAspectRatio: false }} />;
            default:
                return <Typography variant="body1">{widget.content}</Typography>;
        }
    };

    return (
        <>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h3" component="div">
                            {widget.name}
                        </Typography>
                        <IconButton size="small" onClick={handleOpen} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
                        {renderContent()}
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this widget?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmRemove} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Widget;
