import { List, ListItem, ListItemText, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const SearchWidget = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const categories = useSelector(state => state.dashboard.categories);

    const allWidgets = categories.flatMap(category =>
        category.widgets.map(widget => ({ ...widget, categoryName: category.name }))
    );

    const filteredWidgets = allWidgets.filter(widget =>
        widget.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <TextField
                label="Search Widgets"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
            />
            {searchTerm && (
                <List>
                    {filteredWidgets.map(widget => (
                        <ListItem key={widget.id}>
                            <ListItemText
                                primary={widget.name}
                                secondary={`Category: ${widget.categoryName}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

export default SearchWidget;