import {
    Add as AddIcon,
    BarChart as BarChartIcon,
    ChevronRight as ChevronRightIcon,
    Close as CloseIcon,
    PieChart as PieChartIcon,
    Remove as RemoveIcon,
    TextFields as TextFieldsIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Drawer,
    Grid,
    IconButton,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addWidget } from '../store/dashboardSlice';

const ColorInput = styled('input')({
    width: '40px',
    height: '40px',
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    overflow: 'hidden',
    cursor: 'pointer',
    '&::-webkit-color-swatch-wrapper': {
        padding: 0,
    },
    '&::-webkit-color-swatch': {
        border: 'none',
        borderRadius: '50%',
    },
});

const StyledCard = styled(Card)(({ theme, selected }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[10],
    },
    ...(selected && {
        backgroundColor: theme.palette.primary.light,
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[10],
    }),
}));

const AddWidgetDrawer = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.dashboard.categories);

    const [activeStep, setActiveStep] = useState(0);
    const [categoryId, setCategoryId] = useState('');
    const [widgetName, setWidgetName] = useState('');
    const [widgetType, setWidgetType] = useState('');
    const [textContent, setTextContent] = useState('');
    const [labels, setLabels] = useState(['', '']);
    const [data, setData] = useState(['', '']);
    const [backgroundColors, setBackgroundColors] = useState(['#36A2EB', '#FFCE56']);
    const [isNextDisabled, setIsNextDisabled] = useState(true);

    useEffect(() => {
        const isConfigValid = () => {
            if (widgetType === 'text') {
                return widgetName.trim() !== '' && textContent.trim() !== '';
            } else {
                return (
                    widgetName.trim() !== '' &&
                    labels.every((label) => label.trim() !== '') &&
                    data.every((value) => value.trim() !== '')
                );
            }
        };

        setIsNextDisabled(!isConfigValid());
    }, [widgetName, widgetType, textContent, labels, data]);

    const steps = ['Select Category', 'Choose Widget Type', 'Configure Widget', 'Review'];

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = () => {
        if (categoryId && widgetName && widgetType) {
            let widgetData;
            if (widgetType === 'text') {
                widgetData = { content: textContent };
            } else {
                widgetData = {
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                data: data.map(Number),
                                backgroundColor: backgroundColors,
                            },
                        ],
                    },
                };

                if (widgetType === 'bar') {
                    widgetData.data.datasets[0].label = 'Number of Issues';
                }
            }

            dispatch(
                addWidget({
                    categoryId,
                    widget: {
                        id: Date.now().toString(),
                        name: widgetName,
                        type: widgetType,
                        ...widgetData,
                    },
                })
            );
            onClose();
        }
    };

    const handleColorChange = (index, color) => {
        const newColors = [...backgroundColors];
        newColors[index] = color;
        setBackgroundColors(newColors);
    };

    const addDataPoint = () => {
        setLabels([...labels, '']);
        setData([...data, '']);
        setBackgroundColors([...backgroundColors, '#000000']);
    };

    const removeDataPoint = (index) => {
        const newLabels = labels.filter((_, i) => i !== index);
        const newData = data.filter((_, i) => i !== index);
        const newColors = backgroundColors.filter((_, i) => i !== index);
        setLabels(newLabels);
        setData(newData);
        setBackgroundColors(newColors);
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        {categories.map((category) => (
                            <Grid item xs={6} key={category.id}>
                                <StyledCard
                                    onClick={() => setCategoryId(category.id)}
                                    selected={categoryId === category.id}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{category.name}</Typography>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        {[
                            { type: 'text', icon: TextFieldsIcon, label: 'Text' },
                            { type: 'doughnut', icon: PieChartIcon, label: 'Doughnut Chart' },
                            { type: 'bar', icon: BarChartIcon, label: 'Bar Chart' },
                        ].map(({ type, icon: Icon, label }) => (
                            <Grid item xs={4} key={type}>
                                <StyledCard
                                    onClick={() => setWidgetType(type)}
                                    selected={widgetType === type}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Icon fontSize="large" />
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {label}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 2:
                return (
                    <Box>
                        <TextField
                            label="Widget Name"
                            value={widgetName}
                            onChange={(e) => setWidgetName(e.target.value)}
                            fullWidth
                            required
                            sx={{ mb: 2 }}
                        />
                        {widgetType === 'text' ? (
                            <TextField
                                label="Widget Text"
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                required
                                sx={{ mb: 2 }}
                            />
                        ) : (
                            <>
                                {labels.map((label, index) => (
                                    <Paper elevation={3} key={index} sx={{ p: 2, mb: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={5}>
                                                <TextField
                                                    label={`Label ${index + 1}`}
                                                    value={label}
                                                    onChange={(e) => {
                                                        const newLabels = [...labels];
                                                        newLabels[index] = e.target.value;
                                                        setLabels(newLabels);
                                                    }}
                                                    fullWidth
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={5}>
                                                <TextField
                                                    label={`Data ${index + 1}`}
                                                    value={data[index]}
                                                    onChange={(e) => {
                                                        const newData = [...data];
                                                        newData[index] = e.target.value;
                                                        setData(newData);
                                                    }}
                                                    fullWidth
                                                    required
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <Tooltip title={`Color for ${label || `Data ${index + 1}`}`} arrow>
                                                        <ColorInput
                                                            type="color"
                                                            value={backgroundColors[index]}
                                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                                        />
                                                    </Tooltip>
                                                    {index > 1 && (
                                                        <Tooltip title="Remove Data Point" arrow>
                                                            <IconButton onClick={() => removeDataPoint(index)} size="small" sx={{ ml: 1 }}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={addDataPoint}
                                    fullWidth
                                >
                                    Add Data Point
                                </Button>
                            </>
                        )}
                    </Box>
                );
            case 3:
                return (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Review Your Widget
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography><strong>Category:</strong> {categories.find((c) => c.id === categoryId)?.name}</Typography>
                        <Typography><strong>Widget Name:</strong> {widgetName}</Typography>
                        <Typography><strong>Widget Type:</strong> {widgetType}</Typography>
                        {widgetType === 'text' ? (
                            <Typography><strong>Content:</strong> {textContent}</Typography>
                        ) : (
                            <>
                                <Typography><strong>Labels:</strong> {labels.join(', ')}</Typography>
                                <Typography><strong>Data:</strong> {data.join(', ')}</Typography>
                                <Typography><strong>Colors:</strong></Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                    {backgroundColors.map((color, index) => (
                                        <Tooltip key={index} title={labels[index] || `Color ${index + 1}`} arrow>
                                            <Box
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    backgroundColor: color,
                                                    borderRadius: '50%',
                                                    border: '1px solid #ccc',
                                                }}
                                            />
                                        </Tooltip>
                                    ))}
                                </Box>
                            </>
                        )}
                    </Paper>
                );
            default:
                return null;
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 550, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">Add Widget</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ minHeight: '400px' }}>
                    {renderStepContent(activeStep)}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} />}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                        disabled={
                            (activeStep === 0 && !categoryId) ||
                            (activeStep === 1 && !widgetType) ||
                            (activeStep === 2 && isNextDisabled)
                        }
                        endIcon={activeStep === steps.length - 1 ? <AddIcon /> : <ChevronRightIcon />}
                    >
                        {activeStep === steps.length - 1 ? 'Add Widget' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default AddWidgetDrawer;