import express from 'express';
import { TicketController } from '../controllers/ticketController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateRequest, createTicketSchema, updateTicketSchema, addMessageSchema, uploadAttachmentSchema } from '../utils/validation';

const router = express.Router();

// Create ticket (all authenticated users)
router.post('/', 
  authenticateToken, 
  validateRequest(createTicketSchema), 
  TicketController.createTicket
);

// Get user's tickets
router.get('/my-tickets', 
  authenticateToken, 
  TicketController.getUserTickets
);

// Get single ticket
router.get('/:ticketId', 
  authenticateToken, 
  TicketController.getTicketById
);

// Update ticket (admin/support only)
router.patch('/:ticketId', 
  authenticateToken, 
  authorizeRoles('admin', 'support'), 
  validateRequest(updateTicketSchema), 
  TicketController.updateTicket
);

// Add message to ticket
router.post('/:ticketId/messages', 
  authenticateToken, 
  validateRequest(addMessageSchema), 
  TicketController.addMessage
);

// Upload attachment to ticket
router.post('/:ticketId/attachments', 
  authenticateToken, 
  validateRequest(uploadAttachmentSchema), 
  TicketController.uploadAttachment
);

// Delete attachment
router.delete('/:ticketId/attachments/:attachmentId', 
  authenticateToken, 
  TicketController.deleteAttachment
);

// Get all tickets (admin/support only)
router.get('/', 
  authenticateToken, 
  authorizeRoles('admin', 'support'), 
  TicketController.getAllTickets
);

// Get ticket statistics (admin/support only)
router.get('/statistics', 
  authenticateToken, 
  authorizeRoles('admin', 'support'), 
  TicketController.getTicketStatistics
);

// Delete ticket (admin only)
router.delete('/:ticketId', 
  authenticateToken, 
  authorizeRoles('admin'), 
  TicketController.deleteTicket
);

export default router;

