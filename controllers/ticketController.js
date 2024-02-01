// imports
const models = require('../models');
const UserAuth = require('../middleware/UserAuth');

// controller obj
const ticketController = {};

// create ticket
ticketController.submit = async (req, res) =>
{
    try {
        // grab authorized user
        const user = await UserAuth.authorizeUser(req.headers.authorization);
        // check if user exists
        if (user)
        {
            // create ticket
            const ticket = await models.ticket.create({
                title: req.body.title,
                description: req.body.description,
                complete: false
            });
            // add user to ticket
            await ticket.setUser(user);
            // return ticket
            res.json({ ticket: ticket.encrypted() });
        }
        // no user
        else
        {
            // status 404 - could not be found
            res.status(404).json({ error: 'no user found' });
        }
    } catch (error) {
        console.log(error);
        // status 400 - bad request
        res.status(400).json({ error: 'failed to submit ticket' });
    }
}

// get all tickets
ticketController.getAll = async (req, res) =>
{
    try {
        // grab admin
        const admin = await UserAuth.authorizeAdmin(req.headers.authorization);
        // check if admin exists
        if (admin)
        {
            // grab tickets
            const tickets = await models.ticket.findAll({ include: [ { model: models.user }]});
            // check if tickets exist
            if (tickets.length > 0)
            {
                // get encrypted tickets
                const encryptedTickets = tickets.map(t =>
                {
                    return t.encrypted();
                });
                // return tickets with encrypted users
                res.json({ tickets: encryptedTickets });
            }
            // no tickets
            else
            {
                // status 404 - could not be found
                res.status(404).json({ error: 'no tickets found' });
            }
        }
        // no admin
        else
        {
            // status 401 - unauthorized
            res.status(401).json({ error: 'unauthorized to get tickets' });
        }
    } catch (error) {
        console.log(error);
        // status 400 - bad request
        res.status(400).json({ error: 'failed to get tickets' });
    }
}

// get user's tickets
ticketController.getMine = async (req, res) =>
{
    try {
        // grab user
        const user = await UserAuth.authorizeUser(req.headers.authorization);
        // check if user exists
        if (user)
        {
            // grab tickets
            const tickets = await user.getTickets({ include: [ { model: models.user }]});
            // check if tickets exist
            if (tickets.length > 0)
            {
                // get encrypted tickets
                const encryptedTickets = tickets.map(t =>
                {
                    return t.encrypted(true);
                });
                // return tickets with encrypted user
                res.json({ tickets: encryptedTickets });
            }
            // no tickets
            else
            {
                // status 404 - could not be found
                res.status(404).json({ error: 'no tickets found' });
            }
        }
        // no user
        else
        {
            // status 401 - unauthorized
            res.status(401).json({ error: 'unauthorized to get tickets' });
        }
    } catch (error) {
        console.log(error);
        // status 400 - bad request
        res.status(400).json({ error: 'failed to get tickets' });
    }
}

// assign ticket
ticketController.assign = async (req, res) =>
{
    try {
        // grab admin
        const admin = await UserAuth.authorizeAdmin(req.headers.authorization);
        // check if admin exists
        if (admin)
        {
            // grab user to assign
            const user = await models.user.findOne({ where: { email: req.body.email }});
            // check if user exists
            if (user)
            {
                // grab ticket to assign
                const ticket = await models.ticket.findOne({ where: { id: req.params.id }});
                // find or create tasked ticket
                const [taskedTicket, created] = await models.taskedTicket.findOrCreate({ where: { ticketId: ticket.id }});
                // check if tasked ticket was created
                if (created)
                {
                    // add ticket id to tasked ticket
                    await taskedTicket.setTicket(ticket);
                    // assign user to ticket
                    await taskedTicket.setUser(user);
                    // reload tasked ticket
                    await taskedTicket.reload();
                }
                // tasked ticket found - reassign
                else
                {
                    // grab assigned user
                    const assigned = await taskedTicket.getUser();
                    // make sure user is not already assigned
                    if (assigned !== user)
                    {
                        // reassign user to ticket
                        await taskedTicket.setUser(user);
                        // reload tasked ticket
                        await taskedTicket.reload();
                    }
                }
                // return ticket and tasked ticket
                res.json({ ticket: ticket.encrypted(), taskedTicket: taskedTicket.encrypted() });
            }
            // no user
            else
            {
                // status 404 - could not be found
                res.status(404).json({ error: 'no user with email found' });
            }
        }
        // no admin
        else
        {
            // status 401 - unauthorized
            res.status(401).json({ error: 'unauthorized to assign ticket' });
        }
    } catch (error) {
        console.log(error);
        // status 400 - bad request
        res.status(400).json({ error: 'failed to assign ticket' });
    }
}

// mark ticket as complete
ticketController.complete = async (req, res) =>
{
    try {
        // grab admin
        const admin = await UserAuth.authorizeAdmin(req.headers.authorization);
        // check if admin exists
        if (admin)
        {
            // grab ticket
            const ticket = await models.ticket.findOne({ where: { id: req.params.id }});
            // check if ticket exists
            if (ticket)
            {
                // check if ticket is already complete
                if (ticket.complete)
                {
                    // mark as incomplete
                    ticket.update({ "complete": false });
                    // return ticket
                    res.json({ ticket: ticket.encrypted() });
                }
                // ticket not complete
                else
                {
                    // complete ticket
                    ticket.update({ "complete": true });
                    // return ticket
                    res.json({ ticket: ticket.encrypted() });
                }
            }
            // no ticket
            else
            {
                // status 404 - could not be found
                res.status(404).json({ error: 'no ticket found' });
            }
        }
        // no admin
        else
        {
            // status 401 - unauthorized
            res.status(401).json({ error: 'unauthorized to complete ticket' });
        }
    } catch (error) {
        console.log(error);
        // status 400 - bad request
        res.status(400).json({ error: 'failed to complete ticket' });
    }
}


module.exports = ticketController;