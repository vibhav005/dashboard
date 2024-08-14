import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [
        {
            id: 'cspm_executive',
            name: 'CSPM Executive Dashboard',
            widgets: [
                {
                    id: 'cloud_accounts',
                    name: 'Cloud Accounts',
                    type: 'doughnut',
                    data: {
                        labels: ['Connected', 'Not Connected'],
                        datasets: [{
                            data: [2, 2],
                            backgroundColor: ['#36A2EB', '#FFCE56'],
                        }],
                    },
                },
                {
                    id: 'cloud_risk',
                    name: 'Cloud Account Risk Assessment',
                    type: 'doughnut',
                    data: {
                        labels: ['Failed', 'Warning', 'Not Available', 'Passed'],
                        datasets: [{
                            data: [1965, 569, 98, 7027],
                            backgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0', '#36A2EB'],
                        }],
                    },
                },
            ],
        },
        {
            id: 'registry_scan',
            name: 'Registry Scan',
            widgets: [
                {
                    id: 'image_risk_assessment',
                    name: 'Image Risk Assessment',
                    type: 'bar',
                    data: {
                        labels: ['Critical', 'High', 'Medium', 'Low'],
                        datasets: [{
                            label: 'Number of Issues',
                            data: [4, 962, 300, 204],
                            backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB', '#4BC0C0'],
                        }],
                    },
                },
                {
                    id: 'image_security_issues',
                    name: 'Image Security Issues',
                    type: 'bar',
                    data: {
                        labels: ['Critical', 'High'],
                        datasets: [{
                            label: 'Number of Issues',
                            data: [1, 1],
                            backgroundColor: ['#FF6384', '#FFCE56'],
                        }],
                    },
                },
            ],
        },
    ],
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        addWidget: (state, action) => {
            const { categoryId, widget } = action.payload;
            const category = state.categories.find(c => c.id === categoryId);
            if (category) {
                category.widgets.push(widget);
            }
        },
        removeWidget: (state, action) => {
            const { categoryId, widgetId } = action.payload;
            const category = state.categories.find(c => c.id === categoryId);
            if (category) {
                category.widgets = category.widgets.filter(w => w.id !== widgetId);
            }
        },
    },
});

export const { addWidget, removeWidget } = dashboardSlice.actions;
export default dashboardSlice.reducer;