// imports
const models = require('../models');
const UserAuth = require('../middleware/UserAuth');

// controller obj
const taskController = {};

// get user's tasks
taskController.getAll = async (req, res) =>
{
    try {
        // grab user
        const user = await UserAuth.authorizeUser(req.headers.authorization);
        // check if user exists
        if (user)
        {
            // grab tasks with tickets and callers
            const tasks = await user.getTaskedTickets({ include: [ { model: models.ticket, include: [ { model: models.user }] }]});
            // check if tasks exist
            if (tasks.length > 0)
            {
                // encrypt tasks
                const encryptedTasks = tasks.map(t =>
                {
                    return t.encrypted(true);
                });
                // return tasks
                res.json({ tasks: encryptedTasks });
            }
            // no tasks
            else
            {
                // status 404 - could not be found
                res.status(404).json({ error: 'no tasks found' });
            }
        }
        // no user
        else
        {
            // status 401 - unauthorized
            res.status(401).json({ error: 'unauthorized to get tasks' });
        }
    } catch (error) {
        console.log(error);
        // status 400 - bad request
        res.status(400).json({ error: 'failed to get tasks' });
    }
}


module.exports = taskController;