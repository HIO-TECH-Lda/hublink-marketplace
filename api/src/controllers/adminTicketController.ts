import { Request, Response } from 'express';
import { AdminTicketService } from '../services/adminTicketService';
import { uploadBase64Image } from '../utils/cloudinary';

export class AdminTicketController {
  // Get ticket statistics
  static async getTicketStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminTicketService.getTicketStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get ticket statistics'
      });
    }
  }

  // Get all tickets
  static async getTickets(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
        priority: req.query.priority as string | undefined,
        category: req.query.category as string | undefined,
        assignedTo: req.query.assignedTo as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminTicketService.getTickets(filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get tickets'
      });
    }
  }

  // Get ticket by ID
  static async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const ticket = await AdminTicketService.getTicketById(ticketId);
      res.json({
        success: true,
        data: ticket
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Ticket not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get ticket'
      });
    }
  }

  // Update ticket
  static async updateTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const updateData = req.body;
      const ticket = await AdminTicketService.updateTicket(ticketId, updateData);
      res.json({
        success: true,
        message: 'Ticket updated successfully',
        data: ticket
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Ticket not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update ticket'
      });
    }
  }

  // Update ticket status (quick action)
  static async updateTicketStatus(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;

      if (!status || !['open', 'in_progress', 'waiting_for_user', 'waiting_for_third_party', 'resolved', 'closed'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: open, in_progress, waiting_for_user, waiting_for_third_party, resolved, closed'
        });
        return;
      }

      const ticket = await AdminTicketService.updateTicketStatus(ticketId, status);
      res.json({
        success: true,
        message: 'Ticket status updated successfully',
        data: ticket
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Ticket not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update ticket status'
      });
    }
  }

  // Assign ticket
  static async assignTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const ticket = await AdminTicketService.assignTicket(ticketId, userId);
      res.json({
        success: true,
        message: 'Ticket assigned successfully',
        data: ticket
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Ticket not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to assign ticket'
      });
    }
  }

  // Add message to ticket
  static async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      const { message, isInternal, attachments } = req.body;
      const userId = (req as any).user?.userId;
      const userType = (req as any).user?.role || 'admin';

      if (!message) {
        res.status(400).json({
          success: false,
          message: 'Message is required'
        });
        return;
      }

      // Handle attachments if provided (base64 images)
      let processedAttachments: any[] = [];
      if (attachments && Array.isArray(attachments)) {
        for (const attachment of attachments) {
          if (attachment.base64) {
            const uploaded = await uploadBase64Image(attachment.base64, 'tickets/attachments');
            processedAttachments.push({
              fileName: attachment.fileName || 'attachment',
              fileUrl: uploaded.url,
              publicId: uploaded.publicId,
              fileSize: attachment.fileSize || 0,
              mimeType: attachment.mimeType || 'image/jpeg'
            });
          } else if (attachment.fileUrl) {
            processedAttachments.push(attachment);
          }
        }
      }

      const ticket = await AdminTicketService.addMessage(ticketId, userId, userType, {
        message,
        isInternal: isInternal || false,
        attachments: processedAttachments
      });

      res.json({
        success: true,
        message: 'Message added successfully',
        data: ticket
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Ticket not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add message'
      });
    }
  }

  // Delete ticket
  static async deleteTicket(req: Request, res: Response): Promise<void> {
    try {
      const { ticketId } = req.params;
      await AdminTicketService.deleteTicket(ticketId);
      res.json({
        success: true,
        message: 'Ticket deleted successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Ticket not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete ticket'
      });
    }
  }
}

