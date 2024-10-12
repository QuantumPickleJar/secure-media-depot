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
// user approval
exports.approveUser = async (req, res) => { 
    const { userId }= req.params;
    try {
        const result = await User.approveUser(userId);
    } catch(err) {
        console.error('Error approving user:', err);
        res.status(500).json({error: 'Internal server error'});
    }
}


exports.getAllUsers = async (req, res) => {
    try {
        const result = await User.getAllUsers();
    } catch(err) {
        console.error('Error fetching users:', err);
        res.status(500).json({error: 'Internal server error'});
    }
}
// user management


// admin-only overrides for other controllers like fileController

// access cotnrol