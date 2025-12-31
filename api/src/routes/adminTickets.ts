import { Router } from 'express';
import { AdminTicketController } from '../controllers/adminTicketController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin', 'support'));

// Get ticket statistics
router.get('/stats', AdminTicketController.getTicketStats);

// Get all tickets
router.get('/', AdminTicketController.getTickets);

// Get ticket by ID
router.get('/:ticketId', AdminTicketController.getTicketById);

// Update ticket
router.put('/:ticketId', AdminTicketController.updateTicket);

// Update ticket status (quick action)
router.patch('/:ticketId/status', AdminTicketController.updateTicketStatus);

// Assign ticket
router.patch('/:ticketId/assign', AdminTicketController.assignTicket);

// Add message to ticket
router.post('/:ticketId/messages', AdminTicketController.addMessage);

// Delete ticket
router.delete('/:ticketId', AdminTicketController.deleteTicket);

export default router;

