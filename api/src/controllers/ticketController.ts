import { Request, Response } from 'express';
import { TicketService } from '../services/ticketService';

export class TicketController {
  /**
   * Create a new ticket
   */
  static async createTicket(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const userType = req.user!.role as 'buyer' | 'seller' | 'admin';
      const { title, description, category, priority, orderId, productId, tags, attachments } = req.body;

      const ticket = await TicketService.createTicket(userId, userType, {
        title,
        description,
        category,
        priority,
        orderId,
        productId,
        tags,
        attachments
      });

      return res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: ticket
      });
    } catch (error: any) {
      console.error('Create ticket error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create ticket'
      });
    }
  }

  /**
   * Get user's tickets
   */
  static async getUserTickets(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const {
        page = 1,
        limit = 20,
        status,
        category,
        priority,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const result = await TicketService.getUserTickets(userId, {
        page: Number(page),
        limit: Number(limit),
        status: status as any,
        category: category as any,
        priority: priority as any,
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      return res.status(200).json({
        success: true,
        message: 'Tickets retrieved successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Get user tickets error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve tickets'
      });
    }
  }

  /**
   * Get single ticket
   */
  static async getTicketById(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      const ticket = await TicketService.getTicketById(ticketId, userId, userRole);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Ticket retrieved successfully',
        data: ticket
      });
    } catch (error: any) {
      console.error('Get ticket error:', error);
      if (error.message.includes('permission')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve ticket'
      });
    }
  }

  /**
   * Update ticket
   */
  static async updateTicket(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const { status, priority, assignedTo, tags } = req.body;

      const ticket = await TicketService.updateTicket(ticketId, userId, userRole, {
        status,
        priority,
        assignedTo,
        tags
      });

      return res.status(200).json({
        success: true,
        message: 'Ticket updated successfully',
        data: ticket
      });
    } catch (error: any) {
      console.error('Update ticket error:', error);
      if (error.message.includes('permission')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update ticket'
      });
    }
  }

  /**
   * Add message to ticket
   */
  static async addMessage(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const userId = req.user!.userId;
      const userType = req.user!.role as 'buyer' | 'seller' | 'admin' | 'support';
      const { message, isInternal, attachments } = req.body;

      const ticket = await TicketService.addMessage(ticketId, userId, userType, {
        message,
        isInternal,
        attachments
      });

      return res.status(201).json({
        success: true,
        message: 'Message added successfully',
        data: ticket.messages[ticket.messages.length - 1]
      });
    } catch (error: any) {
      console.error('Add message error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to add message'
      });
    }
  }

  /**
   * Get all tickets (admin/support only)
   */
  static async getAllTickets(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        category,
        priority,
        assignedTo,
        userId,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const result = await TicketService.getAllTickets({
        page: Number(page),
        limit: Number(limit),
        status: status as any,
        category: category as any,
        priority: priority as any,
        assignedTo: assignedTo as string,
        userId: userId as string,
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      return res.status(200).json({
        success: true,
        message: 'Tickets retrieved successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Get all tickets error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve tickets'
      });
    }
  }

  /**
   * Get ticket statistics
   */
  static async getTicketStatistics(req: Request, res: Response) {
    try {
      const { startDate, endDate, category, assignedTo } = req.query;

      const result = await TicketService.getTicketStatistics({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        category: category as any,
        assignedTo: assignedTo as string
      });

      return res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Get statistics error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve statistics'
      });
    }
  }

  /**
   * Delete ticket
   */
  static async deleteTicket(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;

      await TicketService.deleteTicket(ticketId);

      return res.status(200).json({
        success: true,
        message: 'Ticket deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete ticket error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete ticket'
      });
    }
  }

  /**
   * Upload attachment to ticket
   */
  static async uploadAttachment(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const { fileName, fileSize, mimeType, base64, messageId } = req.body;

      const attachment = await TicketService.uploadTicketAttachment(
        ticketId,
        { fileName, fileSize, mimeType, base64 },
        messageId
      );

      return res.status(201).json({
        success: true,
        message: 'Attachment uploaded successfully',
        data: attachment
      });
    } catch (error: any) {
      console.error('Upload attachment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to upload attachment'
      });
    }
  }

  /**
   * Delete attachment
   */
  static async deleteAttachment(req: Request, res: Response) {
    try {
      const { ticketId, attachmentId } = req.params;
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      await TicketService.deleteAttachment(ticketId, attachmentId, userId, userRole);

      return res.status(200).json({
        success: true,
        message: 'Attachment deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete attachment error:', error);
      if (error.message.includes('permission')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete attachment'
      });
    }
  }
}

