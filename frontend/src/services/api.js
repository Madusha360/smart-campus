const API_BASE_URL = 'http://localhost:8080/api';

export const getResources = async () => {
    const response = await fetch(`${API_BASE_URL}/resources`);
    if (!response.ok) throw new Error('Failed to fetch resources');
    return response.json();
};

export const createResource = async (resource) => {
    const response = await fetch(`${API_BASE_URL}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource),
    });
    if (!response.ok) throw new Error('Failed to create resource');
    return response.json();
};

export const getBookings = async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
};

export const createBooking = async (booking) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
    });
    if (response.status === 409) throw new Error('Scheduling conflict detected for this resource.');
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
};

export const updateBookingStatus = async (id, statusData) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData),
    });
    if (!response.ok) throw new Error('Failed to update booking status');
    return response.json();
};

export const getTickets = async () => {
    const response = await fetch(`${API_BASE_URL}/tickets`);
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return response.json();
};

export const createTicket = async (ticket) => {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket),
    });
    if (!response.ok) throw new Error('Failed to create ticket');
    return response.json();
};

export const updateTicketStatus = async (id, statusData) => {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData),
    });
    if (!response.ok) throw new Error('Failed to update ticket status');
    return response.json();
};
