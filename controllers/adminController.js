const User = require('../models/userModel');
/**
 * @module controllers/adminController
 * Responsible for defining the server's response to requests/responses that
 * only admins can perform. 
 * 
 * Operations include:
 * - (de/pro)moting users to/from admin status
 * - (once implemented) changing the server-side default color theme, make sure to get tailwind first!
 * - (once implemented) modifying viewing permissions for stored files
 * - (once implemented) modifying user-specific permissions 
 * 
 * 
*/


/*                      [ user management ]                     */

/**
 * Approves a user who has submitted a registration request
 * @todo consider implementing an audit-like service that tracks the userId of approval ops
 * @param {*} req contains information about the pending user account that will be updated
 * @param {*} res 
 */
exports.approveNewUser = async (req, res) => { 
    const { userId }= req.params;
    try {
        const result = await User.approveUser(userId);
    } catch(err) {
        console.error('Error approving user:', err);
        res.status(500).json({error: 'Internal server error'});
    }
}

/** Denies a user who has submitted a registration request
 * @todo consider implementing an audit-like service that tracks the userId of approval ops
 * @param {*} req 
 * @param {*} res 
 */
exports.denyNewUser = async (req, res) => {
    // the only thing that I can think makes sense to put here is any kind of message that
    // gets loaded, as opposed to a hard-coded one.  Just saying "Request Denied" is dirty
    // but should get the job done of informing the end user
}


/**
 * Gets all users from the database, both pending and registered
 * @param {*} req 
 * @param {*} res 
 */
exports.getAllUsers = async (req, res) => {
    try {
        const result = await User.getAllUsers();
    } catch(err) {
        console.error('Error fetching users:', err);
        res.status(500).json({error: 'Internal server error'});
    }
}

/**
 * Retrieves registration requests awaiting review, so that they can be built into a table
 * @param {*} req 
 * @param {*} res 
 */
exports.getPendingUsers = async (req, res) => {
    
}


/**
 * Retrieves users who have been approved and have access to view one or more uploaded files
 * @param {*} req 
 * @param {*} res 
 */
exports.getRegisteredUsers = async (req, res) => {

}

/**
 * Fetches a user by their userId, which should ideally come from a React-component.  This
 * could be a table, a form, etc.
 * @param {*} req 
 * @param {*} res 
 */
exports.getUserById = async (req, res) => {
    const {userId} = req.params;
    try {
        const result = await User.getUserById();

    } catch(err) {
        console.error('Error fetching user:', err);
        res.status(500).json({error: 'Internal server error'});
    }
}



// admin-only overrides for other controllers like fileController

/**
 * Q: I want admins to be able to delete files through conditional rendering
 * based on the user's `isAdmin` trait.  
 * 
 * - requires deleteFile to be implemented in fileController.js,
 * 
 **/

// access cotnrol